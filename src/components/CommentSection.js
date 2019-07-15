// import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import RelativeTime from './RelativeTime';
import CommentDialog from './CommentDialog';

const instance = axios.create({
  baseURL: 'http://server.messi1.top/api/',
  timeout: 5000,
});

const useStyles = makeStyles(theme => ({
  text: {
    padding: theme.spacing(2, 2, 0),
    justifyContent: 'center',
  },
  commentButton: {
    position: 'absolute',
    right: '20px',
    bottom: '60px',
  },
  paper: {
    paddingBottom: 50,
  },
  list: {
    marginBottom: theme.spacing(2),
  },
  subheader: {
    backgroundColor: theme.palette.background.paper,
  },
}));

function Item(props) {
  const {
    commentId,
    userId,
    userNick,
    content,
    replyTo,
    anonymous,
    commentTime,
  } = props;
  const classes = useStyles();
  const relativeTime = <RelativeTime postTime={commentTime} />;
  const commentTitle = (
    <div>
      {userNick.concat(' • ')}
      {relativeTime}
    </div>
  );

  return (
    <ListItem button key={commentId}>
      <ListItemAvatar>
        <Avatar className={classes.avatar}>H</Avatar>
        {/* <Avatar alt="Profile Picture" src={person} /> */}
      </ListItemAvatar>
      <ListItemText primary={commentTitle} secondary={content} />
    </ListItem>
  );
}

export default function CommentSection(props) {
  const { postId } = props;
  const classes = useStyles();
  const [comments, setComments] = useState(null);

  useEffect(() => {
    instance.get('/getComment?postId='.concat(postId))
      .then((res) => {
        if (!res.data[0]) {
          setComments('暂无数据');
          return;
        }
        let data = res.data.sort((a, b) => b.commentTime - a.commentTime);
        data = data.map(item => (
          <Item
            key={item.commentId}
            commentId={item.commentId}
            userId={item.userId}
            userNick={item.userNick}
            content={item.content}
            replyTo={item.replyTo}
            anonymous={item.anonymous}
            commentTime={`${item.commentTime}000`}
          />
        ));
        setComments(data);
      })
      .catch(() => {
        // handle error
        setComments('网络错误');
      }).finally(() => {

      });
  }, []);
  return (
    <React.Fragment>
      <Paper square className={classes.paper}>
        <Typography className={classes.text} variant="h5" gutterBottom>
          评论
        </Typography>
        <div className={classes.commentButton}>
          <CommentDialog postId={postId} />
        </div>
        <List className={classes.list}>
          {comments}
        </List>
      </Paper>
    </React.Fragment>
  );
}
