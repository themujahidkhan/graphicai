"use client";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSignUp } from "@/features/auth/hooks/use-sign-up";
import { useState } from "react";

export const SignUpCard = () => {
	const mutation = useSignUp();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const onProviderSignUp = (provider: "github" | "google") => {
		signIn(provider, { callbackUrl: "/" });
	};

	const onCredentialSignUp = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		mutation.mutate(
			{
				name,
				email,
				password,
			},
			{
				onSuccess: () => {
					signIn("credentials", {
						email,
						password,
						callbackUrl: "/",
					});
				},
			},
		);
	};

	return (
		<div className="w-full max-w-md mx-auto">
			<h2 className="text-3xl font-bold mb-2">Create an account</h2>
			<p className="text-gray-600 mb-6">
				Use your email or another service to continue
			</p>
			{!!mutation.error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
					<div className="flex items-center">
						<TriangleAlert className="w-5 h-5 mr-2" />
						<span>Something went wrong</span>
					</div>
				</div>
			)}
			<form onSubmit={onCredentialSignUp} className="space-y-4">
				<Input
					disabled={mutation.isPending}
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Full name"
					type="text"
					required
					className="w-full"
				/>
				<Input
					disabled={mutation.isPending}
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Email"
					type="email"
					required
					className="w-full"
				/>
				<Input
					disabled={mutation.isPending}
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
					type="password"
					required
					minLength={3}
					maxLength={20}
					className="w-full"
				/>
				<Button
					disabled={mutation.isPending}
					type="submit"
					className="w-full"
					size="lg"
				>
					Sign Up
				</Button>
			</form>
			<div className="mt-6">
				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-gray-300" />
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="px-2 bg-white text-gray-500">Or continue with</span>
					</div>
				</div>
				<div className="mt-6">
					<Button
						disabled={mutation.isPending}
						onClick={() => onProviderSignUp("google")}
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
				Already have an account?{" "}
				<Link href="/sign-in" className="font-medium text-blue-600 hover:text-blue-500">
					Sign in
				</Link>
			</p>
		</div>
	);
};