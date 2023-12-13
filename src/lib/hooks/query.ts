import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { postService } from '@/services/PostService';
import { userService } from '@/services/UserService';
import { commentService } from '@/services/CommentService';
import { QUERY_KEYS } from '@/lib/constants';

export const useGetPosts = () => {
  const { data, isLoading, isError, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
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
      select: (data) => {
        return data.pages.flatMap((page) => page);
      }
    });
  return {
    posts: data!,
    isLoadingPosts: isLoading,
    isFetchingNextPosts: isFetchingNextPage,
    hasNextPosts: hasNextPage,
    fetchNextPosts: fetchNextPage,
    isPostsError: isError,
    errorPosts: error
  };
};

export const useGetTopPosts = (filter: string) => {
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isFetching
  } = useInfiniteQuery({
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
  return {
    posts: data!,
    isLoadingPosts: isLoading,
    refetchPosts: refetch,
    isFetchingPosts: isFetching,
    isFetchingNextPosts: isFetchingNextPage,
    hasNextPosts: hasNextPage,
    fetchNextPosts: fetchNextPage,
    isPostsError: isError,
    errorPosts: error
  };
};

export const useSearchPosts = (search: string, filter: string) => {
  const { data, isLoading, isError, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
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
  return {
    searchPosts: data!,
    isLoadingSearchPosts: isLoading,
    isFetchingNextSearchPosts: isFetchingNextPage,
    hasNextSearchPosts: hasNextPage,
    fetchNextSearchPosts: fetchNextPage,
    isSearchPostsError: isError,
    errorSearchPosts: error
  };
};

export const useGetPostsByUserID = (userID: string) => {
  const { data, isLoading, isError, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
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
  return {
    posts: data!,
    isLoadingPosts: isLoading,
    isFetchingNextPosts: isFetchingNextPage,
    hasNextPosts: hasNextPage,
    fetchNextPosts: fetchNextPage,
    isPostsError: isError,
    errorPosts: error
  };
};

export const useGetSavedPostsByUserID = (userID: string) => {
  const { data, isLoading, isError, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
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
  return {
    posts: data!,
    isLoadingPosts: isLoading,
    isFetchingNextPosts: isFetchingNextPage,
    hasNextPosts: hasNextPage,
    fetchNextPosts: fetchNextPage,
    isPostsError: isError,
    errorPosts: error
  };
};

export const useGetLikedPostsByUserID = (userID: string) => {
  const { data, isLoading, isError, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
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
  return {
    posts: data!,
    isLoadingPosts: isLoading,
    isFetchingNextPosts: isFetchingNextPage,
    hasNextPosts: hasNextPage,
    fetchNextPosts: fetchNextPage,
    isPostsError: isError,
    errorPosts: error
  };
};

export const useGetPost = (postID: string) => {
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.POST, postID],
    queryFn: async () => {
      const { data } = await postService.getPost(postID);
      return data.metadata;
    },
    enabled: !!postID
  });
  return {
    post: data!,
    isLoadingPost: isLoading,
    isFetchingPost: isFetching,
    isPostError: isError,
    errorPost: error
  };
};

export const useGetRelatedPosts = (postID: string) => {
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.RELATED_POSTS, postID],
    queryFn: async () => {
      const { data } = await postService.getRelatedPosts(postID);
      return data.metadata;
    },
    enabled: !!postID
  });
  return {
    relatedPosts: data!,
    isLoadingRelatedPosts: isLoading,
    isFetchingRelatedPosts: isFetching,
    isRelatedPostsError: isError,
    errorRelatedPosts: error
  };
};

export const useGetCommentsByPostID = (postID: string) => {
  const { data, isLoading, isError, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
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
      select: (data) => {
        return data.pages.flatMap((page) => page);
      }
    });
  return {
    comments: data!,
    isLoadingComments: isLoading,
    isFetchingNextComments: isFetchingNextPage,
    hasNextComments: hasNextPage,
    fetchNextComments: fetchNextPage,
    isCommentsError: isError,
    errorComments: error
  };
};

export const useGetUserByID = (userID: string) => {
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.USER, userID],
    queryFn: async () => {
      const { data } = await userService.getUserByID(userID);
      return data.metadata;
    },
    enabled: !!userID
  });
  return {
    user: data!,
    isLoadingUser: isLoading,
    isFetchingUser: isFetching,
    isUserError: isError,
    errorUser: error
  };
};

export const useGetTopCreators = () => {
  const { data, isLoading, isError, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
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
  return {
    topCreators: data!,
    isLoadingTopCreators: isLoading,
    isFetchingNextTopCreators: isFetchingNextPage,
    hasNextTopCreators: hasNextPage,
    fetchNextTopCreators: fetchNextPage,
    isTopCreatorsError: isError,
    errorTopCreators: error
  };
};
