import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ReplyIcon from '@material-ui/icons/Reply';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import React, { useState, useContext } from 'react';
import userContext from '../../context/userContext';
import instance from '../axios';

const useStyles = makeStyles(theme => ({
  button: {
    // fontSize: '10px',
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
  countText: {
    paddingLeft: '3px',
  },
  action: {
    // marginLeft: '200px',
    // marginRight: '20px',
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
    setLike(!like); // 先变换状态，避免网络延迟造成重复点击
    instance.get(`likeComment?commentId=${commentId}&cancel=${like}`)
      .then((res) => {
        if (res.data.like_status === 'success') {
          if (res.data.toggle) {
            setLikeCount(likeCount + 1);
            context.setShowMsgBar('success', '赞成功');
          } else {
            setLikeCount(likeCount - 1);
            context.setShowMsgBar('success', '取消赞成功');
          }
        } else {
          context.setShowMsgBar('default', '赞过了');
        }
      })
      .catch(() => {
        setLike(!like); // 恢复未点赞
        context.setShowMsgBar('error', '网络错误');
      });
  };

  const handleDislike = () => {
    setDislike(!dislike);
    instance.get(`dislikeComment?commentId=${commentId}&cancel=${dislike}`)
      .then((res) => {
        if (res.data.dislike_status === 'success') {
          if (res.data.toggle) {
            setDislikeCount(dislikeCount + 1);
            context.setShowMsgBar('success', '踩成功');
          } else {
            setDislikeCount(dislikeCount - 1);
            context.setShowMsgBar('success', '取消踩成功');
          }
        } else {
          context.setShowMsgBar('default', '踩过了');
        }
      })
      .catch(() => {
        setDislike(!dislike);
        context.setShowMsgBar('error', '网络错误');
      });
  };

  return (
    <div className={classes.action}>
      <IconButton disabled className={classes.button} aria-label="Reply">
        <ReplyIcon />
        <Typography>
          回复
        </Typography>
      </IconButton>
      <IconButton
        className={classes.button}
        aria-label="disLike"
        color={dislike ? 'primary' : 'default'}
        disabled={!userState.isLoggedIn || like}
        onClick={handleDislike}
      >
        <ThumbDownIcon />
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
        <ThumbUpIcon />
        <Typography className={classes.countText} component="span">
          {likeCount}
        </Typography>
      </IconButton>
    </div>
  );
}
