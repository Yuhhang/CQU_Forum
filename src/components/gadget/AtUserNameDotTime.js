import React from 'react';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import RelativeTime from './RelativeTime';
// import UserLabel from './UserLabel';

export default function AtUserNameDotTime({ nickName, postTime }) {
  return (
    <div style={{ fontSize: '0.8rem' }}>
      <AlternateEmailIcon style={{ verticalAlign: 'middle', fontSize: '1rem' }} />
      {nickName.concat(' • ')}
      <RelativeTime postTime={postTime} />
      {/* <UserLabel style={{ verticalAlign: 'middle' }} type="teacher" text="管理员" /> */}
    </div>
  );
}
