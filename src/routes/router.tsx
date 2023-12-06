import { Router } from '@tanstack/react-router';

import { rootRoute } from '@/routes/root.routes';

import {
  MainRoute,
  HomeRoute,
  ExploreRoute,
  PeopleRoute,
  CreatePostRoute,
  PostDetailsRoute,
  ProfileRoute,
  UserPostsRoute,
  LikedPostsRoute,
  SavedPostsRoute
} from '@/routes/private.routes';
import { AuthRoute, SigninRoute, SignupRoute, NotFoundRoute } from '@/routes/public.routes';

const routeTree = rootRoute.addChildren([
  AuthRoute.addChildren([SigninRoute, SignupRoute]),
  MainRoute.addChildren([
    HomeRoute,
    ExploreRoute,
    PeopleRoute,
    CreatePostRoute,
    PostDetailsRoute,
    ProfileRoute.addChildren([UserPostsRoute, LikedPostsRoute, SavedPostsRoute])
  ]),
  NotFoundRoute
]);

export const router = new Router({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
