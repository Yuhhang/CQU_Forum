import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import AtUserNameDotTime from '../gadget/AtUserNameDotTime';
import ReplyCommentAction from './ReplyCommentAction';

const useStyles = makeStyles(() => ({
  root: {
    paddingBottom: '0px',
    paddingLeft: '50px',
  },
  avatar: {
    marginTop: '7px',
  },
  commentContent: {
    width: '100%',
  },
  action: {
    float: 'right',
  },

}));


export default function Item(props) {
  const classes = useStyles();

  const {
    commentId,
    userId,
    nickName,
    content,
    likeCount,
    dislikeCount,
    replyTo,
    anonymous,
    commentTime,
  } = props;
  // const classes = useStyles();
  const commentTitle = <AtUserNameDotTime nickName={nickName} postTime={commentTime} />;

  return (
    <Slide direction="up" in mountOnEnter unmountOnExit>
      <div>
        <ListItem
          className={classes.root}
          key={commentId}
          alignItems="flex-start"
        >
          <ListItemAvatar className={classes.avatar}>
            <Avatar>H</Avatar>
            {/* <Avatar alt="Profile Picture" src={person} /> */}
          </ListItemAvatar>
          <ListItemText
            // className={classes.commentContent}
            primary={commentTitle}
            secondary={content}
          />
        </ListItem>
        <ReplyCommentAction
          className={classes.action}
          commentId={commentId}
          likeCountInit={likeCount}
          dislikeCountInit={dislikeCount}
        />
        <Divider light />
      </div>

    </Slide>
  );
}
