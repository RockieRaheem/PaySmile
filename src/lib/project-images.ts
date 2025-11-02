// Shared project image mapping utility

// Project images mapping - eye-catching, relevant images
const projectImageMap: Record<string, string> = {
  // Emergency & Disaster Relief
  emergency:
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80", // Emergency food aid
  food: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80", // Food distribution
  relief:
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80", // Relief efforts
  flood: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&q=80", // Flood disaster
  shelter:
    "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&q=80", // Emergency shelter
  disaster:
    "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&q=80", // Disaster relief

  // Healthcare - Specific
  malaria:
    "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&q=80", // Malaria treatment
  maternal:
    "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80", // Maternal health
  health:
    "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80", // Medical care
  medical:
    "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80", // Healthcare workers
  clinic:
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80", // Medical clinic

  // Water & Sanitation
  water: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80", // Clean drinking water
  borehole:
    "https://images.unsplash.com/photo-1594498257673-9f36b767286c?w=800&q=80", // Water well/borehole
  well: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80", // Hand pump water

  // Education
  school:
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80", // Books and learning
  education:
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80", // Children in school
  library:
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80", // Library books

  // Agriculture & Food
  farm: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80", // Farming
  agriculture:
    "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80", // Agricultural field

  // Environment
  tree: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80", // Tree planting
  environment:
    "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80", // Nature conservation
  forest:
    "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80", // Forest restoration

  // Community & Infrastructure
  community:
    "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80", // Community gathering
  infrastructure:
    "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800&q=80", // Building construction
  housing:
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80", // Housing project

  // Technology
  technology:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80", // Tech & innovation
  digital:
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80", // Digital learning

  // Default fallback
  default:
    "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80", // Hands together (community)
};

/**
 * Get the appropriate image URL for a project based on its name, category, and description
 * @param name - Project name
 * @param category - Project category (optional)
 * @param description - Project description (optional)
 * @returns Image URL from Unsplash
 */
export function getProjectImage(
  name: string,
  category?: string,
  description?: string
): string {
  const projectName = name.toLowerCase();
  const searchText = `${name} ${category || ""} ${
    description || ""
  }`.toLowerCase();

  // Check project name first for specific matches (Rwanda crisis projects)
  if (
    projectName.includes("emergency food") ||
    projectName.includes("food relief")
  ) {
    return projectImageMap["emergency"];
  }
  if (projectName.includes("flood") || projectName.includes("flood victims")) {
    return projectImageMap["flood"];
  }
  if (projectName.includes("malaria")) {
    return projectImageMap["malaria"];
  }
  if (projectName.includes("maternal health")) {
    return projectImageMap["maternal"];
  }

  // General matches
  if (projectName.includes("clean water") || projectName.includes("water")) {
    return projectImageMap["water"];
  }
  if (projectName.includes("school") || projectName.includes("education")) {
    return projectImageMap["school"];
  }
  if (projectName.includes("health") || projectName.includes("medical")) {
    return projectImageMap["health"];
  }
  if (projectName.includes("tree") || projectName.includes("forest")) {
    return projectImageMap["tree"];
  }

  // Priority keywords (most specific first) - check in full search text
  const keywords = [
    "emergency",
    "flood",
    "malaria",
    "maternal",
    "disaster",
    "relief",
    "shelter",
    "school",
    "library",
    "education",
    "clinic",
    "medical",
    "health",
    "tree",
    "forest",
    "environment",
    "farm",
    "food",
    "agriculture",
    "housing",
    "infrastructure",
    "community",
    "digital",
    "technology",
    "borehole",
    "well",
    "water",
  ];

  // Find first matching keyword
  for (const keyword of keywords) {
    if (searchText.includes(keyword)) {
      return projectImageMap[keyword];
    }
  }

  return projectImageMap["default"];
}
