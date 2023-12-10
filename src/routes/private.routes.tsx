import { z } from 'zod';
import { Route, lazyRouteComponent } from '@tanstack/react-router';

import { rootRoute } from '@/routes/root.routes';
import {
  getCommentsByPostIDQueryOptions,
  getLikedPostsByUserIDQueryOptions,
  getPostQueryOptions,
  getPostsByUserIDQueryOptions,
  getPostsQueryOptions,
  getRelatedPostsQueryOptions,
  getSavedPostsByUserIDQueryOptions,
  getTopCreatorsQueryOptions,
  getTopPostsQueryOptions,
  getUserByIDQueryOptions
} from '@/lib/hooks/query';

const searchQuerySchema = z.object({
  search: z.string().optional(),
  filter: z.string().default('All')
});

export const MainRoute = new Route({
  id: 'main',
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import('@/layouts/MainLayout')),
  wrapInSuspense: true
});

export const HomeRoute = new Route({
  path: '/',
  getParentRoute: () => MainRoute,
  component: lazyRouteComponent(() => import('@/pages/Home')),
  loader: ({ context }) => {
    context.queryClient.prefetchInfiniteQuery(getPostsQueryOptions());
    context.queryClient.prefetchInfiniteQuery(getTopCreatorsQueryOptions());
  },
  wrapInSuspense: true
});

export const ExploreRoute = new Route({
  path: '/explore',
  getParentRoute: () => MainRoute,
  validateSearch: (search) => searchQuerySchema.parse(search),
  component: lazyRouteComponent(() => import('@/pages/Explore')),
  loader: ({ context }) => {
    context.queryClient.prefetchInfiniteQuery(getTopPostsQueryOptions('All'));
  },
  wrapInSuspense: true
});

export const PeopleRoute = new Route({
  path: '/people',
  getParentRoute: () => MainRoute,
  component: lazyRouteComponent(() => import('@/pages/People')),
  loader: ({ context }) => {
    context.queryClient.prefetchInfiniteQuery(getTopCreatorsQueryOptions());
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
  path: '/posts/$postID',
  getParentRoute: () => MainRoute,
  parseParams: (params) => ({ postID: z.string().parse(params.postID) }),
  component: lazyRouteComponent(() => import('@/pages/PostDetails')),
  loader: ({ context, params }) => {
    context.queryClient.prefetchQuery(getPostQueryOptions(params.postID));
    context.queryClient.prefetchInfiniteQuery(getCommentsByPostIDQueryOptions(params.postID));
    context.queryClient.prefetchQuery(getRelatedPostsQueryOptions(params.postID));
  },
  wrapInSuspense: true
});

export const ProfileRoute = new Route({
  path: '/profile/$profileID',
  getParentRoute: () => MainRoute,
  parseParams: (params) => ({ profileID: z.string().parse(params.profileID) }),
  component: lazyRouteComponent(() => import('@/pages/Profile')),
  loader: ({ context, params }) => {
    context.queryClient.prefetchQuery(getUserByIDQueryOptions(params.profileID));
  },
  wrapInSuspense: true
});

export const UserPostsRoute = new Route({
  path: '/',
  getParentRoute: () => ProfileRoute,
  component: lazyRouteComponent(() => import('@/components/User/UserPosts')),
  loader: ({ context, params }) => {
    context.queryClient.prefetchInfiniteQuery(getPostsByUserIDQueryOptions(params.profileID));
  },
  wrapInSuspense: true
});

export const LikedPostsRoute = new Route({
  path: 'liked',
  getParentRoute: () => ProfileRoute,
  component: lazyRouteComponent(() => import('@/components/User/LikedPosts')),
  loader: ({ context, params }) => {
    context.queryClient.prefetchInfiniteQuery(getLikedPostsByUserIDQueryOptions(params.profileID));
  },
  wrapInSuspense: true
});

export const SavedPostsRoute = new Route({
  path: 'saved',
  getParentRoute: () => ProfileRoute,
  component: lazyRouteComponent(() => import('@/components/User/SavedPosts')),
  loader: ({ context, params }) => {
    context.queryClient.prefetchInfiniteQuery(getSavedPostsByUserIDQueryOptions(params.profileID));
  },
  wrapInSuspense: true
});
