const ACCESS_TOKEN_KEY = "devnote_access_token";

export function setAccessToken(token: string): void {
    // Lưu cookie với thời hạn 7 ngày (60 * 60 * 24 * 7 giây)
    document.cookie = `${ACCESS_TOKEN_KEY}=${token}; path=/; max-age=604800; SameSite=Strict`;
}

export function getAccessToken(): string | null {
    if (typeof document === 'undefined') return null;
    const name = ACCESS_TOKEN_KEY + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

export function removeAccessToken(): void {
    document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
}