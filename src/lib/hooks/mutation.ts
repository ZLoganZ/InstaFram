import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';

import { authService } from '@/services/AuthService';
import { postService } from '@/services/PostService';
import { userService } from '@/services/UserService';
import { commentService } from '@/services/CommentService';
import { IComment, ILogin, INewComment, INewPost, IRegister, IUpdatePost, IUpdateUser } from '@/types';
import { HEADER, QUERY_KEYS } from '@/lib/constants';
import { parseFormData } from '@/lib/utils';

export const useSignin = () => {
  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (payload: ILogin) => {
      const { data } = await authService.login(payload);
      return data.metadata;
    },
    onSuccess: (data) => {
      localStorage.setItem(HEADER.CLIENT_ID, data.user._id);
      window.location.replace('/');
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
      const { data } = await authService.register(payload);
      return data.metadata;
    },
    onSuccess: (data) => {
      localStorage.setItem(HEADER.CLIENT_ID, data.user._id);
      window.location.replace('/');
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
      localStorage.removeItem(HEADER.CLIENT_ID);
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
  const queryCLient = useQueryClient();
  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (payload: INewPost) => {
      const { data } = await postService.createPost(parseFormData(payload));
      return data.metadata;
    },
    onSuccess: (_, newPost) => {
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS_BY_USER_ID, newPost.creator] });
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.TOP_POSTS] });
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
  const queryCLient = useQueryClient();
  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (postID: string) => {
      const { data } = await postService.deletePost(postID);
      return data.metadata;
    },
    onSuccess: (post, postID) => {
      queryCLient.removeQueries({ queryKey: [QUERY_KEYS.POST, postID] });
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS_BY_USER_ID, post.creator] });
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.TOP_POSTS] });
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

export const useCommentPost = () => {
  const queryCLient = useQueryClient();
  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (payload: INewComment) => {
      const { data } = await commentService.createComment(payload);
      return data.metadata;
    },
    onSuccess: (newComment, { post }) => {
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.POST, post] });
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS_BY_USER_ID, newComment.user._id] });
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.TOP_POSTS] });
      queryCLient.setQueriesData<InfiniteData<IComment[], number>>(
        { queryKey: [QUERY_KEYS.COMMENTS_BY_POST_ID, post] },
        (oldData) => {
          if (!oldData) return;
          const { pages, pageParams } = oldData;
          const firstPage = pages[0];

          return {
            pageParams,
            pages: [[newComment, ...firstPage], ...pages.slice(1)]
          };
        }
      );
    }
  });
  return {
    commentPost: mutateAsync,
    isLoadingCommentPost: isPending,
    isCommentPostSuccess: isSuccess,
    isCommentPostError: isError,
    errorCommentPost: error
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
