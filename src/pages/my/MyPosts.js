import { makeStyles } from '@material-ui/core/styles';
import React, { useContext, useState, useEffect } from 'react';
import instance from '../../components/axios';
import Card from '../../components/Card';
import userContext from '../../context/userContext';


const useStyles = makeStyles(() => ({
  root: {
    marginBottom: '56px',
  },
}));

export default function MyPosts() {
  const context = useContext(userContext); // global user context
  const [posts, setPosts] = useState(null);
  const classes = useStyles();

  function renderCard(data) {
    const postList = data.map(post => (
      <Card
        key={post.postId}
        data={post}
      />
    ));
    setPosts(postList);
  }

  useEffect(() => {
    instance.get('getMyPosts/')
      .then((res) => {
        let { data } = res;
        if (data.length === 0) {
          setPosts('暂无发帖');
          return;
        }
        data = data.sort((a, b) => b.postTime - a.postTime);
        renderCard(data);
      })
      .catch(() => {
        context.setShowMsgBar('error', '发生错误');
      });
  }, []);


  return (
    <div className={classes.root} id="container">
      {posts}
    </div>
  );
}
