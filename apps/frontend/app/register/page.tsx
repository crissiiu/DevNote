"use client";

import { apiFetch } from "@/lib/api/client";
import { ApiErrorResponse, RegisterResponse } from "@/lib/types/auth";
import { AlertCircle, Bookmark, Lock, LogIn, Mail, Sparkles, UserPen } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage("");
        setIsSubmitting(true);

        try {
            const response = await apiFetch<RegisterResponse>("/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password,
                    displayName: displayName || email
                })
            });

            if (response.success) {
                router.push("/login");
            } else {
                setErrorMessage(response.message);
            }
        } catch (error) {
            const apiError = error as ApiErrorResponse;
            
            if(Array.isArray(apiError?.message)) {
                setErrorMessage(apiError.message.join(", "));
            } else {
                setErrorMessage(apiError?.message || "Registration failed. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleLoginClick() {
        router.push("/login");
    }

    return (
        <main className="min-h-screen mt-10 bg-background flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />

            <div className="w-full max-w-[440px] animate-fade-in relative z-10">
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-2xl shadow-primary/30 mb-6">
                        <Bookmark className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground">
                        DevNote<span className="text-primary">.</span>
                    </h1>
                    <p className="mt-2 text-muted-foreground font-medium">
                        Your second brain for brilliant ideas.
                    </p>
                </div>

                <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-xl shadow-primary/5">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-foreground">Create Account</h2>
                        <p className="text-sm text-muted-foreground mt-1">Sign up to get started.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-[11px] font-black uppercase tracking-wider text-muted-foreground ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <input 
                                    id="email" 
                                    type="email"
                                    className="w-full h-12 bg-muted/30 border border-border rounded-2xl pl-11 pr-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/5 font-medium"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)} 
                                    placeholder="sieu@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="password" className="text-[11px] font-black uppercase tracking-wider text-muted-foreground ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                                    <Lock className="h-4 w-4" />
                                </div>
                                <input 
                                    id="password" 
                                    type="password"
                                    className="w-full h-12 bg-muted/30 border border-border rounded-2xl pl-11 pr-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/5 font-medium"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)} 
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="password" className="text-[11px] font-black uppercase tracking-wider text-muted-foreground ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                                    <UserPen className="h-4 w-4" />
                                </div>
                                <input 
                                    id="displayName" 
                                    type="text"
                                    className="w-full h-12 bg-muted/30 border border-border rounded-2xl pl-11 pr-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/5 font-medium"
                                    value={displayName}
                                    onChange={(event) => setDisplayName(event.target.value)} 
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        {errorMessage && (
                            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-destructive/5 border border-destructive/20 text-[13px] font-semibold text-destructive animate-fade-in">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                {errorMessage}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:opacity-95 transition-all disabled:opacity-40 disabled:shadow-none hover:scale-[1.01] active:scale-[0.99] mt-4"
                        >
                            {isSubmitting ? (
                                <Sparkles className="h-5 w-5 animate-pulse" />
                            ) : (
                                <LogIn className="h-5 w-5" />
                            )}
                            {isSubmitting ? "Registering..." : "Register"}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-border/60 text-center">
                        <p className="text-[13px] text-muted-foreground">
                            Already have an account? <span className="text-primary font-bold cursor-pointer hover:underline" onClick={handleLoginClick}>Sign in</span>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}