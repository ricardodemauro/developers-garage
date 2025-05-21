import { OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { type AppContext, MockyConfigResponse } from "../types";
import { formatTimeRemaining } from "../utils";

export class MockyConfigFetch extends OpenAPIRoute {
	schema = {
		tags: ["Mocky"],
		summary: "Get a mock endpoint configuration",
		request: {
			params: z.object({
				id: Str({ description: "Mocky endpoint ID" }),
			}),
		},
		responses: {
			"200": {
				description: "Returns the mock endpoint configuration",
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

		// Retrieve the validated parameters
		const { id } = data.params;

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

		// Generate the mock endpoint URL
		const url = `${c.req.url.split('/api/')[0].split('/mocky-config')[0]}/mocky/${id}`;
		
		// Calculate time remaining until expiration
		const timeRemainingMs = new Date(storedConfig.expiresAt).getTime() - Date.now();
		const timeRemaining = formatTimeRemaining(timeRemainingMs);

		// Return the response with the configuration
		return {
			success: true,
			result: {
				...storedConfig,
				url,
				timeRemaining,
			},
		};
	}
}
