/**
 * Map blockchain project names to display names
 * This allows us to show different names on the frontend without changing the blockchain
 */

const projectNameMap: Record<string, string> = {
  "Clean Water for Kampala": "Clean Water for Rural Communities",
};

/**
 * Map blockchain descriptions to display descriptions
 * This allows us to override descriptions without changing the blockchain
 */
const projectDescriptionMap: Record<string, string> = {
  "Build boreholes in rural Kampala communities":
    "Build boreholes to provide clean drinking water in rural communities",
};

/**
 * Get the display name for a project
 * @param blockchainName - The name stored on the blockchain
 * @returns The display name to show to users
 */
export function getProjectDisplayName(blockchainName: string): string {
  return projectNameMap[blockchainName] || blockchainName;
}

/**
 * Get the display description for a project
 * @param blockchainDescription - The description stored on the blockchain
 * @returns The display description to show to users
 */
export function getProjectDisplayDescription(
  blockchainDescription: string
): string {
  return projectDescriptionMap[blockchainDescription] || blockchainDescription;
}
