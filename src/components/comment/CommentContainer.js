// import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { red } from '@material-ui/core/colors';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import instance from '../axios';
import CardMenu from '../CardMenu';
import ImgDisplay from '../ImgDisplay';
import CommentDialog from './CommentDialog';
import CommentItem from './CommentItem';

const useStyles = makeStyles(theme => ({
  text: {
    padding: theme.spacing(2, 2, 0),
    justifyContent: 'center',
  },
  commentButton: {
    position: 'fixed',
    right: '20px',
    bottom: '60px',
    zIndex: '100',
  },
  paper: {
    paddingBottom: 50,
    margin: 'auto',
    maxWidth: '500px',
  },
  list: {
    marginBottom: theme.spacing(2),
    paddingBottom: '100px',
  },
  subheader: {
    backgroundColor: theme.palette.background.paper,
  },
  card: {
    borderRadius: 0,
    margin: 'auto',
    maxWidth: '500px',
  },
  cardHeader: {
    paddingTop: '8px',
    paddingBottom: '8px',
  },
  cardContentButton: {
    width: '100%',
  },
  cardContent: {
    width: '100%',
    textAlign: 'left',
    paddingTop: '0px',
    paddingBottom: '0px',
  },
  cardContentText: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'pre-wrap',
  },
  avatar: {
    backgroundColor: red[500],
    width: '35px',
    height: '35px',
  },
}));

function parseComments(comments) {
  const parsed = {};
  comments.forEach((comment) => {
    if (!parsed[comment.replyTo]) {
      parsed[comment.replyTo] = [];
    }
    parsed[comment.replyTo].push(comment);
  });
  return parsed;
}

function PostInfo({ postInfo }) {
  const classes = useStyles();
  const {
    userId,
    nickName,
    postTime,
    title,
    content,
    postId,
    imgNum,
    // commentCount,
  } = postInfo;

  const date = new Date(parseInt(postTime, 10));
  const hour = date.getHours().toString();
  const min = date.getMinutes().toString();
  const dateStr = (date.getMonth() + 1).toString().concat('月')
    + date.getDate().toString().concat('日 ')
    + (hour.length === 1 ? `0${hour}` : hour).concat(':')
    + (min.length === 1 ? `0${min}` : min);

  return (
    <Card className={classes.card}>
      <CardHeader
        className={classes.cardHeader}
        avatar={(
          <Avatar className={classes.avatar}>
            {nickName[0]}
          </Avatar>
        )}
        action={<CardMenu postId={postId} userName={nickName} userId={userId} />}
        title={nickName}
        subheader={` 发表于 ${dateStr}`}
      />
      <CardContent className={classes.cardContent}>
        <Typography variant="h6" color="textPrimary">
          {title}
        </Typography>
        <Typography className={classes.cardContentText} variant="body2" color="textSecondary" component="p">
          {content}
        </Typography>
        <ImgDisplay postId={postId} imgNum={imgNum} />
      </CardContent>
    </Card>
  );
}

export default function CommentContainer(props) {
  const { postId } = props;
  const classes = useStyles();
  const [comments, setComments] = useState(null);
  const [postInfo, setPostInfo] = useState({
    userId: 0,
    nickName: ' ',
    postTime: 0,
    title: '加载中',
    content: 'Loading...',
    postId: 0,
    imgNum: 0,
  });

  useEffect(() => {
    let currentPostInfo = sessionStorage.getItem('currentPostInfo');
    if (!currentPostInfo) {
      instance.get('/getPostById?postId='.concat(postId))
        .then((res) => {
          if (res.data.status === 'fail') {
            setPostInfo({
              userId: 0,
              nickName: ' ',
              postTime: 0,
              title: '该贴不存在',
              content: '',
              postId: 0,
              imgNum: 0,
            });
          } else {
            setPostInfo(res.data[0]);
          }
        })
        .catch(() => {
          setPostInfo({
            userId: 0,
            nickName: '无',
            postTime: 0,
            title: '网络错误',
            content: '',
            postId: 0,
            imgNum: 0,
          });
        });
    } else {
      currentPostInfo = JSON.parse(currentPostInfo);
      if (currentPostInfo.postId !== parseInt(postId, 10)) {
        instance.get('/getPostById?postId='.concat(postId))
          .then((res) => {
            if (res.data.status === 'fail') {
              setPostInfo({
                userId: 0,
                nickName: '无',
                postTime: 0,
                title: '该贴不存在',
                content: '',
                postId: 0,
                imgNum: 0,
              });
            } else {
              setPostInfo(res.data[0]);
            }
          })
          .catch(() => {
            setPostInfo({
              userId: 0,
              nickName: '无',
              postTime: 0,
              title: '网络错误',
              content: '',
              postId: 0,
              imgNum: 0,
            });
          });
      } else {
        setPostInfo(currentPostInfo);
      }
    }

    instance.get('/getComment?postId='.concat(postId))
      .then((res) => {
        if (!res.data[0]) {
          return;
        }
        let data = res.data.sort((a, b) => b.commentTime - a.commentTime);
        data = parseComments(data);
        data = data[0].map(item => (
          <CommentItem
            key={item.commentId}
            postId={item.postId}
            commentId={item.commentId}
            userId={item.userId}
            nickName={item.nickName}
            content={item.content}
            likeCount={item.likeCount}
            dislikeCount={item.dislikeCount}
            replyTo={item.replyTo}
            replys={data[item.commentId]}
            anonymous={item.anonymous}
            commentTime={`${item.commentTime}000`}
          />
        ));
        setComments(data);
      })
      .catch((err) => {
        switch (err.response.status) {
          case 401:
            setComments(err.response.data.msg);
            break;
          case 403:
            setComments(err.response.data.msg);
            break;
          case 500:
            setComments('服务器发生错误，请稍后再试。');
            break;
          case 502:
            setComments('服务器无响应，请稍后再试。');
            break;
          default:
            setComments(`发生错误${err.response.status}`);
            break;
        }
      });
  }, []);

  return (
    <React.Fragment>
      <PostInfo postInfo={postInfo} />
      <Paper square className={classes.paper}>
        <Typography className={classes.text} variant="h5" gutterBottom>
          {comments ? '评论' : '暂无评论'}
        </Typography>
        {comments
          && (
            <List className={classes.list}>
              {comments}
            </List>
          )}
      </Paper>
      <div className={classes.commentButton}>
        <CommentDialog postId={postId} />
      </div>
    </React.Fragment>
  );
}
