import { IUser } from '@/types';

type routeURL = '/' | '/explore' | '/people' | '/posts/create';
type navbarLinkLabel = 'Home' | 'Explore' | 'People' | 'Create Post';
type navbarLinkImgURL =
  | '/assets/icons/home.svg'
  | '/assets/icons/wallpaper.svg'
  | '/assets/icons/people.svg'
  | '/assets/icons/gallery-add.svg';

type navbarLink = {
  imgURL: navbarLinkImgURL;
  route: routeURL;
  label: navbarLinkLabel;
};

export const navbarLinks: navbarLink[] = [
  {
    imgURL: '/assets/icons/home.svg',
    route: '/',
    label: 'Home'
  },
  {
    imgURL: '/assets/icons/wallpaper.svg',
    route: '/explore',
    label: 'Explore'
  },
  {
    imgURL: '/assets/icons/people.svg',
    route: '/people',
    label: 'People'
  },
  {
    imgURL: '/assets/icons/gallery-add.svg',
    route: '/posts/create',
    label: 'Create Post'
  }
];

export enum QUERY_KEYS {
  POSTS = 'posts',
  POST = 'post',
  USER = 'user',
  SEARCH_POSTS = 'search-posts',
  POSTS_BY_USER_ID = 'posts-by-user-id',
  SAVED_POSTS_BY_USER_ID = 'saved-posts-by-user-id',
  POPULAR_USERS = 'popular-users',
  LIKED_POSTS_BY_USER_ID = 'liked-posts-by-user-id',
  TOP_POSTS = 'top-posts',
  RELATED_POSTS = 'related-posts',
  COMMENTS_BY_POST_ID = 'comments-by-post-id'
}

export enum FILTERS {
  ALL = 'All',
  TODAY = 'Today',
  YESTERDAY = 'Yesterday',
  WEEK = 'Week',
  MONTH = 'Month',
  YEAR = 'Year'
}

/**
 * @description
 * The default user object
 */
export const defaultUser: IUser = {
  _id: '',
  name: '',
  alias: '',
  email: '',
  bio: '',
  image: '',
  posts: [],
  followers: [],
  following: [],
  createdAt: new Date(),
  updatedAt: new Date()
};

export enum HEADER {
  CLIENT_ID = 'x-client-id',
  AUTHORIZATION = 'accessToken',
  API_KEY = 'x-api-key',
  REFRESHTOKEN = 'refreshToken',
  GITHUB_TOKEN = 'x-github-token'
}
