export function getCalApiConfig(): {
  apiKey?: string;
  apiUrl: string;
  apiVersion: string;
} {
  return {
    // Optional: every endpoint the booker calls accepts anonymous requests.
    apiKey: process.env.CAL_API_KEY || undefined,
    apiUrl: process.env.CAL_API_URL ?? "https://api.cal.com/v2",
    apiVersion: process.env.CAL_API_VERSION ?? "2024-08-13",
  };
}
