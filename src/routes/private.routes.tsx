import { z } from "zod";
import {
  lazyRouteComponent,
  redirect,
  createRoute,
} from "@tanstack/react-router";

import { rootRoute } from "@/routes/root.routes";

import LoaderLogo from "@/components/Shared/LoaderLogo";

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
  getUserByIDQueryOptions,
} from "@/lib/queryOptions";

const searchQuerySchema = z.object({
  search: z.string().optional(),
  filter: z.string().default("All"),
});

export const MainRoute = createRoute({
  id: "main",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("@/layouts/MainLayout")),
  pendingComponent: LoaderLogo,
  beforeLoad: async ({ context: { userID }, location }) => {
    if (!userID) {
      redirect({
        to: "/signin",
        search: { redirect: location.href === "/" ? undefined : location.href },
        replace: true,
        throw: true,
      });
    }
  },
  wrapInSuspense: true,
});

export const HomeRoute = createRoute({
  path: "/",
  getParentRoute: () => MainRoute,
  component: lazyRouteComponent(() => import("@/pages/Home")),
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchInfiniteQuery(getPostsQueryOptions());
    queryClient.prefetchInfiniteQuery(getTopCreatorsQueryOptions());
  },
  onLeave: ({ context: { queryClient } }) => {
    queryClient.resetQueries({ queryKey: getPostsQueryOptions().queryKey });
    queryClient.resetQueries({
      queryKey: getTopCreatorsQueryOptions().queryKey,
    });
  },
  wrapInSuspense: true,
});

export const ExploreRoute = createRoute({
  path: "/explore",
  getParentRoute: () => MainRoute,
  validateSearch: (search) => searchQuerySchema.parse(search),
  component: lazyRouteComponent(() => import("@/pages/Explore")),
  loaderDeps: ({ search: { search, filter } }) => ({ search, filter }),
  loader: ({ context: { queryClient }, deps: { search, filter } }) => {
    queryClient.prefetchInfiniteQuery(getTopPostsQueryOptions(filter));
    queryClient.prefetchInfiniteQuery(
      getSearchPostsQueryOptions(search || "", filter),
    );
  },
  onLeave: ({ context: { queryClient }, loaderDeps: { search, filter } }) => {
    queryClient.resetQueries({
      queryKey: getSearchPostsQueryOptions(search || "", filter).queryKey,
    });
    queryClient.resetQueries({
      queryKey: getTopPostsQueryOptions(filter).queryKey,
    });
  },
  wrapInSuspense: true,
});

export const PeopleRoute = createRoute({
  path: "/people",
  getParentRoute: () => MainRoute,
  component: lazyRouteComponent(() => import("@/pages/People")),
  validateSearch: (search) => searchQuerySchema.parse(search),
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchInfiniteQuery(getTopCreatorsQueryOptions());
  },
  onLeave: ({ context: { queryClient } }) => {
    queryClient.resetQueries({
      queryKey: getTopCreatorsQueryOptions().queryKey,
    });
  },
  wrapInSuspense: true,
});

export const CreatePostRoute = createRoute({
  path: "/posts/create",
  getParentRoute: () => MainRoute,
  component: lazyRouteComponent(() => import("@/components/Post/CreatePost")),
  wrapInSuspense: true,
});

export const PostDetailsRoute = createRoute({
  path: "/post/$postID",
  getParentRoute: () => MainRoute,
  parseParams: (params) => ({ postID: z.string().parse(params.postID) }),
  component: lazyRouteComponent(() => import("@/pages/PostDetails")),
  loader: ({ context: { queryClient }, params: { postID } }) => {
    queryClient.prefetchQuery(getPostQueryOptions(postID));
    queryClient.prefetchInfiniteQuery(getCommentsByPostIDQueryOptions(postID));
    queryClient.prefetchQuery(getRelatedPostsQueryOptions(postID));
  },
  onLeave: ({ context: { queryClient }, params: { postID } }) => {
    queryClient.resetQueries({
      queryKey: getCommentsByPostIDQueryOptions(postID).queryKey,
    });
  },
  wrapInSuspense: true,
});

export const ProfileRoute = createRoute({
  path: "/$profileID",
  getParentRoute: () => MainRoute,
  parseParams: (params) => ({ profileID: z.string().parse(params.profileID) }),
  component: lazyRouteComponent(() => import("@/pages/Profile")),
  loader: ({ context: { queryClient }, params: { profileID } }) => {
    queryClient.prefetchQuery(getUserByIDQueryOptions(profileID));
  },
  onLeave: ({ context: { queryClient }, params: { profileID } }) => {
    queryClient.resetQueries({
      queryKey: getUserByIDQueryOptions(profileID).queryKey,
    });
  },
  wrapInSuspense: true,
});

export const UserPostsRoute = createRoute({
  path: "/",
  getParentRoute: () => ProfileRoute,
  component: lazyRouteComponent(() => import("@/components/User/UserPosts")),
  loader: ({ context: { queryClient }, params: { profileID } }) => {
    queryClient.prefetchInfiniteQuery(getPostsByUserIDQueryOptions(profileID));
  },
  onLeave: ({ context: { queryClient }, params: { profileID } }) => {
    queryClient.resetQueries({
      queryKey: getPostsByUserIDQueryOptions(profileID).queryKey,
    });
  },
  wrapInSuspense: true,
});

export const LikedPostsRoute = createRoute({
  path: "liked",
  getParentRoute: () => ProfileRoute,
  component: lazyRouteComponent(() => import("@/components/User/LikedPosts")),
  beforeLoad: async ({
    context: { userAlias, userID },
    params: { profileID },
  }) => {
    if (profileID !== userID && profileID !== userAlias) {
      redirect({
        to: "/$profileID",
        params: { profileID },
        replace: true,
        throw: true,
      });
    }
  },
  loader: ({ context: { queryClient, userID } }) => {
    queryClient.prefetchInfiniteQuery(
      getLikedPostsByUserIDQueryOptions(userID),
    );
  },
  onLeave: ({ context: { queryClient, userID } }) => {
    queryClient.resetQueries({
      queryKey: getLikedPostsByUserIDQueryOptions(userID).queryKey,
    });
  },
  wrapInSuspense: true,
});

export const SavedPostsRoute = createRoute({
  path: "saved",
  getParentRoute: () => ProfileRoute,
  component: lazyRouteComponent(() => import("@/components/User/SavedPosts")),
  beforeLoad: async ({
    context: { userAlias, userID },
    params: { profileID },
  }) => {
    if (profileID !== userID && profileID !== userAlias) {
      redirect({
        to: "/$profileID",
        params: { profileID },
        replace: true,
        throw: true,
      });
    }
  },
  loader: ({ context: { queryClient, userID } }) => {
    queryClient.prefetchInfiniteQuery(
      getSavedPostsByUserIDQueryOptions(userID),
    );
  },
  onLeave: ({ context: { queryClient, userID } }) => {
    queryClient.resetQueries({
      queryKey: getSavedPostsByUserIDQueryOptions(userID).queryKey,
    });
  },
  wrapInSuspense: true,
});

export const NotFoundProfileRoute = createRoute({
  path: "/$profileID/*",
  getParentRoute: () => MainRoute,
  component: lazyRouteComponent(() => import("@/pages/NotFound")),
  wrapInSuspense: true,
});
