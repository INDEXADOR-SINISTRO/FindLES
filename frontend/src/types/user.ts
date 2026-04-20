export interface UserDto {
    id?: number;
    nome: string;
    email: string;
    senha?: string;
    role?: string;
    cadastradoEm?: string;
}

export interface UserEditarDto {
    nome: string;
    email: string;
    role: number;
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

export interface emailRecoverPasswordDto{
    email: string;
}

export interface redefinirSenhaDto{
    password: string;
}

export enum userRole {
  USER = "ROLE_USER",
  ADMIN = "ROLE_ADMIN",
}


