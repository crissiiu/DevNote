const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL){
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
}

export async function apiFetch<T>(
    path: string,
    options?: RequestInit,
) : Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options?.headers ?? {}),
        },
    });

    const data = await response.json();
    
    if(!response.ok) {
        throw data;
    }

    return data as T;
}