export interface IEmailRegister {
  verification: string;
  email: string;
}
export interface IPasswordRestore {
  email: string;
  token: string;
}

export interface IEmailOneClickCreds {
  email: string;
  login: string;
  password: string;
}
