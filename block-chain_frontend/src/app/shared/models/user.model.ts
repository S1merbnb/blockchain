export interface User {
	email: string;
	password?: string;
	token?: string;
	role?: string;
}

export interface AuthResponse {
	token: string;
	email: string;
	role?: string;
}
