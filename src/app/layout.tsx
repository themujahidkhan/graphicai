import "./globals.css";

import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { Modals } from "@/components/modals";
import { Providers } from "@/components/providers";
import { SessionProvider } from "next-auth/react";
import { SubscriptionAlert } from "@/features/subscriptions/components/subscription-alert";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "GraphicAI.design",
	description:
		"Build a strong online presence by creating stunning graphics with AI",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();

	return (
		<SessionProvider session={session}>
			<html lang="en">
				<body className={inter.className}>
					<Providers>
						<Toaster />
						<Modals />
						<SubscriptionAlert />
						{children}
					</Providers>
				</body>
			</html>
		</SessionProvider>
	);
}
