import { OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { type AppContext, MockyConfig, MockyConfigResponse } from "../types";

export class MockyConfigUpdate extends OpenAPIRoute {
	schema = {
		tags: ["Mocky"],
		summary: "Update an existing mock endpoint",
		request: {
			params: z.object({
				id: Str({ description: "Mocky endpoint ID" }),
			}),
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
				description: "Returns the updated mock endpoint configuration",
				content: {
					"application/json": {
						schema: MockyConfigResponse,
					},
				},
			},
			"404": {
				description: "Mock endpoint not found",
				content: {
					"application/json": {
						schema: z.object({
							success: z.boolean(),
							error: Str(),
						}),
					},
				},
			},
		},
	};

	async handle(c: AppContext) {
		// Get validated data
		const data = await this.getValidatedData<typeof this.schema>();

		// Retrieve the validated parameters and request body
		const { id } = data.params;
		const updatedConfig = data.body;

		// Check if the configuration exists
		const storedConfigJson = await c.env.MOCKY_DATA.get(id);
		
		if (!storedConfigJson) {
			return Response.json(
				{
					success: false,
					error: "Mock endpoint not found",
				},
				{
					status: 404,
				},
			);
		}

		// Parse the stored configuration
		const storedConfig = JSON.parse(storedConfigJson);

		// Update the configuration
		const configToStore = {
			...storedConfig,
			responseBody: updatedConfig.responseBody,
			headers: updatedConfig.headers,
			statusCode: updatedConfig.statusCode,
		};

		// Store the updated configuration in KV
		// Note: We maintain the original expiration time
		const remainingTtlMs = new Date(storedConfig.expiresAt).getTime() - Date.now();
		const remainingTtlSec = Math.max(1, Math.floor(remainingTtlMs / 1000)); // Ensure minimum 1 second

		await c.env.MOCKY_DATA.put(
			id,
			JSON.stringify(configToStore),
			{
				expirationTtl: remainingTtlSec,
			}
		);

		// Generate the mock endpoint URL
		const url = `${c.req.url.split('/api/')[0].split('/mocky-config')[0]}/mocky/${id}`;

		// Return the response with the updated configuration
		return {
			success: true,
			result: {
				...configToStore,
				url,
			},
		};
	}
}
