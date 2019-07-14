import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../components/Card';

const instance = axios.create({
  baseURL: 'http://server.messi1.top/api/',
  timeout: 5000,
});

function MainPage() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    instance.get('/getPost').then((res) => {
      const data = res.data.sort((a, b) => Date.parse(b.postTime) - Date.parse(a.postTime));
      const postList = data.map(post => (
        <Card
          key={post.postId}
          postId={post.postId}
          userName={post.userName}
          sectionName={post.sectionName}
          title={post.title}
          content={post.content}
          viewNum={post.views}
          postTime={Date.parse(post.postTime)}
        />
      ));
      setPosts(postList);
    });
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
      {sectionLists}
    </div>
  );
}

export default MainPage;
