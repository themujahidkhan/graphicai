import { hc } from "hono/client";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://graphicai.design";

export const client = hc(apiUrl, {
	headers: {
		"Content-Type": "application/json",
	},
});
