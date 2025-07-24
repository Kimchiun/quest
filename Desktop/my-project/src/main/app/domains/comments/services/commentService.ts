import { Comment } from '../models/Comment';
import { commentRepository } from '../repositories/commentRepository';

export const commentService = {
  async createComment(data: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment> {
    // content, author, objectType, objectId 유효성 검사
    if (!data.content.trim()) throw new Error('댓글 내용이 비어있습니다.');
    if (!data.author) throw new Error('작성자 정보가 필요합니다.');
    if (!data.objectType || !data.objectId) throw new Error('objectType/objectId가 필요합니다.');
    return commentRepository.insert(data);
  },
  async getComments(objectType: string, objectId: number): Promise<Comment[]> {
    return commentRepository.findByObject(objectType, objectId);
  },
  async updateComment(id: number, content: string, mentions: string[]): Promise<Comment | null> {
    if (!content.trim()) throw new Error('댓글 내용이 비어있습니다.');
    return commentRepository.update(id, content, mentions);
  },
  async deleteComment(id: number): Promise<boolean> {
    return commentRepository.delete(id);
  },
}; 