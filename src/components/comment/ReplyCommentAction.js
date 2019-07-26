import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import React, { useState, useContext } from 'react';
import userContext from '../../context/userContext';
import instance from '../axios';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  icon: {
    fontSize: '1.2rem',
  },
  countText: {
    paddingLeft: '3px',
  },
  expandContent: {
    paddingTop: '0px',
  },
  action: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

export default function CommentAction(props) {
  const context = useContext(userContext); // global user context

  const { userState } = context;
  const {
    commentId,
    likeCountInit,
    dislikeCountInit,
  } = props;

  const classes = useStyles();
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(likeCountInit);

  const [dislike, setDislike] = useState(false);
  const [dislikeCount, setDislikeCount] = useState(dislikeCountInit);

  const handleLike = () => {
    instance.get(`likeComment?commentId=${commentId}&cancel=${like}`)
      .then((res) => {
        if (res.data.status === 'success') {
          context.setShowMsgBar('success', res.data.msg);
          if (!like) {
            setLikeCount(likeCount + 1);
          } else {
            setLikeCount(likeCount - 1);
          }
        } else {
          context.setShowMsgBar('default', res.data.msg);
        }
        setLike(!like);
      })
      .catch(() => {
        context.setShowMsgBar('error', '网络错误');
      });
  };

  const handleDislike = () => {
    setDislike(!dislike);
    instance.get(`dislikeComment?commentId=${commentId}&cancel=${dislike}`)
      .then((res) => {
        if (res.data.status === 'success') {
          context.setShowMsgBar('success', res.data.msg);
          if (!dislike) {
            setDislikeCount(dislikeCount + 1);
          } else {
            setDislikeCount(dislikeCount - 1);
          }
        } else {
          context.setShowMsgBar('default', res.data.msg);
        }
        setDislike(!dislike);
      })
      .catch(() => {
        context.setShowMsgBar('error', '网络错误');
      });
  };

  return (
    <div className={classes.action}>
      <IconButton
        className={classes.button}
        aria-label="disLike"
        color={dislike ? 'primary' : 'default'}
        disabled={!userState.isLoggedIn || like}
        onClick={handleDislike}
      >
        <ThumbDownIcon className={classes.icon} />
        <Typography className={classes.countText} component="span">
          {dislikeCount}
        </Typography>
      </IconButton>
      <IconButton
        className={classes.button}
        aria-label="like"
        color={like ? 'primary' : 'default'}
        disabled={!userState.isLoggedIn || dislike}
        onClick={handleLike}
      >
        <ThumbUpIcon className={classes.icon} />
        <Typography className={classes.countText} component="span">
          {likeCount}
        </Typography>
      </IconButton>
    </div>
  );
}
