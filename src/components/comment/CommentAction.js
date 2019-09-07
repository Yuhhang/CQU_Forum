import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import clsx from 'clsx';
import React, { useContext, useState } from 'react';
import userContext from '../../context/userContext';
import instance from '../axios';
import CommentDialog from './CommentDialog';
import ReplyCommentContainer from './ReplyCommentContainer';


const useStyles = makeStyles(theme => ({
  button: {
    // fontSize: '10px',
    margin: theme.spacing(1),
  },
  icon: {
    fontSize: '1.2rem',
  },
  expandContent: {
    paddingTop: '0px',
  },
  action: {
    // marginLeft: '200px',
    // marginRight: '20px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));

export default function CommentAction(props) {
  const context = useContext(userContext); // global user context
  const [expanded, setExpanded] = React.useState(false);

  const { userState } = context;
  const {
    commentId,
    postId,
    likeCountInit,
    dislikeCountInit,
    replys,
  } = props;
  const replyCount = replys ? replys.length : 0;

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
    <React.Fragment>
      <div className={classes.action}>
        <CommentDialog
          replyTo={commentId}
          postId={postId}
          replyCount={replyCount}
        />
        <IconButton
          className={classes.button}
          aria-label="disLike"
          color={dislike ? 'primary' : 'default'}
          disabled={!userState.isLoggedIn || like}
          onClick={handleDislike}
        >
          <ThumbDownIcon className={classes.icon} />
          <Typography component="span" style={{ position: 'relative', left: '5px', top: '1px' }}>
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
          <Typography component="span" style={{ position: 'relative', left: '5px', top: '1px' }}>
            {likeCount}
          </Typography>
        </IconButton>
        <IconButton
          disabled={!replys}
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={() => setExpanded(!expanded)}
        >
          <ExpandMoreIcon />
        </IconButton>
      </div>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {replys && (
          <ReplyCommentContainer replys={replys} />
        )}
      </Collapse>
    </React.Fragment>
  );
}
