export interface AuthContextType {
  currentUser: IUser;
  isAuthenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ErrorResponse extends Error {
  response: {
    data: {
      message: string;
      status: number;
    };
    status: number;
  };
}

export interface IUpdateUser {
  name: string;
  bio: string;
  image: File;
  isChangeImage: boolean;
}

export interface ISavedPost {
  _id: string;
  post: IPost;
  user: IUser;
}

export interface IPost {
  _id: string;
  content: string;
  image: string;
  location: string;
  tags: string[];
  likes: IUser[];
  saves: ISavedPost[];
  creator: IUser;
  createdAt: string;
  updatedAt: string;
}

export interface INewPost {
  creator: string;
  content: string;
  image: File;
  location?: string;
  tags?: string;
}

export interface IDataComboBox {
  value: string;
  label: string;
}

export interface ILocationResponse {
  name: {
    common: string;
    official: string;
  };
}

export interface IUpdatePost {
  postID: string;
  content: string;
  image?: File;
  isChangeImage: boolean;
  location?: string;
  tags?: string;
}

export interface IUser {
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
}

export interface IRegister {
  name: string;
  email: string;
  password: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface ILoginResponse {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: IUser;
}

export interface IResponse<T> {
  message: string;
  status: number;
  metadata: T;
}
