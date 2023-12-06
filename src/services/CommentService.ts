import { AxiosResponse } from 'axios';

import BaseService from './BaseService';
import { IComment, INewComment, IResponse } from '@/types';

class CommentService extends BaseService {
  constructor() {
    super();
  }

  getCommentsByPostID = (postID: string, page: number): Promise<AxiosResponse<IResponse<IComment[]>>> => {
    return this.get(`/comments/${postID}?page=${page}`);
  };
  getReliesByCommentID = (commentID: string, page: number): Promise<AxiosResponse<IResponse<IComment[]>>> => {
    return this.get(`/comments/replies/${commentID}?page=${page}`);
  };
  createComment = (payload: INewComment): Promise<AxiosResponse<IResponse<IComment>>> => {
    return this.post(`/comments`, payload);
  };
}

export const commentService = new CommentService();
