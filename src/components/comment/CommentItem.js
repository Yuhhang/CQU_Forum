import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react';
import RelativeTime from '../RelativeTime';

export default function Item(props) {
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
    <ListItem key={commentId}>
      <ListItemAvatar>
        <Avatar>H</Avatar>
        {/* <Avatar alt="Profile Picture" src={person} /> */}
      </ListItemAvatar>
      <ListItemText primary={commentTitle} secondary={content} />
    </ListItem>
  );
}
