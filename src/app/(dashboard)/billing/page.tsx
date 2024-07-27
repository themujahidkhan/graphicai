"use client";

import { Loader } from "lucide-react";
import { PricingPlans } from "@/features/subscriptions/components/pricing-plans";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useEffect } from "react";
import { useGetSubscription } from "@/features/subscriptions/api/use-get-subscription";

const BillingPage = () => {
	const { data: subscription, isLoading } = useGetSubscription();
	const { trackEvent } = useAnalytics();

	useEffect(() => {
		if (subscription?.active) {
			trackEvent("view_pro_subscription", "Subscription", "Active");
		} else {
			trackEvent("view_free_subscription", "Subscription", "Inactive");
		}
	}, [subscription, trackEvent]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-full">
				<Loader className="w-6 h-6 animate-spin" />
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto py-8">
			<h1 className="text-3xl font-bold mb-6">Billing</h1>
			{subscription?.active ? (
				<div className="mb-8">
					<p className="text-lg">You are currently on the Pro plan.</p>
				</div>
			) : null}
			<PricingPlans />
		</div>
	);
};

export default BillingPage;
