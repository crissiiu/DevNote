const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL){
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
}

type ApiFetchOptions = RequestInit & {
    token?: string | null;
}

export async function apiFetch<T>(
    path: string,
    options?: ApiFetchOptions,
) : Promise<T> {
    const { token, headers, ...restOptions } = options ?? {};

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...restOptions,
        headers: {
            "Content-Type": "application/json",
            ...(token ? {Authorization: `Bearer ${token}`} : {}),
            ...(headers ?? {}),
        },
    });

    const data = await response.json();
    
    if(!response.ok) {
        throw data;
    }

    return data as T;
}