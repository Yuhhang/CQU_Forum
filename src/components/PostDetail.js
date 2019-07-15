import { grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import CommentSection from './CommentSection';

// const useStyles = makeStyles(theme => ({
//   header: {
//     padding: theme.spacing(3, 2),
//     backgroundColor: grey[100],
//     // display: 'flex',
//     alignItems: 'center',
//   },
//   avatarGrid: {
//     display: 'flex',
//     alignItems: 'center',
//   },
//   avatar: {
//     margin: 'auto',
//     width: '50px',
//     height: '50px',
//   },
// }));

export default function PostDetail(props) {
  const { match } = props;
  const { params } = match;
  const { id } = params;

  return (
    <div>

      <CommentSection postId={id} />

    </div>
  );
}
