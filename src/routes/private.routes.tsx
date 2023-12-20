import { z } from 'zod';
import { Route, lazyRouteComponent, redirect } from '@tanstack/react-router';

import { rootRoute } from '@/routes/root.routes';

import LoaderLogo from '@/components/Shared/LoaderLogo';

import {
  getCommentsByPostIDQueryOptions,
  getLikedPostsByUserIDQueryOptions,
  getPostQueryOptions,
  getPostsByUserIDQueryOptions,
  getPostsQueryOptions,
  getRelatedPostsQueryOptions,
  getSavedPostsByUserIDQueryOptions,
  getSearchPostsQueryOptions,
  getTopCreatorsQueryOptions,
  getTopPostsQueryOptions,
  getUserByIDQueryOptions
} from '@/lib/queryOptions';

const searchQuerySchema = z.object({
  search: z.string().optional(),
  filter: z.string().default('All')
});

export const MainRoute = new Route({
  id: 'main',
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import('@/layouts/MainLayout')),
  pendingComponent: LoaderLogo,
  beforeLoad: async ({ context: { userID }, location }) => {
    if (!userID) {
      redirect({
        to: '/signin',
        search: { redirect: location.href === '/' ? undefined : location.href },
        replace: true,
        throw: true
      });
    }
  },
  wrapInSuspense: true
});

export const HomeRoute = new Route({
  path: '/',
  getParentRoute: () => MainRoute,
  component: lazyRouteComponent(() => import('@/pages/Home')),
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchInfiniteQuery(getPostsQueryOptions());
    queryClient.prefetchInfiniteQuery(getTopCreatorsQueryOptions());
  },
  wrapInSuspense: true
});

export const ExploreRoute = new Route({
  path: '/explore',
  getParentRoute: () => MainRoute,
  validateSearch: (search) => searchQuerySchema.parse(search),
  component: lazyRouteComponent(() => import('@/pages/Explore')),
  loaderDeps: ({ search: { search, filter } }) => ({ search, filter }),
  loader: ({ context: { queryClient }, deps: { search, filter } }) => {
    queryClient.prefetchInfiniteQuery(getTopPostsQueryOptions(filter));
    queryClient.prefetchInfiniteQuery(getSearchPostsQueryOptions(search || '', filter));
  },
  wrapInSuspense: true
});

export const PeopleRoute = new Route({
  path: '/people',
  getParentRoute: () => MainRoute,
  component: lazyRouteComponent(() => import('@/pages/People')),
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchInfiniteQuery(getTopCreatorsQueryOptions());
  },
  wrapInSuspense: true
});

export const CreatePostRoute = new Route({
  path: '/posts/create',
  getParentRoute: () => MainRoute,
  component: lazyRouteComponent(() => import('@/components/Post/CreatePost')),
  wrapInSuspense: true
});

export const PostDetailsRoute = new Route({
  path: '/post/$postID',
  getParentRoute: () => MainRoute,
  parseParams: (params) => ({ postID: z.string().parse(params.postID) }),
  component: lazyRouteComponent(() => import('@/pages/PostDetails')),
  loader: ({ context: { queryClient }, params: { postID } }) => {
    queryClient.prefetchQuery(getPostQueryOptions(postID));
    queryClient.prefetchInfiniteQuery(getCommentsByPostIDQueryOptions(postID));
    queryClient.prefetchQuery(getRelatedPostsQueryOptions(postID));
  },
  wrapInSuspense: true
});

export const ProfileRoute = new Route({
  path: '/profile/$profileID',
  getParentRoute: () => MainRoute,
  parseParams: (params) => ({ profileID: z.string().parse(params.profileID) }),
  component: lazyRouteComponent(() => import('@/pages/Profile')),
  loader: ({ context: { queryClient }, params: { profileID } }) => {
    queryClient.prefetchQuery(getUserByIDQueryOptions(profileID));
  },
  wrapInSuspense: true
});

export const UserPostsRoute = new Route({
  path: '/',
  getParentRoute: () => ProfileRoute,
  component: lazyRouteComponent(() => import('@/components/User/UserPosts')),
  loader: ({ context: { queryClient }, params: { profileID } }) => {
    queryClient.prefetchInfiniteQuery(getPostsByUserIDQueryOptions(profileID));
  },
  wrapInSuspense: true
});

export const LikedPostsRoute = new Route({
  path: 'liked',
  getParentRoute: () => ProfileRoute,
  component: lazyRouteComponent(() => import('@/components/User/LikedPosts')),
  beforeLoad: async ({ context: { userAlias, userID }, params: { profileID } }) => {
    if (profileID !== userID && profileID !== userAlias) {
      redirect({
        to: '/profile/$profileID',
        params: { profileID },
        replace: true,
        throw: true
      });
    }
  },
  loader: ({ context: { queryClient, userID } }) => {
    queryClient.prefetchInfiniteQuery(getLikedPostsByUserIDQueryOptions(userID));
  },
  wrapInSuspense: true
});

export const SavedPostsRoute = new Route({
  path: 'saved',
  getParentRoute: () => ProfileRoute,
  component: lazyRouteComponent(() => import('@/components/User/SavedPosts')),
  beforeLoad: async ({ context: { userAlias, userID }, params: { profileID } }) => {
    if (profileID !== userID && profileID !== userAlias) {
      redirect({
        to: '/profile/$profileID',
        params: { profileID },
        replace: true,
        throw: true
      });
    }
  },
  loader: ({ context: { queryClient, userID } }) => {
    queryClient.prefetchInfiniteQuery(getSavedPostsByUserIDQueryOptions(userID));
  },
  wrapInSuspense: true
});
