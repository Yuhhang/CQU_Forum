import React from 'react';
import CommentContainer from './comment/CommentContainer';

export default function PostDetail(props) {
  const { match } = props;
  const { params } = match;
  const { id } = params;

  return (
    <div>
      <CommentContainer postId={id} />
    </div>
  );
}
