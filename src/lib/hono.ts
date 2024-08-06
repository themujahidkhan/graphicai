import { hc } from "hono/client";

const isDevelopment = process.env.NODE_ENV === "development";
const apiUrl = isDevelopment
	? "http://localhost:3000"
	: "https://app.graphicai.design";

export const client = hc(apiUrl, {
	headers: {
		"Content-Type": "application/json",
	},
});
