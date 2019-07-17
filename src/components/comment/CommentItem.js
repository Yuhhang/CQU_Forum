import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import RelativeTime from '../RelativeTime';
import CommentAction from './CommentAction';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles(() => ({
  root: {
    paddingBottom: '0px',
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
    userNick,
    content,
    replyTo,
    anonymous,
    commentTime,
  } = props;
  // const classes = useStyles();
  const relativeTime = <RelativeTime postTime={commentTime} />;
  const commentTitle = (
    <div>
      {userNick.concat(' • ')}
      {relativeTime}
    </div>
  );

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
        <CommentAction
          className={classes.action}
        />
        <Divider light />
      </div>

    </Slide>
  );
}
