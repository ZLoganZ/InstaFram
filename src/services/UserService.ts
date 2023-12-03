import { AxiosResponse } from 'axios';

import { IResponse, IUser } from '@/types';
import BaseService from './BaseService';

class UserService extends BaseService {
  constructor() {
    super();
  }

  updateUser = (userUpdate: FormData): Promise<AxiosResponse<IResponse<IUser>>> => {
    return this.put(`/users/update`, userUpdate);
  };
  getFollowers = (userID: string): Promise<AxiosResponse<IResponse<IUser[]>>> => {
    return this.get(`/users/followers/${userID}`);
  };
  getFollowing = (userID: string): Promise<AxiosResponse<IResponse<IUser[]>>> => {
    return this.get(`/users/following/${userID}`);
  };
  getUserByID = (userID: string): Promise<AxiosResponse<IResponse<IUser>>> => {
    return this.get(`/users/${userID}`);
  };
  getTopCreators = (): Promise<AxiosResponse<IResponse<IUser[]>>> => {
    return this.get(`/users/top-creators`);
  };
  followUser = (userID: string): Promise<AxiosResponse<IResponse<boolean>>> => {
    return this.post(`/users/follow/${userID}`);
  };
}

export const userService = new UserService();
