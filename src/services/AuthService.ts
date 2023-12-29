import { AxiosResponse } from "axios";

import { IResponse, ILoginResponse, IUser, ILogin, IRegister } from "@/types";
import BaseService from "./BaseService";

class AuthService extends BaseService {
  constructor() {
    super();
  }

  checkEmail = (email: string): Promise<AxiosResponse<IResponse<boolean>>> => {
    return this.post(`/auth/checkEmail`, { email });
  };
  checkEmailForgotPassword = (
    email: string,
  ): Promise<AxiosResponse<IResponse<boolean>>> => {
    return this.post(`/auth/checkEmailForgotPassword`, { email });
  };
  verifyCode = (
    email: string,
    code: string,
  ): Promise<AxiosResponse<IResponse<boolean>>> => {
    return this.post(`/auth/verifyCode`, { email, code });
  };
  resetPassword = (
    email: string,
    password: string,
  ): Promise<AxiosResponse<IResponse<boolean>>> => {
    return this.post(`/auth/resetPassword`, { email, password });
  };
  login = (
    payload: ILogin,
  ): Promise<AxiosResponse<IResponse<ILoginResponse>>> => {
    return this.post(`/auth/login`, payload);
  };
  register = (
    payload: IRegister,
  ): Promise<AxiosResponse<IResponse<ILoginResponse>>> => {
    return this.post(`/auth/register`, payload);
  };
  logout = (): Promise<AxiosResponse<IResponse<boolean>>> => {
    return this.post(`/auth/logout`);
  };
  getCurrentUser = (): Promise<AxiosResponse<IResponse<IUser>>> => {
    return this.get(`/auth/me`);
  };
}

export const authService = new AuthService();
