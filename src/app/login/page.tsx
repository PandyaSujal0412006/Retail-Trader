"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            if (!userCredential.user.emailVerified) {
                await signOut(auth);
                setError("Please verify your email before logging in. Check your inbox and spam folder.");
                setLoading(false);
                return;
            }

            if (email.trim().toLowerCase() === "sujal.pandya0412006@gmail.com") {
                router.push("/admin");
            } else {
                router.push("/"); // Redirect to dashboard
            }
        } catch (err: any) {
            setError(err.message || "Failed to log in");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B1120] p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center justify-center space-y-2 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Activity className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">TradeVault</h1>
                    <p className="text-sm text-slate-400">Sign in to your account</p>
                </div>

                <Card className="border-slate-800 bg-[#0F172A]">
                    <CardHeader>
                        <CardTitle className="text-xl text-slate-100">Welcome back</CardTitle>
                        <CardDescription className="text-slate-400">
                            Enter your email and password to access your dashboard.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            {error && (
                                <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={loading}>
                                {loading ? "Signing in..." : "Sign in"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm text-slate-400">
                            Don't have an account?{" "}
                            <Link href="/register" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                                Register here
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}