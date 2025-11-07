export interface User {
  id: string;
  email: string;
  password: string; // hashed
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterDto {
  email: string;
  password: string;
  username: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}



