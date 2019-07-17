import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ReplyIcon from '@material-ui/icons/Reply';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import React, { useState } from 'react';

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

export default function CommentAction() {
  const classes = useStyles();
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [dislike, setDislike] = useState(false);
  const [dislikeCount, setDislikeCount] = useState(0);

  const handleLike = () => {
    if (like) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLike(!like);
  };

  const handleDislike = () => {
    if (dislike) {
      setDislikeCount(dislikeCount - 1);
    } else {
      setDislikeCount(dislikeCount + 1);
    }
    setDislike(!dislike);
  };

  return (
    <div className={classes.action}>
      <IconButton className={classes.button} aria-label="Reply">
        <ReplyIcon />
        <Typography>
          回复
        </Typography>
      </IconButton>
      <IconButton
        className={classes.button}
        aria-label="disLike"
        color={dislike ? 'primary' : ''}
        disabled={like}
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
        color={like ? 'primary' : ''}
        disabled={dislike}
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
