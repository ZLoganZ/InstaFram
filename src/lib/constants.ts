import { IUser } from "@/types";

type RouteURL = "/" | "/explore" | "/people" | "/posts/create";
type NavbarLinkLabel = "Home" | "Explore" | "People" | "Create Post";
type NavbarLinkImgURL =
  | "/assets/icons/home.svg"
  | "/assets/icons/wallpaper.svg"
  | "/assets/icons/people.svg"
  | "/assets/icons/gallery-add.svg";

type NavbarLink = {
  imgURL: NavbarLinkImgURL;
  route: RouteURL;
  label: NavbarLinkLabel;
};

export const navbarLinks: NavbarLink[] = [
  {
    imgURL: "/assets/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/icons/wallpaper.svg",
    route: "/explore",
    label: "Explore",
  },
  {
    imgURL: "/assets/icons/people.svg",
    route: "/people",
    label: "People",
  },
  {
    imgURL: "/assets/icons/gallery-add.svg",
    route: "/posts/create",
    label: "Create Post",
  },
];

export enum QUERY_KEYS {
  POSTS = "posts",
  POST = "post",
  USER = "user",
  SEARCH_POSTS = "search-posts",
  SEARCH_USERS = "search-users",
  POSTS_BY_USER_ID = "posts-by-user-id",
  SAVED_POSTS_BY_USER_ID = "saved-posts-by-user-id",
  POPULAR_USERS = "popular-users",
  LIKED_POSTS_BY_USER_ID = "liked-posts-by-user-id",
  TOP_POSTS = "top-posts",
  RELATED_POSTS = "related-posts",
  COMMENTS_BY_POST_ID = "comments-by-post-id",
  REPLIES_BY_COMMENT_ID = "replies-by-comment-id",
}

export const MUTATION_KEYS = {
  CREATE_POST: "create-post",
  UPDATE_POST: "update-post",
  DELETE_POST: "delete-post",
  LIKE_POST: "like-post",
  SAVE_POST: "save-post",
  FOLLOW_USER: "follow-user",
  UNFOLLOW_USER: "unfollow-user",
  LIKE_COMMENT: "like-comment",
  CREATE_COMMENT: "create-comment",
  UPDATE_COMMENT: "update-comment",
  DELETE_COMMENT: "delete-comment",
};

export enum FILTERS {
  ALL = "All",
  TODAY = "Today",
  YESTERDAY = "Yesterday",
  WEEK = "Week",
  MONTH = "Month",
  YEAR = "Year",
}

/**
 * @description
 * The default user object
 */
export const defaultUser: IUser = {
  _id: "",
  name: "",
  alias: "",
  email: "",
  bio: "",
  image: "",
  posts: [],
  followers: [],
  following: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export enum HEADER {
  CLIENT_ID = "client-id",
  ACCESSTOKEN = "access-token",
  REFRESHTOKEN = "refresh-token",
  GITHUB_TOKEN = "github-token",
}
