
/**
 * Generates a random ID string for Mocky endpoints
 * @param length Length of the ID to generate (default: 6)
 * @returns Random alphanumeric ID
 */
export function generateRandomId(length: number = 6): string {
	const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

/**
 * Converts milliseconds to a readable time string (e.g., "23 hours 45 minutes")
 * @param milliseconds Time in milliseconds
 * @returns Formatted time string
 */
export function formatTimeRemaining(milliseconds: number): string {
	const seconds = Math.floor(milliseconds / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	
	if (days > 0) {
		return `${days} day${days > 1 ? 's' : ''} ${hours % 24} hour${hours % 24 !== 1 ? 's' : ''}`;
	}
	
	if (hours > 0) {
		return `${hours} hour${hours > 1 ? 's' : ''} ${minutes % 60} minute${minutes % 60 !== 1 ? 's' : ''}`;
	}
	
	return `${minutes} minute${minutes > 1 ? 's' : ''}`;
}
