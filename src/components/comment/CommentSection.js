// import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { red } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CommentIcon from '@material-ui/icons/Comment';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ShareIcon from '@material-ui/icons/Share';
import React, { useEffect, useState } from 'react';
import instance from '../axios';
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
    // margin: 'auto',
    // maxWidth: '400',
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
  },
  cardAction: {
    paddingTop: '0px',
    paddingBottom: '8px',
  },
  avatar: {
    backgroundColor: red[500],
    width: '35px',
    height: '35px',
  },
  avatarSmall: {
    backgroundColor: red[500],
    width: '25px',
    height: '25px',
  },
}));

function PostInfo() {
  const {
    userName,
    postTime,
    title,
    content,
    commentCount,
  } = JSON.parse(sessionStorage.getItem('currentPostInfo'));

  const date = new Date(parseInt(postTime, 10));
  const dateStr = (date.getMonth() + 1).toString().concat('月')
  + date.getDate().toString().concat('日 ')
  + date.getHours().toString().concat('时')
  + date.getMinutes().toString().concat('分');

  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardHeader
        className={classes.cardHeader}
        avatar={(
          <Avatar className={classes.avatarSmall}>
            {userName[0]}
          </Avatar>
        )}
        action={(
          <IconButton aria-label="Settings">
            <MoreVertIcon />
          </IconButton>
        )}
        title={userName}
        subheader={` 发表于 ${dateStr}`}
      />
      <CardContent className={classes.cardContent}>
        <Typography variant="h6" color="textPrimary">
          {title}
        </Typography>
        <Typography className={classes.cardContentText} variant="body2" color="textSecondary" component="p">
          {content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing className={classes.cardAction}>
        <IconButton aria-label="views">
          <CommentIcon fontSize="small" />
        </IconButton>
        <Typography variant="body2" color="textSecondary" component="p">
          {/* {viewNum} */}
          {commentCount}
        </Typography>
        <IconButton aria-label="Share">
          <ShareIcon fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
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
          return;
        }
        let data = res.data.sort((a, b) => b.commentTime - a.commentTime);
        data = data.map(item => (
          <CommentItem
            key={item.commentId}
            commentId={item.commentId}
            userId={item.userId}
            nickName={item.nickName}
            content={item.content}
            likeCount={item.likeCount}
            dislikeCount={item.dislikeCount}
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
      <PostInfo />
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