import { Hono } from "hono";
import bcrypt from "bcryptjs";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const app = new Hono()
	.use("*", async (c, next) => {
		c.header("Access-Control-Allow-Origin", "*");
		c.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
		c.header("Access-Control-Allow-Credentials", "true");

		if (c.req.method === "OPTIONS") {
			return c.text("", 204);
		}

		await next();
	})
	.post(
		"/",
		zValidator(
			"json",
			z.object({
				name: z.string(),
				email: z.string().email(),
				password: z.string().min(3).max(20),
			}),
		),
		async (c) => {
			const { name, email, password } = c.req.valid("json");

			const hashedPassword = await bcrypt.hash(password, 12);

			const query = await db.select().from(users).where(eq(users.email, email));

			if (query[0]) {
				return c.json({ error: "Email already in use" }, 400);
			}

			await db.insert(users).values({
				id: uuidv4(),
				email,
				name,
				password: hashedPassword,
			});

			c.header("Content-Type", "application/json");
			return c.json(null, 200);
		},
	)
	.get("/", async (c) => {
		const allUsers = await db.select().from(users);
		c.header("Content-Type", "application/json");
		return c.json({ users: allUsers }, 200);
	});

export default app;
