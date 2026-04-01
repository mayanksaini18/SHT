export interface User {
  id: string;
  name: string;
  email: string;
  xp: number;
  level: number;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
