export interface UserDto {
    id?: number;
    nome: string;
    email: string;
    senha?: string;
    role?: string;
}

export interface tokenDecoded {
    id: number;
    iat: number;
    iss: string;
    sub: string;
    exp: number;
    role: string;
    nome: string;
    isValidToken: boolean;
}

export interface authDto{
    email: string;
    senha: string;
}

export enum userRole {
  USER = "ROLE_USER",
  ADMIN = "ROLE_ADMIN",
}


