export interface IUserAuth {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
}

export interface IAuth extends IUserAuth, ITokens {
}

export interface ILoginRequest {
  username: string;
  password: string;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}