"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	IconCreditCard,
	IconCrown,
	IconLoader,
	IconLogout,
	IconUser,
} from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";

import { useBilling } from "@/features/subscriptions/api/use-billing";
import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";
import { useRouter } from "next/navigation";

export const UserButton = () => {
	const { shouldBlock, triggerPaywall, isLoading } = usePaywall();
	const mutation = useBilling();
	const session = useSession();
	const router = useRouter();

	const onClick = () => {
		if (shouldBlock) {
			triggerPaywall();
			return;
		}

		mutation.mutate();
	};

	if (session.status === "loading") {
		return <IconLoader className="size-4 animate-spin text-muted-foreground" />;
	}

	if (session.status === "unauthenticated" || !session.data) {
		return null;
	}

	const name = session.data?.user?.name ?? "User";
	const imageUrl = session.data?.user?.image;

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger className="outline-none relative">
				{!shouldBlock && !isLoading && (
					<div className="absolute -top-1 -left-1 z-10 flex items-center justify-center">
						<div className="rounded-full bg-white flex items-center justify-center p-1 drop-shadow-sm">
							<IconCrown className="size-3 text-yellow-500 fill-yellow-500" />
						</div>
					</div>
				)}
				<Avatar className="size-10 hover:opcaity-75 transition">
					<AvatarImage alt={name} src={imageUrl || ""} />
					<AvatarFallback className="bg-blue-500 font-medium text-white flex items-center justify-center">
						{name.charAt(0).toUpperCase()}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-60">
				<DropdownMenuItem
					onClick={() => router.push("/billing")}
					className="h-10"
				>
					<IconCreditCard className="size-4 mr-2" />
					Billing
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="h-10" >
					<IconUser className="size-4 mr-2" />
					Profile
				</DropdownMenuItem>
				<DropdownMenuItem className="h-10" onClick={() => signOut()}>
					<IconLogout className="size-4 mr-2" />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
