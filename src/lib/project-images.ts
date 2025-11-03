// Shared project image mapping utility

// Project images mapping - High quality images for each project category
const projectImageMap: Record<string, string> = {
  // Emergency & Disaster Relief - Hungry children needing food
  emergency:
    "https://images.unsplash.com/photo-1507427100689-2bf8574e32d4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVuZ2VyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
  food: "https://images.unsplash.com/photo-1507427100689-2bf8574e32d4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVuZ2VyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
  relief:
    "https://images.unsplash.com/photo-1507427100689-2bf8574e32d4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVuZ2VyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
  hunger:
    "https://images.unsplash.com/photo-1507427100689-2bf8574e32d4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVuZ2VyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",

  // Floods/Bridge - Natural disaster relief
  flood:
    "https://images.unsplash.com/photo-1657069343999-39722b95f1d8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTh8fGZsb29kc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500",
  bridge:
    "https://images.unsplash.com/photo-1657069343999-39722b95f1d8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTh8fGZsb29kc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500",
  disaster:
    "https://images.unsplash.com/photo-1657069343999-39722b95f1d8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTh8fGZsb29kc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500",
  shelter:
    "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=1200&q=95",

  // Healthcare - Children receiving medical care
  malaria:
    "https://media.istockphoto.com/id/2211920593/photo/samburu-sick-baby-sleeping-in-hospital-bed-with-intravenous-drip-in-turkana-in-kenya.webp?a=1&b=1&s=612x612&w=0&k=20&c=egtvr27KzpKtbe4v-BYXhuftbH7jinLOANAE8ie1Kkc=",
  maternal:
    "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1200&q=95",
  health:
    "https://media.istockphoto.com/id/2211920593/photo/samburu-sick-baby-sleeping-in-hospital-bed-with-intravenous-drip-in-turkana-in-kenya.webp?a=1&b=1&s=612x612&w=0&k=20&c=egtvr27KzpKtbe4v-BYXhuftbH7jinLOANAE8ie1Kkc=",
  medical:
    "https://media.istockphoto.com/id/2211920593/photo/samburu-sick-baby-sleeping-in-hospital-bed-with-intravenous-drip-in-turkana-in-kenya.webp?a=1&b=1&s=612x612&w=0&k=20&c=egtvr27KzpKtbe4v-BYXhuftbH7jinLOANAE8ie1Kkc=",
  clinic:
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=95",
  prevention:
    "https://media.istockphoto.com/id/2211920593/photo/samburu-sick-baby-sleeping-in-hospital-bed-with-intravenous-drip-in-turkana-in-kenya.webp?a=1&b=1&s=612x612&w=0&k=20&c=egtvr27KzpKtbe4v-BYXhuftbH7jinLOANAE8ie1Kkc=",

  // Water & Sanitation - Clean water access
  water:
    "https://images.unsplash.com/photo-1538300342682-cf57afb97285?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHRhcCUyMHdhdGVyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
  borehole:
    "https://images.unsplash.com/photo-1538300342682-cf57afb97285?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHRhcCUyMHdhdGVyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
  well: "https://images.unsplash.com/photo-1538300342682-cf57afb97285?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHRhcCUyMHdhdGVyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
  clean:
    "https://images.unsplash.com/photo-1538300342682-cf57afb97285?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHRhcCUyMHdhdGVyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
  kampala:
    "https://images.unsplash.com/photo-1538300342682-cf57afb97285?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHRhcCUyMHdhdGVyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",

  // Education - Children learning and school supplies
  school:
    "https://images.unsplash.com/photo-1725801731039-ddaaae142bc6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTAwfHxzY2hvb2wlMjBzdXBwbGllc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500",
  education:
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=95",
  library:
    "https://images.unsplash.com/photo-1725801731039-ddaaae142bc6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTAwfHxzY2hvb2wlMjBzdXBwbGllc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500",
  supplies:
    "https://images.unsplash.com/photo-1725801731039-ddaaae142bc6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTAwfHxzY2hvb2wlMjBzdXBwbGllc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500",
  children:
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=95", // Agriculture & Food
  farm: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=95",
  agriculture:
    "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&q=95",

  // Environment
  tree: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&q=95",
  environment:
    "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&q=95",
  forest:
    "https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&q=95",

  // Community & Infrastructure
  community:
    "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&q=95",
  infrastructure:
    "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1200&q=95",
  housing:
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=95",

  // Technology
  technology:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=95",
  digital:
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1200&q=95",

  // Default fallback
  default:
    "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200&q=95",
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
