import { event } from "@next/third-parties/google";

export const useAnalytics = () => {
	const trackEvent = (
		action: string,
		category: string,
		label?: string,
		value?: number,
	) => {
		event(action, {
			category,
			label,
			value,
		});
	};

	return { trackEvent };
};
