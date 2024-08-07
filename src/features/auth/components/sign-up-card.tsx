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
		<div className="w-full max-w-md mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16">
			<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-4 md:mb-6 lg:mb-8 xl:mb-10 text-center">Create an account</h2>
			<p className="text-gray-600 mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-14 text-center text-sm sm:text-base">
				Use your email or another service to continue
			</p>
			{!!mutation.error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
					<div className="flex items-center">
						<TriangleAlert className="w-5 h-5 mr-2 flex-shrink-0" />
						<span className="text-sm">Something went wrong</span>
					</div>
				</div>
			)}
			<form onSubmit={onCredentialSignUp} className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10 xl:space-y-12">
				<Input
					disabled={mutation.isPending}
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Full name"
					type="text"
					required
					className="w-full rounded-lg"
				/>
				<Input
					disabled={mutation.isPending}
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Email"
					type="email"
					required
					className="w-full rounded-lg"
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
					className="w-full rounded-lg"
				/>
				<Button
					disabled={mutation.isPending}
					type="submit"
					className="w-full rounded-lg"
					size="lg"
				>
					Sign Up
				</Button>
			</form>
			<div className="mt-8 sm:mt-10 md:mt-12 lg:mt-14 xl:mt-16">
				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-gray-300" />
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="px-2 bg-white text-gray-500">Or continue with</span>
					</div>
				</div>
				<div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-14">
					<Button
						disabled={mutation.isPending}
						onClick={() => onProviderSignUp("google")}
						variant="outline"
						size="lg"
						className="w-full relative rounded-lg hover:bg-gray-50 transition-colors"
					>
						<FcGoogle className="mr-2 w-5 h-5" />
						Continue with Google
					</Button>
				</div>
			</div>
			<p className="mt-8 sm:mt-10 md:mt-12 lg:mt-14 xl:mt-16 text-center text-sm text-gray-600">
				Already have an account?{" "}
				<Link href="/sign-in" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
					Sign in
				</Link>
			</p>
		</div>
	);
};