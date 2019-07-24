import React from 'react';
import CommentSection from './comment/CommentSection';

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
