import { AxiosResponse } from "axios";

import BaseService from "./BaseService";
import { IPost, IResponse } from "@/types";

class PostService extends BaseService {
  constructor() {
    super();
  }

  getPosts = (
    pageParam: number,
  ): Promise<AxiosResponse<IResponse<IPost[]>>> => {
    return this.get(`/posts?page=${pageParam}`);
  };
  getPostsByUserID = (
    userID: string,
    pageParam: number,
  ): Promise<AxiosResponse<IResponse<IPost[]>>> => {
    return this.get(`/posts/user/${userID}?page=${pageParam}`);
  };
  getSavedPostsByUserID = (
    userID: string,
    pageParam: number,
  ): Promise<AxiosResponse<IResponse<IPost[]>>> => {
    return this.get(`/posts/saved/${userID}?page=${pageParam}`);
  };
  getLikedPostsByUserID = (
    userID: string,
    pageParam: number,
  ): Promise<AxiosResponse<IResponse<IPost[]>>> => {
    return this.get(`/posts/liked/${userID}?page=${pageParam}`);
  };
  getPost = (postID: string): Promise<AxiosResponse<IResponse<IPost>>> => {
    return this.get(`/posts/${postID}`);
  };
  getTopPosts = (
    pageParam: number,
    filter: string,
  ): Promise<AxiosResponse<IResponse<IPost[]>>> => {
    return this.get(`/posts/top?page=${pageParam}&filter=${filter}`);
  };
  getRelatedPosts = (
    postID: string,
  ): Promise<AxiosResponse<IResponse<IPost[]>>> => {
    return this.get(`/posts/${postID}/related`);
  };
  createPost = (data: FormData): Promise<AxiosResponse<IResponse<IPost>>> => {
    return this.post(`/posts`, data);
  };
  updatePost = (
    postID: string,
    data: FormData,
  ): Promise<AxiosResponse<IResponse<IPost>>> => {
    return this.put(`/posts/${postID}`, data);
  };
  deletePost = (postID: string): Promise<AxiosResponse<IResponse<IPost>>> => {
    return this.delete(`/posts/${postID}`);
  };
  likePost = (postID: string): Promise<AxiosResponse<IResponse<boolean>>> => {
    return this.post(`/posts/${postID}/like`);
  };
  savePost = (postID: string): Promise<AxiosResponse<IResponse<boolean>>> => {
    return this.post(`/posts/${postID}/save`);
  };
  searchPosts = (
    pageParam: number,
    search: string,
    filter: string,
  ): Promise<AxiosResponse<IResponse<IPost[]>>> => {
    return this.get(
      `/posts/search?search=${search}&filter=${filter}&page=${pageParam}`,
    );
  };
}

export const postService = new PostService();
