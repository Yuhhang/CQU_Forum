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
        userName={post.userName}
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
    const dataOld = JSON.parse(localStorage.getItem('postList'));
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
        // const data = res.data.sort((a, b) => Date.parse(b.postTime) - Date.parse(a.postTime));
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
        localStorage.setItem('postList', JSON.stringify(data));
        renderCard(data);
      })
      .catch((err) => {
        console.log(err);
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
    const dataOld = JSON.parse(localStorage.getItem('postList'));
    if (dataOld !== null) {
      renderCard(dataOld);
      latestPostTime = dataOld[0].postTime;
      offsetCount = parseInt(dataOld.length / offsetBase, 10);
      fetchNewData(-1);
    } else {
      fetchNewData(0);
      setShowProgress(true);
    }


    const pullPost = setInterval(() => {
      fetchNewData(-1);
    }, 1000 * 30);

    return () => {
      clearInterval(pullPost);
      window.onscroll = null;
    };
  }, []);

  const numbers = [1, 2, 3, 4, 5];
  const sectionLists = numbers.map(number => (
    <Card
      key={number}
      postId="postid"
      userName="一位不知名的用户"
      sectionName="大数据与软件学院"
      title="民主湖论坛就是个🌶🐓"
      content="symbol function guess clear dust shine sets equal largest concerned consider lovely machine cannot fuel bread done common coming wing half tip broad day"
      viewNum={233}
      postTime={1562687612327}
    />
  ));
  return (
    <div className={classes.root}>
      {showProgress
        && <LinearProgress />
      }
      {posts}
      {/* {sectionLists} */}
    </div>
  );
}

export default MainPage;
