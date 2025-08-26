import { Middleware } from '@reduxjs/toolkit';
import { addComment, updateComment, Comment } from './commentSlice';
import { pushNotification } from './notificationSlice';
import { v4 as uuidv4 } from 'uuid';

// 실제 로그인 사용자 정보는 store/user에서 가져와야 함 (여기선 mock)
const currentUser = 'alice';

export const notificationMiddleware: Middleware = store => next => action => {
  // 댓글 추가/수정 성공 시 멘션 알림 push
  if (
    (addComment.fulfilled.match(action) || updateComment.fulfilled.match(action)) &&
    action.payload && Array.isArray(action.payload.mentions)
  ) {
    const comment: Comment = action.payload;
    comment.mentions.forEach(username => {
      if (username !== currentUser) {
        store.dispatch(
          pushNotification({
            id: uuidv4(),
            type: 'mention',
            message: `@${username}님이 멘션되었습니다: "${comment.content}"`,
            link: { objectType: comment.objectType, objectId: comment.objectId },
            read: false,
            createdAt: new Date().toISOString(),
          })
        );
      }
    });
  }
  return next(action);
}; 