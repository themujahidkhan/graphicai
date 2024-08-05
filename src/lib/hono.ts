import { AppType } from "@/app/api/[[...route]]/route";
import { hc } from "hono/client";

export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL || "", {
	fetch: (input: RequestInfo | URL, init?: RequestInit) => {
		return fetch(input, {
			...init,
			credentials: "include",
		});
	},
});
