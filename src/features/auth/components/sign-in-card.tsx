"use client";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { signIn } from "next-auth/react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export const SignInCard = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { trackEvent } = useAnalytics();

	const params = useSearchParams();
	const error = params.get("error");

	const onCredentialSignIn = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		trackEvent("sign_in_attempt", "Authentication", "Credentials");

		signIn("credentials", {
			email: email,
			password: password,
			callbackUrl: "/",
		});
	};

	const onProviderSignIn = (provider: "github" | "google") => {
		trackEvent("sign_in_attempt", "Authentication", provider);
		signIn(provider, { callbackUrl: "/" });
	};

	return (
		<div className="w-full max-w-md mx-auto">
			<h2 className="text-3xl font-bold mb-2">Login to continue</h2>
			<p className="text-gray-600 mb-6">
				Use your email or another service to continue
			</p>
			{!!error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
					<div className="flex items-center">
						<TriangleAlert className="w-5 h-5 mr-2" />
						<span>Invalid email or password</span>
					</div>
				</div>
			)}
			<form onSubmit={onCredentialSignIn} className="space-y-4">
				<Input
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Email"
					type="email"
					required
					className="w-full"
				/>
				<Input
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
					type="password"
					required
					className="w-full"
				/>
				<Button type="submit" className="w-full" size="lg">
					Sign In
				</Button>
			</form>
			<div className="mt-6">
				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-gray-300"></div>
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="px-2 bg-white text-gray-500">Or continue with</span>
					</div>
				</div>
				<div className="mt-6">
					<Button
						onClick={() => onProviderSignIn("google")}
						variant="outline"
						size="lg"
						className="w-full relative"
					>
						<FcGoogle className="mr-2 w-5 h-5" />
						Continue with Google
					</Button>
				</div>
			</div>
			<p className="mt-8 text-center text-sm text-gray-600">
				Don&apos;t have an account?{" "}
				<Link href="/sign-up" className="font-medium text-blue-600 hover:text-blue-500">
					Sign up
				</Link>
			</p>
		</div>
	);
};