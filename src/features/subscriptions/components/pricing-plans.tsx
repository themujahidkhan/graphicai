import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useCheckout } from "@/features/subscriptions/api/use-checkout";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const plans = [
	{
		name: "Free",
		price: "$0",
		features: [
			"1K+ eye-catching templates at your fingertips",
			"100+ design types to unleash your creativity",
			"3M+ stunning stock photos and graphics",
			"10 AI-powered image creations monthly",
			"10 magic background removals",
			"5 GB cloud storage for your masterpieces",
		],
		cta: "Current Plan",
		highlighted: false,
	},
	{
		name: "Pro",
		price: {
			monthly: "$15",
			annually: "$60",
		},
		features: [
			"Unlimited premium templates to dazzle",
			"10M+ pro-quality stock photos at your command",
			"Endless AI image generation possibilities",
			"Unlimited background removal wizardry",
			"100GB cloud storage for your growing portfolio",
		],
		cta: "Upgrade Now",
		highlighted: true,
		stripeLookupKey: {
			monthly: process.env.STRIPE_MONTHLY_PRICE_ID,
			annually: process.env.STRIPE_YEARLY_PRICE_ID,
		},
	},
	{
		name: "Team",
		price: "Coming Soon",
		features: [
			"Unlimited premium templates for your squad",
			"100M+ stock photos to fuel your creativity",
			"Brand kits: Your visual identity, always on point",
			"Collaborate with up to 10 team members in real-time",
			"1 TB of storage for your team's masterpieces",
			"Unlimited AI image generation to push boundaries",
			"Endless background removal for picture-perfect results",
		],
		cta: "Join Waitlist",
		highlighted: false,
	},
];

export const PricingPlans = () => {
	const [isAnnual, setIsAnnual] = useState(false);
	const checkoutMutation = useCheckout();

	const getPrice = (plan) => {
		if (typeof plan.price === "object") {
			return isAnnual ? plan.price.annually : plan.price.monthly;
		}
		return plan.price;
	};

	const getSavings = (plan) => {
		if (typeof plan.price === "object") {
			const monthlyPrice = parseFloat(plan.price.monthly.replace("$", ""));
			const annualPrice = parseFloat(plan.price.annually.replace("$", ""));
			const savings = monthlyPrice * 12 - annualPrice;
			return savings.toFixed(2);
		}
		return 0;
	};

	const handleUpgrade = (plan) => {
		if (plan.stripeLookupKey) {
			const priceId = isAnnual ? plan.stripeLookupKey.annually : plan.stripeLookupKey.monthly;
			if (priceId) {
				console.log("Initiating checkout with priceId:", priceId);
				checkoutMutation.mutate({ priceId }, {
					onError: (error) => {
						console.error("Checkout error:", error);
						toast.error("Failed to initiate checkout. Please try again.");
					}
				});
			} else {
				console.error("Price ID is undefined for plan:", plan.name);
				toast.error("Unable to process upgrade. Please try again.");
			}
		} else {
			console.error("No stripeLookupKey found for plan:", plan.name);
			toast.error("Unable to process upgrade. Please try again.");
		}
	};

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
			<h2 className="text-4xl font-bold text-center mb-4">
				Pricing plans for every need
			</h2>
			<p className="text-xl text-center text-gray-600 mb-8">
				The most affordable AI-powered design tool.
			</p>

			<div className="flex items-center justify-center mb-8">
				<span
					className={`mr-3 ${isAnnual ? "text-gray-500" : "font-semibold"}`}
				>
					Monthly
				</span>
				<Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
				<span
					className={`ml-3 ${isAnnual ? "font-semibold" : "text-gray-500"}`}
				>
					Yearly
				</span>
			</div>

			<div className="grid md:grid-cols-3 gap-8">
				{plans.map((plan) => (
					<Card
						key={plan.name}
						className={`flex flex-col ${plan.highlighted
							? "bg-primary text-white shadow-lg transform scale-105"
							: "bg-white"
							}`}
					>
						<CardHeader>
							<CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
						</CardHeader>
						<CardContent className="flex-grow">
							<div className="text-3xl font-bold mb-6">{getPrice(plan)}</div>
							{isAnnual && getSavings(plan) > 0 && (
								<p className="text-sm mb-4 text-green-500">
									Save ${getSavings(plan)} per year
								</p>
							)}
							<ul className="space-y-2">
								{plan.features.map((feature) => (
									<li key={uuidv4()} className="flex items-center">
										<Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
										<span className="text-sm">{feature}</span>
									</li>
								))}
							</ul>
						</CardContent>
						<CardFooter>
							<Button
								className={`w-full ${plan.highlighted ? "bg-white text-primary hover:bg-gray-100" : ""
									}`}
								variant={plan.highlighted ? "secondary" : "default"}
								onClick={() => handleUpgrade(plan)}
								disabled={checkoutMutation.isPending || plan.name === "Team"}
							>
								{plan.cta}
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	);
};