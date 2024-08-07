import { Hono } from "hono";
import { unsplash } from "@/lib/unsplash";
import { verifyAuth } from "@hono/auth-js";

const DEFAULT_COUNT = 30;
const DEFAULT_COLLECTION_IDS = ["317099"];

const app = new Hono().get("/", verifyAuth(), async (c) => {
	const searchTerm = c.req.query("search") || "";

	let images;
	if (searchTerm) {
		images = await unsplash.search.getPhotos({
			query: searchTerm,
			perPage: DEFAULT_COUNT,
		});
	} else {
		images = await unsplash.photos.getRandom({
			collectionIds: DEFAULT_COLLECTION_IDS,
			count: DEFAULT_COUNT,
		});
	}

	if (images.errors) {
		return c.json({ error: "Something went wrong" }, 400);
	}

	let response = searchTerm ? images.response.results : images.response;

	if (!Array.isArray(response)) {
		response = [response];
	}

	return c.json({ data: response });
});

export default app;
