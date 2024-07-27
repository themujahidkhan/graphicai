"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
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
		<Card className="w-full h-full p-8">
			<CardHeader className="px-0 pt-0">
				<CardTitle>Login to continue</CardTitle>
				<CardDescription>
					Use your email or another service to continue
				</CardDescription>
			</CardHeader>
			{!!error && (
				<div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
					<TriangleAlert className="size-4" />
					<p>Invalid email or password</p>
				</div>
			)}
			<CardContent className="space-y-5 px-0 pb-0">
				<form onSubmit={onCredentialSignIn} className="space-y-2.5">
					<Input
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Email"
						type="email"
						required
					/>
					<Input
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Password"
						type="password"
						required
					/>
					<Button type="submit" className="w-full" size="lg">
						Continue
					</Button>
				</form>
				<Separator />
				<div className="flex flex-col gap-y-2.5">
					<Button
						onClick={() => onProviderSignIn("google")}
						variant="outline"
						size="lg"
						className="w-full relative"
					>
						<FcGoogle className="mr-2 size-5 top-2.5 left-2.5 absolute" />
						Continue with Google
					</Button>
				</div>
				<p className="text-xs text-muted-foreground">
					Don&apos;t have an account?{" "}
					<Link href="/sign-up">
						<span className="text-sky-700 hover:underline">Sign up</span>
					</Link>
				</p>
			</CardContent>
		</Card>
	);
};
