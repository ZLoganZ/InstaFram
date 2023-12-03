import { IUser } from '@/types';

export const sidebarLinks = [
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

export const bottomBarLinks = [
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
    label: 'Create'
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
  RELATED_POSTS = 'related-posts'
}

export enum FILTERS {
  ALL = 'All',
  TODAY = 'Today',
  YESTERDAY = 'Yesterday',
  WEEK = 'Week',
  MONTH = 'Month',
  YEAR = 'Year'
}

export const defaultUser: IUser = {
  _id: '',
  name: '',
  alias: '',
  email: '',
  bio: '',
  image: '',
  posts: [],
  followers: [],
  following: []
};
