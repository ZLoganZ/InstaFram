import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authService } from '@/services/AuthService';
import { postService } from '@/services/PostService';
import { userService } from '@/services/UserService';
import { ILogin, INewPost, IRegister, IUpdatePost, IUpdateUser } from '@/types';
import { QUERY_KEYS } from '@/lib/constants';
import { parseFormData } from '@/lib/utils';

export const useSignin = () => {
  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (payload: ILogin) => {
      return await authService.login(payload);
    }
  });
  return {
    signin: mutateAsync,
    isLoadingSignin: isPending,
    isSigninSuccess: isSuccess,
    isSigninError: isError,
    errorSignin: error
  };
};

export const useSignup = () => {
  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (payload: IRegister) => {
      return await authService.register(payload);
    }
  });
  return {
    signup: mutateAsync,
    isLoadingSignup: isPending,
    isSignupSuccess: isSuccess,
    isSignupError: isError,
    errorSignup: error
  };
};

export const useSignout = () => {
  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async () => {
      return await authService.logout();
    },
    onSuccess: () => {
      // delete cookie
      document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

      window.location.replace('/signin');
    }
  });
  return {
    signout: mutateAsync,
    isLoadingSignout: isPending,
    isSignoutSuccess: isSuccess,
    isSignoutError: isError,
    errorSignout: error
  };
};

export const useCreatePost = () => {
  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (payload: INewPost) => {
      return await postService.createPost(parseFormData(payload));
    }
  });
  return {
    createPost: mutateAsync,
    isLoadingCreatePost: isPending,
    isCreatePostSuccess: isSuccess,
    isCreatePostError: isError,
    errorCreatePost: error
  };
};

export const useUpdatePost = () => {
  const queryCLient = useQueryClient();
  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (payload: IUpdatePost) => {
      return await postService.updatePost(payload.postID, parseFormData(payload));
    },
    onSuccess: (_, post) => {
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.POST, post.postID] });
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS_BY_USER_ID] });
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.TOP_POSTS] });
    }
  });
  return {
    updatePost: mutateAsync,
    isLoadingUpdatePost: isPending,
    isUpdatePostSuccess: isSuccess,
    isUpdatePostError: isError,
    errorUpdatePost: error
  };
};

export const useDeletePost = () => {
  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (postID: string) => {
      return await postService.deletePost(postID);
    }
  });
  return {
    deletePost: mutateAsync,
    isLoadingDeletePost: isPending,
    isDeletePostSuccess: isSuccess,
    isDeletePostError: isError,
    errorDeletePost: error
  };
};

export const useLikePost = () => {
  const queryCLient = useQueryClient();
  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (postID: string) => {
      return await postService.likePost(postID);
    },
    onSuccess: (_, postID) => {
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.POST, postID] });
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS_BY_USER_ID] });
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.TOP_POSTS] });
    }
  });
  return {
    likePost: mutateAsync,
    isLoadingLikePost: isPending,
    isLikePostSuccess: isSuccess,
    isLikePostError: isError,
    errorLikePost: error
  };
};

export const useSavePost = () => {
  const queryCLient = useQueryClient();
  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (postID: string) => {
      return await postService.savePost(postID);
    },
    onSuccess: (_, postID) => {
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.POST, postID] });
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS_BY_USER_ID] });
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.TOP_POSTS] });
    }
  });
  return {
    savePost: mutateAsync,
    isLoadingSavePost: isPending,
    isSavePostSuccess: isSuccess,
    isSavePostError: isError,
    errorSavePost: error
  };
};

export const useUpdateUser = (userID: string) => {
  const queryCLient = useQueryClient();
  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (payload: IUpdateUser) => {
      return (await userService.updateUser(parseFormData(payload))).data.metadata;
    },
    onSuccess: () => {
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.USER, userID] });
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.POPULAR_USERS] });
    }
  });
  return {
    updateUser: mutateAsync,
    isLoadingUpdateUser: isPending,
    isUpdateUserSuccess: isSuccess,
    isUpdateUserError: isError,
    errorUpdateUser: error
  };
};

export const useFollowUser = (currentUserID: string) => {
  const queryCLient = useQueryClient();
  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (userID: string) => {
      return await userService.followUser(userID);
    },
    onSuccess: (_, userID) => {
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.USER, userID] });
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.USER, currentUserID] });
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.POPULAR_USERS] });
    }
  });
  return {
    followUser: mutateAsync,
    isLoadingFollowUser: isPending,
    isFollowUserSuccess: isSuccess,
    isFollowUserError: isError,
    errorFollowUser: error
  };
};
