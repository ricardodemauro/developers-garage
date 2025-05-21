import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { type AppContext, MockyConfig, MockyConfigResponse } from "../types";
import { generateRandomId } from "../utils";

export class MockyConfigCreate extends OpenAPIRoute {
	schema = {
		tags: ["Mocky"],
		summary: "Create a new mock endpoint",
		request: {
			body: {
				content: {
					"application/json": {
						schema: MockyConfig,
					},
				},
			},
		},
		responses: {
			"200": {
				description: "Returns the created mock endpoint configuration",
				content: {
					"application/json": {
						schema: MockyConfigResponse,
					},
				},
			},
		},
	};

	async handle(c: AppContext) {
		// Get validated data
		const data = await this.getValidatedData<typeof this.schema>();

		// Retrieve the validated request body
		const mockyConfig = data.body;

		// Generate a unique ID for the mock endpoint
		const id = generateRandomId();

		// Calculate expiration time (24 hours from now)
		const createdAt = new Date().toISOString();
		const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

		// Create the configuration object to store in KV
		const configToStore = {
			...mockyConfig,
			id,
			createdAt,
			expiresAt,
		};

		// Store the configuration in KV with TTL
		await c.env.MOCKY_DATA.put(
			id,
			JSON.stringify(configToStore),
			{
				expirationTtl: 24 * 60 * 60, // 24 hours in seconds
			}
		);

		// Generate the mock endpoint URL
		const url = `${c.req.url.split('/api/')[0]}/mocky/${id}`;

		// Return the response with the created configuration
		return {
			success: true,
			result: {
				...configToStore,
				url,
			},
		};
	}
}
