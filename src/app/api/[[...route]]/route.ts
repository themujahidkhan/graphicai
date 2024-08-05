import { AuthConfig, initAuthConfig } from "@hono/auth-js";
import { Context, Hono } from "hono";

import ai from "./ai";
import authConfig from "@/auth.config";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import images from "./images";
import projects from "./projects";
import subscriptions from "./subscriptions";
import users from "./users";

// Revert to "edge" if planning on running on the edge
export const runtime = "nodejs";

function getAuthConfig(c: Context): AuthConfig {
	return {
		secret: c.env.AUTH_SECRET,
		...authConfig,
	};
}

const app = new Hono().basePath("/api");

// Add CORS middleware
app.use(
	"*",
	cors({
		origin: [
			"app.graphicai.design",
			"localhost:3000",
			"graphicai.design",
		],
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowHeaders: ["Origin", "Content-Type", "Accept", "Authorization"],
		exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
		maxAge: 600,
		credentials: true,
	}),
);

app.use("*", initAuthConfig(getAuthConfig));

const routes = app
	.route("/ai", ai)
	.route("/users", users)
	.route("/images", images)
	.route("/projects", projects)
	.route("/subscriptions", subscriptions);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
export const OPTIONS = handle(app);

export type AppType = typeof routes;
