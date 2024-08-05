import { Context, Env } from "hono";

import { Hono } from "hono";
import ai from "@/api/ai";
import authConfig from "@/auth.config";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import images from "@/api/images";
import projects from "@/api/projects";
import subscriptions from "@/api/subscriptions";
import users from "@/api/users";

// Function to get AuthConfig
function getAuthConfig(c: Context<Env>): AuthConfig {
	return {
		secret: c.env.AUTH_SECRET,
		...authConfig,
	};
}

// Initialize Hono App
const app = new Hono().basePath("/api");

// Configure CORS
app.use(
	"*",
	cors({
		origin: "https://app.graphicai.design",
		methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

// Apply authentication configuration
app.use("*", initAuthConfig(getAuthConfig));

// Define routes
app
	.route("/ai", ai)
	.route("/users", users)
	.route("/images", images)
	.route("/projects", projects)
	.route("/subscriptions", subscriptions);

// Handle all HTTP methods
export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
export const OPTIONS = handle(app);

// Handle OPTIONS requests specifically for CORS
app.options("*", (c) => {
	c.res.headers.set(
		"Access-Control-Allow-Origin",
		"https://app.graphicai.design",
	);
	c.res.headers.set(
		"Access-Control-Allow-Methods",
		"GET, POST, PATCH, DELETE, OPTIONS",
	);
	c.res.headers.set(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization",
	);
	c.res.headers.set("Access-Control-Allow-Credentials", "true");
	return c.text("OK");
});

export default handle(app);
