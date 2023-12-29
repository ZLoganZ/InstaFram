import { Router } from "@tanstack/react-router";

import { rootRoute, queryClient } from "@/routes/root.routes";
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
  SavedPostsRoute,
} from "@/routes/private.routes";
import {
  AuthRoute,
  SigninRoute,
  SignupRoute,
  NotFoundRoute,
  ForgotPasswordRoute,
  ResetPasswordRoute,
} from "@/routes/public.routes";

import Loader from "@/components/Shared/Loader";

const routeTree = rootRoute.addChildren([
  AuthRoute.addChildren([
    SigninRoute,
    SignupRoute,
    ForgotPasswordRoute,
    ResetPasswordRoute,
  ]),
  MainRoute.addChildren([
    HomeRoute,
    ExploreRoute,
    PeopleRoute,
    CreatePostRoute,
    PostDetailsRoute,
    ProfileRoute.addChildren([
      UserPostsRoute,
      LikedPostsRoute,
      SavedPostsRoute,
    ]),
  ]),
  NotFoundRoute,
]);

export const router = new Router({
  routeTree,
  defaultPendingComponent: () => <Loader className="h-dvh" />,
  context: {
    queryClient,
    userID: undefined!,
    userAlias: undefined!,
    verified: undefined!,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
