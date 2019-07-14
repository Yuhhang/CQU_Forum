import Avatar from '@material-ui/core/Avatar';
import axios from 'axios';
import blue from '@material-ui/core/colors/blue';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useContext, useState, useEffect } from 'react';
import Card from './Card';
import userContext from '../context/userContext';

const instance = axios.create({
  baseURL: 'http://server.messi1.top/api/',
  timeout: 5000,
});

const useStyles = makeStyles(theme => ({
  header: {
    padding: theme.spacing(3, 2),
    backgroundColor: blue[100],
    // display: 'flex',
    alignItems: 'center',
  },
  avatarGrid: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    margin: 'auto',
    width: '50px',
    height: '50px',
  },
}));

export default function PaperSheet(props) {
  const context = useContext(userContext); // global user context
  const classes = useStyles();
  const { match } = props;
  const { params } = match;
  const { id } = params;

  // useEffect(() => {
  //   context.setShowBackButton(() => {
  //     props.history.goBack();
  //   });
  // }, []);
  useEffect(() => {
    instance.get('/getPost')
      .then((res) => {
        console.log(res);
      })
      .catch(() => {
        // handle error

      }).finally(() => {
        // setCaptchaToken('');
        // setCaptchaLoading(true);
      });
  }, []);

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
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
      inSection
    />
  ));


  return (
    <div>
      <button type="button" onClick={() => { props.history.goBack(); }}>GO BACK</button>
      <Paper className={classes.header}>
        <Grid container justify="center" alignContent="center">
          <Grid className={classes.avatarGrid} item xs={3}>
            <Avatar className={classes.avatar}>H</Avatar>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="h6">
              分区名称
            </Typography>
            <Typography variant="caption" component="p">
              Paper can be used to build surface or other elements for your application.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      {sectionLists}
    </div>
  );
}
