import { z } from 'zod';
import { Route, lazyRouteComponent } from '@tanstack/react-router';

import { rootRoute } from '@/routes/root.routes';

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
  wrapInSuspense: true
});

export const ExploreRoute = new Route({
  path: '/explore',
  getParentRoute: () => MainRoute,
  validateSearch: (search) => searchQuerySchema.parse(search),
  component: lazyRouteComponent(() => import('@/pages/Explore'))
});

export const PeopleRoute = new Route({
  path: '/people',
  getParentRoute: () => MainRoute,
  component: lazyRouteComponent(() => import('@/pages/People'))
});

export const CreatePostRoute = new Route({
  path: '/posts/create',
  getParentRoute: () => MainRoute,
  component: lazyRouteComponent(() => import('@/components/Post/CreatePost'))
});

export const PostDetailsRoute = new Route({
  path: '/posts/$postID',
  getParentRoute: () => MainRoute,
  parseParams: (params) => ({ postID: z.string().parse(params.postID) }),
  component: lazyRouteComponent(() => import('@/pages/PostDetails'))
});

export const ProfileRoute = new Route({
  path: '/profile/$profileID',
  getParentRoute: () => MainRoute,
  parseParams: (params) => ({ profileID: z.string().parse(params.profileID) }),
  component: lazyRouteComponent(() => import('@/pages/Profile')),
  wrapInSuspense: true
});

export const UserPostsRoute = new Route({
  path: '/',
  getParentRoute: () => ProfileRoute,
  component: lazyRouteComponent(() => import('@/components/User/UserPosts'))
});

export const LikedPostsRoute = new Route({
  path: '/liked',
  getParentRoute: () => ProfileRoute,
  component: lazyRouteComponent(() => import('@/components/User/LikedPosts'))
});

export const SavedPostsRoute = new Route({
  path: '/saved',
  getParentRoute: () => ProfileRoute,
  component: lazyRouteComponent(() => import('@/components/User/SavedPosts'))
});
