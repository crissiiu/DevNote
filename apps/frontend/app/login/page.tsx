"use client";

import { FormEvent, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { setAccessToken } from "@/lib/auth/token";
import { ApiErrorResponse, LoginResponse } from "@/lib/types/auth";
import { useRouter } from "next/navigation";


export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage("");
        setIsSubmitting(true);

        try {
            const response = await apiFetch<LoginResponse> ("/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            setAccessToken(response.accessToken);
            router.push("/notes");
        } catch (error) {
            const apiError = error as ApiErrorResponse;

            if(Array.isArray(apiError.message)) {
                setErrorMessage(apiError.message.join(", "));
            } else {
                setErrorMessage(apiError.message || "Login failed");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center px-4" >
            <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm">
                <h1 className="text-2xl font-bold">Login DevNote</h1>
                <p className="mt-2 text-sm text-gray-600">Welcome back! Please enter your details.</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium">
                            Email
                        </label>

                        <input 
                            id="email" 
                            type="text"
                            className="w-full rounded-lg border px-3 py-2 outline-none"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)} 
                            placeholder="sieu@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-1 block text-sm font-medium">
                            Password
                        </label>

                        <input 
                            id="password" 
                            type="password"
                            className="w-full rounded-lg border px-3 py-2 outline-none"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)} 
                            placeholder="********"
                            required
                        />
                    </div>

                    {errorMessage ? (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-3 text-sm text-red-600">
                            {errorMessage}
                        </div>
                    ) : null}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-black px-4 py-2 text-white disabled:opacity-60">
                            {isSubmitting ? "Logging in..." : "Login"}
                        </button>

                </form>
            </div>
        </main>
    );
}