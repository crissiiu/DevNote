export type LoginRequest = {
    email: string;
    password: string;
};

export type LoginResponse = {
    success: boolean;
    message: string;
    accessToken: string;
    user: {
        id: string;
        email: string;
        displayName?: string | null;
    };
};

export type RegisterRequest = {
    email: string;
    password: string;
    displayName: string;
}

export type RegisterResponse = {
    success: boolean;
    message: string;
    data: {
        id: string;
        email: string;
        displayName?: string | null;
        createdAt: string;
        updatedAt: string;
    };
}

export type ApiErrorResponse = {
    success: boolean;
    statusCode: number;
    message: string | string[];
    timestamp: string;
    path: string;
}