"use client";

import {
	IconCreditCard,
	IconCrown,
	IconHelp,
	IconLayout,
	IconTemplate,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarItem } from "./sidebar-item";
import { useBilling } from "@/features/subscriptions/api/use-billing";
import { useCheckout } from "@/features/subscriptions/api/use-checkout";
import { usePathname } from "next/navigation";
import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";

export const SidebarRoutes = () => {
	const mutation = useCheckout();
	const billingMutation = useBilling();
	const { shouldBlock, isLoading, triggerPaywall } = usePaywall();

	const pathname = usePathname();

	const onClick = () => {
		if (shouldBlock) {
			triggerPaywall();
			return;
		}

		billingMutation.mutate();
	};

	return (
		<div className="flex flex-col gap-y-4 flex-1">
			<ul className="flex flex-col gap-y-1 px-3">
				<SidebarItem
					href="/"
					icon={IconLayout}
					label="Home"
					isActive={pathname === "/"}
				/>
			</ul>
			<div className="px-3">
				<Separator />
			</div>
			<ul className="flex flex-col gap-y-1 px-3">
				<SidebarItem
					href={pathname}
					icon={IconTemplate}
					label="Templates"
					onClick={onClick}
				/>
				<SidebarItem href="/billing" icon={IconCreditCard} label="Billing" />
				<SidebarItem
					// TODO: Add Support Email here
					href="mailto:"
					icon={IconHelp}
					label="Get Help"
				/>
			</ul>
		</div>
	);
};
