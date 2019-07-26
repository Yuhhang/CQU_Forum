import React from 'react';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import RelativeTime from './RelativeTime';

export default function AtUserNameDotTime({ nickName, postTime }) {
  return (
    <div style={{ fontSize: '0.8rem' }}>
      <AlternateEmailIcon fontSize="small" style={{ verticalAlign: 'middle' }} />
      {nickName.concat(' • ')}
      <RelativeTime postTime={postTime} />
    </div>
  );
}
