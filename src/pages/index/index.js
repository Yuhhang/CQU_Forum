import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import React, { useContext, useEffect, useState } from 'react';
import instance from '../../components/axios';
import Card from '../../components/Card';
import userContext from '../../context/userContext';


const useStyles = makeStyles(() => ({
  root: {
    marginBottom: '56px',
  },
}));

let fetchPostLock = false;

const offsetBase = 20;
let offsetCount = 1;
let latestPostTime = 0;

function MainPage() {
  const context = useContext(userContext); // global user context
  const [posts, setPosts] = useState(null);
  const [showProgress, setShowProgress] = useState(false);
  const classes = useStyles();

  function renderCard(data) {
    const postList = data.map(post => (
      <Card
        key={post.postId}
        postId={post.postId}
        userName={post.nickName}
        sectionName={post.sectionName}
        title={post.title}
        content={post.content}
        commentCount={post.commentCount}
        viewNum={post.views}
        postTime={`${post.postTime}000`} // MySQL里的时间戳是秒, JS中的是毫秒
      />
    ));
    setPosts(postList);
  }

  function fetchNewData(offset) {
    const dataOld = JSON.parse(sessionStorage.getItem('postList'));
    let url = '';
    if (offset === -1) {
      // 获取最新发帖
      url = '/getPost?time='.concat(latestPostTime);
    } else {
      url = '/getPost?offset='.concat(offset);
    }
    instance.get(url)
      .then((res) => {
        if (!res.data || res.data.length === 0) {
          if (offset !== -1) {
            context.setShowMsgBar('dufault', '没有更多帖子了');
          }
          fetchPostLock = true; // 禁止后续刷新
          return;
        }
        setTimeout(() => {
          fetchPostLock = false;
        }, 5000);

        let { data } = res;
        latestPostTime = data[0].postTime > latestPostTime ? data[0].postTime : latestPostTime;
        if (dataOld && JSON.stringify(dataOld[0]) === JSON.stringify(data[0])) {
          return;
        }

        data = dataOld
          // 合并并去除重复项
          ? dataOld.concat(data.filter(
            item => !(dataOld.find(x => x.postId === item.postId) || false),
          ))
          : data;
        data = data.sort((a, b) => b.postTime - a.postTime);
        sessionStorage.setItem('postList', JSON.stringify(data));
        renderCard(data);
      })
      .catch(() => {
        offsetCount = 1;
        // sessionStorage.clear();
        // window.location.reload();
      })
      .finally(() => {
        if (offset === 0) {
          setShowProgress(false);
        }
      });
  }

  window.onscroll = () => {
    if (((window.innerHeight + window.scrollY) > document.body.offsetHeight) && !fetchPostLock) {
      fetchPostLock = true;
      fetchNewData(offsetCount * offsetBase);
      offsetCount += 1;
    }
  };

  useEffect(() => {
    const dataOld = JSON.parse(sessionStorage.getItem('postList'));
    if (dataOld !== null) {
      renderCard(dataOld);
      latestPostTime = dataOld[0].postTime;
      offsetCount = parseInt(dataOld.length / offsetBase, 10);
      fetchNewData(-1);
    } else {
      fetchNewData(0);
      setShowProgress(true);
    }


    // const pullPost = setInterval(() => {
    //   fetchNewData(-1);
    // }, 1000 * 30);

    return () => {
      // clearInterval(pullPost);
      window.onscroll = null;
    };
  }, []);

  return (
    <div className={classes.root}>
      {showProgress
        && <LinearProgress />
      }
      {posts}
    </div>
  );
}

export default MainPage;
