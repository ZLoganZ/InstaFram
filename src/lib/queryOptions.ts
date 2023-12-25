import { queryOptions, infiniteQueryOptions } from '@tanstack/react-query';

import { postService } from '@/services/PostService';
import { userService } from '@/services/UserService';
import { commentService } from '@/services/CommentService';
import { QUERY_KEYS } from '@/lib/constants';

export const getPostsQueryOptions = () =>
  infiniteQueryOptions({
    queryKey: [QUERY_KEYS.POSTS],
    queryFn: async ({ pageParam }) => {
      const { data } = await postService.getPosts(pageParam);
      return data.metadata;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length < 10) {
        return null;
      }
      return lastPageParam + 1;
    },
    maxPages: 3,
    select: (data) => {
      return data.pages.flatMap((page) => page);
    }
  });

export const getTopPostsQueryOptions = (filter: string) =>
  infiniteQueryOptions({
    queryKey: [QUERY_KEYS.TOP_POSTS, filter],
    queryFn: async ({ pageParam }) => {
      const { data } = await postService.getTopPosts(pageParam, filter);
      return data.metadata;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length < 10) {
        return null;
      }
      return lastPageParam + 1;
    },
    select: (data) => {
      return data.pages.flatMap((page) => page);
    }
  });

export const getTopCreatorsQueryOptions = () =>
  infiniteQueryOptions({
    queryKey: [QUERY_KEYS.POPULAR_USERS],
    queryFn: async ({ pageParam }) => {
      const { data } = await userService.getTopCreators(pageParam);
      return data.metadata;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length < 10) {
        return null;
      }
      return lastPageParam + 1;
    },
    select: (data) => {
      return data.pages.flatMap((page) => page);
    }
  });

export const getPostsByUserIDQueryOptions = (userID: string) =>
  infiniteQueryOptions({
    queryKey: [QUERY_KEYS.POSTS_BY_USER_ID, userID],
    queryFn: async ({ pageParam }) => {
      const { data } = await postService.getPostsByUserID(userID, pageParam);
      return data.metadata;
    },
    enabled: !!userID,
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length < 10) {
        return null;
      }
      return lastPageParam + 1;
    },
    select: (data) => {
      return data.pages.flatMap((page) => page);
    }
  });

export const getSavedPostsByUserIDQueryOptions = (userID: string) =>
  infiniteQueryOptions({
    queryKey: [QUERY_KEYS.SAVED_POSTS_BY_USER_ID, userID],
    queryFn: async ({ pageParam }) => {
      const { data } = await postService.getSavedPostsByUserID(userID, pageParam);
      return data.metadata;
    },
    enabled: !!userID,
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length < 10) {
        return null;
      }
      return lastPageParam + 1;
    },
    select: (data) => {
      return data.pages.flatMap((page) => page);
    }
  });

export const getLikedPostsByUserIDQueryOptions = (userID: string) =>
  infiniteQueryOptions({
    queryKey: [QUERY_KEYS.LIKED_POSTS_BY_USER_ID, userID],
    queryFn: async ({ pageParam }) => {
      const { data } = await postService.getLikedPostsByUserID(userID, pageParam);
      return data.metadata;
    },
    enabled: !!userID,
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length < 10) {
        return null;
      }
      return lastPageParam + 1;
    },
    select: (data) => {
      return data.pages.flatMap((page) => page);
    }
  });

export const getCommentsByPostIDQueryOptions = (postID: string) =>
  infiniteQueryOptions({
    queryKey: [QUERY_KEYS.COMMENTS_BY_POST_ID, postID],
    queryFn: async ({ pageParam }) => {
      const { data } = await commentService.getCommentsByPostID(postID, pageParam);
      return data.metadata;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length < 10) {
        return null;
      }
      return lastPageParam + 1;
    },
    enabled: !!postID,
    select: (data) => {
      return data.pages.flatMap((page) => page);
    }
  });

export const getSearchPostsQueryOptions = (search: string, filter: string) =>
  infiniteQueryOptions({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, search, filter],
    queryFn: async ({ pageParam }) => {
      const { data } = await postService.searchPosts(pageParam, search, filter);
      return data.metadata;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length < 10) {
        return null;
      }
      return lastPageParam + 1;
    },
    select: (data) => {
      return data.pages.flatMap((page) => page);
    },
    enabled: !!search
  });

export const getPostQueryOptions = (postID: string) =>
  queryOptions({
    queryKey: [QUERY_KEYS.POST, postID],
    queryFn: async () => {
      const { data } = await postService.getPost(postID);
      return data.metadata;
    },
    enabled: !!postID
  });

export const getRelatedPostsQueryOptions = (postID: string) =>
  queryOptions({
    queryKey: [QUERY_KEYS.RELATED_POSTS, postID],
    queryFn: async () => {
      const { data } = await postService.getRelatedPosts(postID);
      return data.metadata;
    },
    enabled: !!postID
  });

export const getUserByIDQueryOptions = (userID: string) =>
  queryOptions({
    queryKey: [QUERY_KEYS.USER, userID],
    queryFn: async () => {
      const { data } = await userService.getUserByID(userID);
      return data.metadata;
    },
    enabled: !!userID
  });
