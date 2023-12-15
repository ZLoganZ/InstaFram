import { AxiosResponse } from 'axios';

import { IResponse, IUser } from '@/types';
import BaseService from './BaseService';

class UserService extends BaseService {
  constructor() {
    super();
  }

  getFollowers = (userID: string): Promise<AxiosResponse<IResponse<IUser[]>>> => {
    return this.get(`/users/${userID}/followers`);
  };
  getFollowing = (userID: string): Promise<AxiosResponse<IResponse<IUser[]>>> => {
    return this.get(`/users/${userID}/following`);
  };
  getUserByID = (userID: string): Promise<AxiosResponse<IResponse<IUser>>> => {
    return this.get(`/users/${userID}`);
  };
  getTopCreators = (page: number): Promise<AxiosResponse<IResponse<IUser[]>>> => {
    return this.get(`/users/top-creators?page=${page}`);
  };
  followUser = (userID: string): Promise<AxiosResponse<IResponse<boolean>>> => {
    return this.post(`/users/${userID}/follow`);
  };
  updateUser = (userUpdate: FormData): Promise<AxiosResponse<IResponse<IUser>>> => {
    return this.put(`/users/edit`, userUpdate);
  };
}

export const userService = new UserService();
