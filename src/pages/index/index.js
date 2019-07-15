import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../components/Card';

const instance = axios.create({
  baseURL: 'http://server.messi1.top/api/',
  timeout: 5000,
});

let fetchPostLock = false;

const offsetBase = 20;
let offsetCount = 1;

function MainPage() {
  const [posts, setPosts] = useState(null);
  let latestPostTime = null;

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
    instance.get(url).then((res) => {
      if (res.data.length === 0) {
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
    }

    fetchNewData(0);

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
    <div>
      {posts}
      {/* {sectionLists} */}
    </div>
  );
}

export default MainPage;
