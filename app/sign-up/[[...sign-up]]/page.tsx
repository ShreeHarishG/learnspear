"use client";

import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function SignUpPage() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    // Form Submit: Create User
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        try {
            await signUp.create({
                emailAddress,
                password,
                unsafeMetadata: {
                    role: "user", // Hardcoded role
                },
            });

            // Send email verification code
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

            setPendingVerification(true);
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            setError(err.errors?.[0]?.message || "Something went wrong during sign up");
        }
    };

    // Verify Email Code
    const onPressVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (completeSignUp.status !== "complete") {
                /*  investigate the response, to see if there was an error
                 or if the user needs to complete more steps.*/
                console.log(JSON.stringify(completeSignUp, null, 2));
            }

            if (completeSignUp.status === "complete") {
                await setActive({ session: completeSignUp.createdSessionId });

                // Redirect to user dashboard
                router.push("/user");
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            setError(err.errors?.[0]?.message || "Verification failed");
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-bg-light p-6">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-border-color">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-primary mb-2">Create Account</h1>
                    <p className="text-text-muted">Join LearnSpear today</p>
                </div>

                {!pendingVerification ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-heading mb-1">Email Address</label>
                            <input
                                type="email"
                                value={emailAddress}
                                onChange={(e) => setEmailAddress(e.target.value)}
                                className="w-full rounded-lg border border-border-color p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-text-body"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-heading mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-lg border border-border-color p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-text-body"
                                placeholder="••••••••"
                                required
                            />
                        </div>


                        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-primary py-3 font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] hover:bg-primary-dark mt-4"
                        >
                            Sign Up
                        </button>

                        <p className="text-center text-sm text-text-muted mt-4">
                            Already have an account? <Link href="/" className="text-primary hover:underline">Sign In</Link>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={onPressVerify} className="space-y-4">
                        <div className="text-center mb-6">
                            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-3xl">
                                📧
                            </div>
                            <h2 className="text-xl font-semibold text-text-heading">Verify your email</h2>
                            <p className="text-sm text-text-muted mt-1">We sent a code to <span className="font-medium text-text-body">{emailAddress}</span></p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-heading mb-1">Verification Code</label>
                            <input
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full rounded-lg border border-border-color p-3 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-mono"
                                placeholder="000000"
                                required
                            />
                        </div>

                        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-primary py-3 font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] hover:bg-primary-dark"
                        >
                            Verify & Create Account
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
