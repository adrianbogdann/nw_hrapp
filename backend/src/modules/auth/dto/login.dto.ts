export type LoginDto = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: { id: number; email: string; role: string };
};
