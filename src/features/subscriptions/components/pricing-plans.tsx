import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
			annually: "$5",
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
					<div
						key={plan.name}
						className={`rounded-lg p-8 ${plan.highlighted
							? "bg-primary text-white shadow-lg transform scale-105"
							: "bg-white border"
							}`}
					>
						<h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
						<div className="text-3xl font-bold mb-6">
							{typeof plan.price === "object"
								? `${isAnnual ? plan.price.annually : plan.price.monthly}/mo`
								: plan.price}
						</div>
						<ul className="mb-8">
							{plan.features.map((feature, index) => (
								<li key={uuidv4()} className="flex items-center mb-3">
									<Check className="mr-2 h-5 w-5 text-green-500" />
									<span>{feature}</span>
								</li>
							))}
						</ul>
						<Button
							className={`w-full ${plan.highlighted ? "bg-white text-primary hover:bg-gray-100" : ""}`}
							variant={plan.highlighted ? "secondary" : "default"}
						>
							{plan.cta}
						</Button>
					</div>
				))}
			</div>
		</div>
	);
};