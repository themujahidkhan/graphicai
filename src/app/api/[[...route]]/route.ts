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

// Single CORS middleware with specific configuration
app.use(
	"*",
	cors({
		origin: [
			"https://app.graphicai.design",
			"https://graphicai.design",
			"http://localhost:3000",
		],
		allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
		exposeHeaders: ["WWW-Authenticate", "Server-Authorization"],
		maxAge: 600,
	}),
);

// Logging middleware for debugging
app.use("*", async (c, next) => {
	console.log(`Request received: ${c.req.method} ${c.req.url}`);
	await next();
	console.log(`Response sent: ${c.res.status}`);
});

app.use("*", initAuthConfig(getAuthConfig));

const routes = app
	.route("/ai", ai)
	.route("/users", users)
	.route("/images", images)
	.route("/projects", projects)
	.route("/subscriptions", subscriptions);

// Handle OPTIONS requests
app.options("*", (c) => {
	return c.text("", 204);
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
export const OPTIONS = handle(app);

export type AppType = typeof routes;
