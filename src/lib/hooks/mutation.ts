import qs from 'qs';
import { useRouterState, RouteApi } from '@tanstack/react-router';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';

import { authService } from '@/services/AuthService';
import { postService } from '@/services/PostService';
import { userService } from '@/services/UserService';
import { commentService } from '@/services/CommentService';
import { IComment, ILogin, INewComment, INewPost, IRegister, IUpdatePost, IUpdateUser } from '@/types';
import { HEADER, QUERY_KEYS, MUTATION_KEYS } from '@/lib/constants';
import { parseFormData } from '@/lib/utils';

export const useSignin = () => {
  const { redirect } = new RouteApi({ id: '/auth/signin' }).useSearch();
  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (payload: ILogin) => {
      const { data } = await authService.login(payload);
      return data.metadata;
    },
    onSuccess: (data) => {
      localStorage.setItem(HEADER.CLIENT_ID, data.user._id);
      localStorage.setItem(HEADER.ACCESSTOKEN, data.tokens.accessToken);
      localStorage.setItem(HEADER.REFRESHTOKEN, data.tokens.refreshToken);
      window.location.replace(redirect || '/');
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
      localStorage.setItem(HEADER.ACCESSTOKEN, data.tokens.accessToken);
      localStorage.setItem(HEADER.REFRESHTOKEN, data.tokens.refreshToken);
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

export const useCheckEmail = () => {
  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (email: string) => {
      const { data } = await authService.checkEmail(email);
      return data.metadata;
    }
  });
  return {
    checkEmail: mutateAsync,
    isLoadingCheckEmail: isPending,
    isCheckEmailSuccess: isSuccess,
    isCheckEmailError: isError,
    errorCheckEmail: error
  };
};

export const useCheckEmailForgotPassword = () => {
  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (email: string) => {
      const { data } = await authService.checkEmailForgotPassword(email);
      return data.metadata;
    }
  });
  return {
    checkEmailForgotPassword: mutateAsync,
    isLoadingCheckEmailForgotPassword: isPending,
    isCheckEmailForgotPasswordSuccess: isSuccess,
    isCheckEmailForgotPasswordError: isError,
    errorCheckEmailForgotPassword: error
  };
};

export const useVerifyCode = () => {
  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (payload: { email: string; code: string }) => {
      const { data } = await authService.verifyCode(payload.email, payload.code);
      return data.metadata;
    }
  });
  return {
    verifyCode: mutateAsync,
    isLoadingVerifyCode: isPending,
    isVerifyCodeSuccess: isSuccess,
    isVerifyCodeError: isError,
    errorVerifyCode: error
  };
};

export const useResetPassword = () => {
  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const { data } = await authService.resetPassword(payload.email, payload.password);
      return data.metadata;
    }
  });
  return {
    resetPassword: mutateAsync,
    isLoadingResetPassword: isPending,
    isResetPasswordSuccess: isSuccess,
    isResetPasswordError: isError,
    errorResetPassword: error
  };
};

export const useSignout = () => {
  const { location } = useRouterState();
  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async () => {
      return await authService.logout();
    },
    onSuccess: () => {
      localStorage.removeItem(HEADER.CLIENT_ID);
      localStorage.removeItem(HEADER.ACCESSTOKEN);
      localStorage.removeItem(HEADER.REFRESHTOKEN);

      const { pathname, search, hash } = location;
      const isRoot = pathname === '/';

      const url = new URL('/signin', window.location.origin);
      if (!isRoot) {
        url.search = qs.stringify({
          redirect: `${pathname}${qs.stringify(search, { addQueryPrefix: true })}${hash}`
        });
      }

      window.location.replace(url);
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
    onSuccess: (newPost, _) => {
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS_BY_USER_ID, newPost.creator.alias] });
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
    onSuccess: (_, postID) => {
      queryCLient.removeQueries({ queryKey: [QUERY_KEYS.POST, postID] });
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS_BY_USER_ID] });
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
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS_BY_USER_ID, newComment.user.alias] });
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

export const useLikeComment = () => {
  const queryCLient = useQueryClient();
  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: (commentID: string) => {
      return commentService.likeComment(commentID);
    },
    onSuccess: (_, commentID) => {
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMENTS_BY_POST_ID] });
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.REPLIES_BY_COMMENT_ID, commentID] });
    }
  });
  return {
    likeComment: mutateAsync,
    isLoadingLikeComment: isPending,
    isLikeCommentSuccess: isSuccess,
    isLikeCommentError: isError,
    errorLikeComment: error
  };
};

export const useUpdateComment = (commentID: string) => {
  const queryCLient = useQueryClient();
  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationKey: [MUTATION_KEYS.UPDATE_COMMENT, commentID],
    mutationFn: async (payload: INewComment) => {
      const { data } = await commentService.updateComment(commentID, payload);
      return data.metadata;
    },
    onSuccess: (newComment, { post }) => {
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.POST, post] });
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS_BY_USER_ID, newComment.user.alias] });
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.TOP_POSTS] });
      queryCLient.setQueriesData<InfiniteData<IComment[], number>>(
        { queryKey: [QUERY_KEYS.COMMENTS_BY_POST_ID, post] },
        (oldData) => {
          if (!oldData) return;
          const { pages, pageParams } = oldData;

          const page = pages.find((page) => page.find((comment) => comment._id === newComment._id));
          if (!page) return;

          return {
            pageParams,
            pages: [
              [newComment, ...page.filter((comment) => comment._id !== newComment._id)],
              ...pages.filter((page) => page !== page)
            ]
          };
        }
      );
    }
  });
  return {
    updateComment: mutateAsync,
    isLoadingUpdateComment: isPending,
    isUpdateCommentSuccess: isSuccess,
    isUpdateCommentError: isError,
    errorUpdateComment: error
  };
};

export const useDeleteComment = () => {
  const queryCLient = useQueryClient();
  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (commentID: string) => {
      const { data } = await commentService.deleteComment(commentID);
      return data.metadata;
    },
    onSuccess: ({ post }, commentID) => {
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.POST, post] });
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS_BY_USER_ID] });
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.TOP_POSTS] });
      queryCLient.setQueriesData<InfiniteData<IComment[], number>>(
        { queryKey: [QUERY_KEYS.COMMENTS_BY_POST_ID, post] },
        (oldData) => {
          if (!oldData) return;
          const { pages, pageParams } = oldData;

          const page = pages.find((page) => page.find((comment) => comment._id === commentID));
          if (!page) return;

          return {
            pageParams,
            pages: [
              page.filter((comment) => comment._id !== commentID),
              ...pages.filter((page) => page !== page)
            ]
          };
        }
      );
    }
  });
  return {
    deleteComment: mutateAsync,
    isLoadingDeleteComment: isPending,
    isDeleteCommentSuccess: isSuccess,
    isDeleteCommentError: isError,
    errorDeleteComment: error
  };
};

export const useUpdateUser = () => {
  const queryCLient = useQueryClient();
  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (payload: IUpdateUser) => {
      return (await userService.updateUser(parseFormData(payload))).data.metadata;
    },
    onSuccess: (user) => {
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.USER, user.alias] });
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

export const useFollowUser = () => {
  const queryCLient = useQueryClient();
  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (userID: string) => {
      return await userService.followUser(userID);
    },
    onSuccess: () => {
      queryCLient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] });
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
