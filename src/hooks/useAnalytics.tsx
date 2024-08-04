import { useEffect } from "react";

declare global {
	interface Window {
		gtag: (
			type: string,
			action: string,
			params: {
				event_category?: string;
				event_label?: string;
				value?: number;
				page_path?: string;
			},
		) => void;
	}
}

export const useAnalytics = () => {
	useEffect(() => {
		const handleRouteChange = (event: Event) => {
			const url = (event as CustomEvent<string>).detail;
			if (typeof window !== "undefined" && window.gtag) {
				window.gtag("config", "YOUR_GA_MEASUREMENT_ID", {
					page_path: url,
				});
			}
		};

		// Listen for route changes
		if (typeof window !== "undefined") {
			window.addEventListener("routeChangeComplete", handleRouteChange);
		}

		return () => {
			if (typeof window !== "undefined") {
				window.removeEventListener(
					"routeChangeComplete",
					handleRouteChange,
				);
			}
		};
	}, []);

	const trackEvent = (
		action: string,
		category: string,
		label?: string,
		value?: number,
	) => {
		if (typeof window !== "undefined" && window.gtag) {
			window.gtag("event", action, {
				event_category: category,
				event_label: label,
				value: value,
			});
		}
	};

	const trackPageView = (url: string) => {
		if (typeof window !== "undefined" && window.gtag) {
			window.gtag("config", "YOUR_GA_MEASUREMENT_ID", {
				page_path: url,
			});
		}
	};

	return { trackEvent, trackPageView };
};