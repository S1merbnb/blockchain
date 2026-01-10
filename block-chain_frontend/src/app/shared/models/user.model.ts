export interface User {
	email: string;
	password?: string;
	token?: string;
	role?: string;
	// UI-only transient flag used by the table to indicate saving state
	saving?: boolean;
	// UI-only transient field to show per-row error messages from server
	error?: string;
}

export interface AuthResponse {
	token: string;
	email: string;
	role?: string;
}
