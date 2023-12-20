export type Verified = {
  isVerified: boolean;
  setIsVerified: (isVerified: boolean) => void;
};

export type AuthContextType = {
  currentUser: IUser;
  isAuthenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface ErrorResponse extends Error {
  response: {
    data: {
      message: string;
      status: number;
    };
    status: number;
  };
}

export type IUpdateUser = {
  name: string;
  bio: string;
  image: File;
  isChangeImage: boolean;
};

export type ISavedPost = {
  _id: string;
  post: IPost;
  user: IUser;
};

export type IVisibility = 'Public' | 'Private' | 'Followers';

export type IPost = {
  _id: string;
  content: string;
  image: string;
  visibility: IVisibility;
  location: string;
  tags: string[];
  likes: IUser[];
  comments: IComment[];
  saves: ISavedPost[];
  creator: IUser;
  createdAt: string;
  updatedAt: string;
};

export type IComment = {
  _id: string;
  user: IUser;
  post: string;
  content: string;
  likes: IUser[];
  replies: IComment[];
  createdAt: string;
  updatedAt: string;
};

export type INewComment = {
  content: string;
  post: string;
  replyTo?: string;
};

export type IReplyTo = {
  to: string;
  user: IUser;
};

export type INewPost = {
  creator: string;
  content: string;
  visibility: IVisibility;
  image: File;
  location?: string;
  tags?: string;
};

export type IDataComboBox = {
  value: string;
  label: string;
};

export type ILocationResponse = {
  name: {
    common: string;
    official: string;
  };
};

export type IUpdatePost = {
  postID: string;
  content: string;
  visibility: IVisibility;
  image?: File;
  isChangeImage: boolean;
  location?: string;
  tags?: string;
};

export type IUser = {
  _id: string;
  name: string;
  email: string;
  alias: string;
  image: string;
  bio: string;
  posts: string[];
  followers: string[];
  following: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type IRegister = {
  name: string;
  email: string;
  password: string;
};

export type ILogin = {
  email: string;
  password: string;
};

export type ILoginResponse = {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: IUser;
};

export type IResponse<T> = {
  message: string;
  status: number;
  metadata: T;
};

export type RouteParams = {
  id: string;
};
