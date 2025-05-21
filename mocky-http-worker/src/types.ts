import { DateTime, Str } from "chanfana";
import type { Context } from "hono";
import { z } from "zod";

export type AppContext = Context<{ Bindings: Env }>;

export const Task = z.object({
	name: Str({ example: "lorem" }),
	slug: Str(),
	description: Str({ required: false }),
	completed: z.boolean().default(false),
	due_date: DateTime(),
});

// Mocky HTTP types
export const Header = z.object({
	name: Str({ example: "Content-Type" }),
	value: Str({ example: "application/json" }),
});

export const MockyConfig = z.object({
	responseBody: z.any(),
	headers: z.array(Header),
	statusCode: z.number().default(200),
});

export const StoredMockyConfig = MockyConfig.extend({
	id: Str(),
	createdAt: z.string().datetime(),
	expiresAt: z.string().datetime()
});

export const MockyConfigResponse = z.object({
	success: z.boolean(),
	result: StoredMockyConfig.extend({
		url: Str()
	})
});
