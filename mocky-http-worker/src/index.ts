import { fromHono } from "chanfana";
import { Hono } from "hono";
import { handleMockRequest } from "./endpoints/mockResponse";
import { MockyConfigCreate } from "./endpoints/mockyConfigCreate";
import { MockyConfigFetch } from "./endpoints/mockyConfigFetch";
import { MockyConfigUpdate } from "./endpoints/mockyConfigUpdate";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/",
});

// Register Mocky HTTP configuration endpoints
openapi.post("/api/mocky-config", MockyConfigCreate);
openapi.put("/api/mocky-config/:id", MockyConfigUpdate);
openapi.get("/api/mocky-config/:id", MockyConfigFetch);

// Register the Mocky HTTP response handler for all HTTP methods
// These are not OpenAPI endpoints, as they should return the configured response directly
app.all("/mocky/:id", handleMockRequest);

// Export the Hono app
export default app;
