"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
		<div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
			<h1 className="text-3xl font-bold mb-6">Billing</h1>
			{subscription?.active ? (
				<Card className="mb-8">
					<CardHeader>
						<CardTitle>Current Subscription</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-lg">You are currently on the Pro plan.</p>
						<p className="text-sm text-gray-500 mt-2">
							Next billing date: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
						</p>
					</CardContent>
				</Card>
			) : null}
			<PricingPlans />
		</div>
	);
};

export default BillingPage;