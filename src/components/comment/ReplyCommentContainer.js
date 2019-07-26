import React from 'react';
import ReplyCommentItem from './ReplyCommentItem';

export default function ReplyCommentContainer({ replys }) {
  const data = replys.map(item => (
    <ReplyCommentItem
      key={item.commentId}
      commentId={item.commentId}
      userId={item.userId}
      nickName={item.nickName}
      content={item.content}
      likeCount={item.likeCount}
      dislikeCount={item.dislikeCount}
      replyTo={item.replyTo}
      anonymous={item.anonymous}
      commentTime={`${item.commentTime}000`}
    />
  ));
  return data;
}
