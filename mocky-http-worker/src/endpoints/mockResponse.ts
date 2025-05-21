import { Context } from "hono";

/**
 * Handles requests to a mock endpoint
 * This function serves the stored mock response with the configured headers and status code
 */
export async function handleMockRequest(c: Context<{ Bindings: Env }>) {
	// Get the mock ID from the URL
	const { id } = c.req.param();

	// Check if the configuration exists
	const storedConfigJson = await c.env.MOCKY_DATA.get(id);
	
	if (!storedConfigJson) {
		return c.json(
			{
				success: false,
				error: "Mock endpoint not found",
			},
			404,
		);
	}

	// Parse the stored configuration
	const storedConfig = JSON.parse(storedConfigJson);
	
	// Create a new response with the mock's responseBody
	const response = Response.json(
		storedConfig.responseBody,
		{
			status: storedConfig.statusCode || 200,
		}
	);

	// Add all configured headers to the response
	if (storedConfig.headers && Array.isArray(storedConfig.headers)) {
		storedConfig.headers.forEach((header: { name: string; value: string }) => {
			if (header.name && header.value) {
				response.headers.set(header.name, header.value);
			}
		});
	}

	return response;
}
