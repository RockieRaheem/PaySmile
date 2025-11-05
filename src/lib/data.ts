import type { ImagePlaceholder } from "./placeholder-images";
import { PlaceHolderImages } from "./placeholder-images";

const getImage = (id: string): ImagePlaceholder | undefined =>
  PlaceHolderImages.find((img) => img.id === id);

export const userStats = {
  totalDonations: 150000,
  projectsSupported: 12,
  livesImpacted: 48,
  roundupsMade: 1234,
};

export const activeProjects = [
  {
    id: 1,
    title: "Emergency Food Relief - Bugesera",
    fundingGoal: 50000,
    currentFunding: 12800,
    image: getImage("active-project-1"),
    description:
      "3,500 families facing severe food shortage due to prolonged drought in Bugesera District. Providing emergency food supplies to combat hunger.",
    location: "Bugesera District, Rwanda",
    beneficiaries: "3,500 families",
    category: "Emergency Relief",
  },
  {
    id: 2,
    title: "Flood Victims Shelter - Rubavu",
    fundingGoal: 85000,
    currentFunding: 23400,
    image: getImage("active-project-2"),
    description:
      "850 families displaced by Lake Kivu floods. Urgent need for temporary shelters, blankets and clean water for affected communities.",
    location: "Rubavu District (Lake Kivu Basin)",
    beneficiaries: "850 families",
    category: "Disaster Relief",
  },
  {
    id: 3,
    title: "Malaria Treatment - Nyagatare",
    fundingGoal: 35000,
    currentFunding: 8900,
    image: getImage("active-project-3"),
    description:
      "Severe malaria outbreak affecting 2,100+ children under 5 in Eastern Province. Providing mosquito nets and antimalarial drugs urgently.",
    location: "Nyagatare District (Eastern Province)",
    beneficiaries: "2,100+ children",
    category: "Healthcare",
  },
  {
    id: 4,
    title: "Maternal Health Crisis - Gicumbi",
    fundingGoal: 45000,
    currentFunding: 11500,
    image: getImage("active-project-4"),
    description:
      "Rural health center lacks delivery equipment. 600+ pregnant women at risk. Need ambulance and medical supplies for safe deliveries.",
    location: "Gicumbi District (Northern Province)",
    beneficiaries: "600+ pregnant women",
    category: "Healthcare",
  },
];

export const fundedProjects = [
  {
    id: 3,
    title: "Reforestation Project",
    image: getImage("funded-project-1"),
  },
  {
    id: 4,
    title: "Community Kitchen",
    image: getImage("funded-project-2"),
  },
];

export const voteProjects = [
  {
    id: 5,
    title: "Clean Water for All",
    description:
      "This project aims to provide clean and safe drinking water to rural communities in Uganda.",
    fundingGoal: 10000000,
    currentFunding: 5000000,
    image: getImage("vote-project-1"),
    category: "Healthcare",
  },
  {
    id: 6,
    title: "Literacy Program for Children",
    description:
      "This project will establish a mobile library to provide books and educational resources to children in underserved areas.",
    fundingGoal: 7500000,
    currentFunding: 2500000,
    image: getImage("vote-project-2"),
    category: "Education",
  },
  {
    id: 7,
    title: "Solar Power for Rural Schools",
    description:
      "Providing clean, renewable energy to power schools and enable evening studies for students.",
    fundingGoal: 12000000,
    currentFunding: 9000000,
    image: getImage("vote-project-3"),
    category: "Community",
  },
];

export const projectCategories = [
  "All",
  "Education",
  "Healthcare",
  "Environment",
  "Community",
];

export const donationHistory = [
  {
    id: 1,
    projectName: "Clean Water Initiative",
    amount: 500,
    date: "2024-07-20",
  },
  {
    id: 2,
    projectName: "School Supply Drive",
    amount: 250,
    date: "2024-07-19",
  },
  {
    id: 3,
    projectName: "Reforestation Project",
    amount: 1000,
    date: "2024-07-18",
  },
  {
    id: 4,
    projectName: "Community Kitchen",
    amount: 750,
    date: "2024-07-17",
  },
  {
    id: 5,
    projectName: "Clean Water Initiative",
    amount: 500,
    date: "2024-07-16",
  },
];

// Detailed project information mapped by project NAME (not ID)
// This ensures correct details show regardless of blockchain project order
export const projectDetailsByName: Record<
  string,
  {
    fullDescription: string;
    situation: string;
    urgency: string;
    impact: string;
  }
> = {
  // Emergency Food Relief - Bugesera
  "Emergency Food Relief - Bugesera": {
    fullDescription:
      "Severe drought conditions in Bugesera District have led to widespread crop failure, leaving 3,500 families without adequate food supplies. The district, located in the Eastern Province of Rwanda, is one of the hottest and driest regions in the country. The prolonged dry season has devastated local agriculture, causing food insecurity and malnutrition among vulnerable populations.",
    situation:
      "The affected families are primarily subsistence farmers who depend entirely on seasonal rains for their crops. With two consecutive failed harvests, food stocks have been depleted, and families are struggling to meet basic nutritional needs. Children and elderly residents are particularly vulnerable to malnutrition.",
    urgency:
      "Immediate food relief is critical to prevent a humanitarian crisis. Without intervention within the next 30 days, malnutrition rates could spike dramatically, especially among children under 5 years old.",
    impact:
      "Emergency food packages will provide rice, beans, cooking oil, and fortified nutritional supplements for 3,500 families (approximately 17,500 individuals) for 2 months, giving them stability while longer-term agricultural recovery programs are established.",
  },
  // Flood Victims Shelter - Rubavu
  "Flood Victims Shelter - Rubavu": {
    fullDescription:
      "Unprecedented flooding along Lake Kivu has displaced 850 families in Rubavu District, Western Province. Heavy seasonal rains caused the lake's water levels to rise dramatically, submerging homes, destroying crops, and contaminating water sources. Families have lost their homes, belongings, and livelihoods, with many now living in temporary evacuation centers or with relatives in overcrowded conditions.",
    situation:
      "The flood victims are currently sheltering in three evacuation centers with inadequate facilities. Many families are sleeping on bare floors without mattresses or blankets. The flooding has also destroyed latrines and contaminated wells, creating urgent needs for clean water and sanitation facilities to prevent waterborne diseases like cholera.",
    urgency:
      "With the rainy season continuing, conditions in evacuation centers are deteriorating rapidly. Without proper shelter materials and clean water within 2 weeks, there is a high risk of disease outbreak that could affect thousands of people.",
    impact:
      "Funds will provide emergency shelter kits (tarpaulins, poles, rope), warm blankets, sleeping mats, water purification tablets, and hygiene supplies for all 850 families. This will protect approximately 4,250 individuals from the elements and prevent disease outbreaks while permanent resettlement solutions are developed.",
  },
  // Malaria Treatment - Nyagatare
  "Malaria Treatment - Nyagatare": {
    fullDescription:
      "A severe malaria outbreak has affected the Nyagatare District in Rwanda's Eastern Province, with over 2,100 children under 5 years old showing symptoms. The outbreak is linked to recent flooding that created breeding grounds for mosquitoes, combined with a shortage of mosquito nets and antimalarial medications at local health facilities.",
    situation:
      "The district's health centers are overwhelmed with malaria cases, and medication stocks have run critically low. Many families cannot afford to purchase mosquito nets, leaving young children exposed to infected mosquitoes every night. Without treatment, malaria can quickly become life-threatening in young children.",
    urgency:
      "Malaria deaths among children can occur within 48 hours of severe symptoms developing. Immediate access to treatment and preventive measures is essential to save lives and prevent the outbreak from spreading further.",
    impact:
      "The project will distribute 2,500 insecticide-treated mosquito nets to vulnerable families and provide rapid diagnostic tests and artemisinin-based combination therapies (ACTs) to health centers. This will protect children from infection and ensure that all diagnosed cases receive immediate, effective treatment.",
  },
  // Maternal Health Crisis - Gicumbi
  "Maternal Health Crisis - Gicumbi": {
    fullDescription:
      "The Gicumbi District Health Center in Northern Province serves a rural population of over 15,000 people, with approximately 600 pregnant women registered for maternal care services. However, the facility lacks essential delivery equipment, has no ambulance for emergency transfers, and is critically short of medical supplies needed for safe childbirth.",
    situation:
      "Pregnant women in the catchment area must travel long distances on foot or motorcycle to reach the health center. When complications arise during delivery, there is no ambulance to transfer mothers to the district hospital, resulting in preventable maternal and newborn deaths. The facility also lacks basic equipment like fetal monitors, delivery beds, and sterile delivery kits.",
    urgency:
      "Every month, 3-4 pregnant women experience life-threatening complications during delivery. Without emergency transport and proper equipment, maternal and newborn mortality rates will continue to rise.",
    impact:
      "Funding will purchase a fully-equipped ambulance, install a solar power backup system for the delivery ward, provide 6 modern delivery beds with obstetric equipment, and stock 12 months of essential medicines and supplies. This will enable 600+ women to deliver safely and save countless mothers and babies from preventable deaths.",
  },
  // School Supplies Drive
  "School Supplies Drive": {
    fullDescription:
      "Underfunded primary and secondary schools across multiple districts lack basic learning materials. Students share single textbooks among groups of 5-8 learners, have no exercise books for practice, and teachers struggle to conduct lessons without adequate teaching aids. This severely impacts educational quality and student performance.",
    situation:
      "Many schools in rural areas cannot afford to purchase sufficient textbooks, exercise books, pencils, pens, and teaching materials. Students often write on scraps of paper or the ground, making learning extremely difficult. Teachers lack charts, science equipment, and reference materials needed for effective instruction.",
    urgency:
      "The academic year is underway, and students are already falling behind without proper learning materials. Immediate provision of school supplies is essential to salvage this school year and prevent a generation of students from receiving substandard education.",
    impact:
      "The program will supply 25 schools with comprehensive learning kits including textbooks for core subjects, exercise books, writing materials, mathematical instruments, science equipment, teaching charts, and reference books. This will directly benefit 8,500 students and 180 teachers, dramatically improving learning outcomes.",
  },
  // Clean Water for Rural Communities
  "Clean Water for Rural Communities": {
    fullDescription:
      "Remote rural communities across multiple regions lack access to safe drinking water, forcing residents to use contaminated surface water from rivers and ponds. This causes frequent outbreaks of waterborne diseases like cholera, typhoid, and dysentery, particularly affecting children and elderly residents.",
    situation:
      "Families must walk 2-3 hours daily to fetch water from unprotected sources shared with livestock. During the dry season, even these sources dry up, creating severe water shortages. Women and girls bear the burden of water collection, preventing girls from attending school regularly.",
    urgency:
      "The current dry season is intensifying water scarcity, and another cholera outbreak could be catastrophic. Clean water infrastructure must be established before the next rainy season when contamination risks peak.",
    impact:
      "The project will drill and install 8 deep boreholes with hand pumps, construct 3 protected spring sources, and establish 5 rainwater harvesting systems at schools and health centers. This will provide clean water access for 12,000 people, dramatically reduce waterborne disease rates, and free up time for children (especially girls) to attend school regularly.",
  },
  // Literacy Program for Children (Mobile Library)
  "Literacy Program for Children": {
    fullDescription:
      "Children in rural communities across the region lack access to quality reading materials and educational resources. The mobile library initiative aims to bring books, learning tools, and educational opportunities directly to underserved villages where schools have minimal or no library facilities.",
    situation:
      "Many rural schools operate with less than 20 books total, forcing students to share outdated textbooks and limiting their ability to develop strong literacy skills. Children who could excel academically are falling behind simply due to lack of access to reading materials that urban students take for granted.",
    urgency:
      "Early childhood literacy is critical for lifelong educational success. Without intervention during primary school years, the achievement gap between rural and urban students will widen, perpetuating cycles of poverty.",
    impact:
      "The mobile library will serve 15 rural schools, providing over 5,000 age-appropriate books, educational games, and digital learning tablets. Trained librarians will visit each school weekly, conducting reading programs and supporting teachers with resource materials. This will benefit approximately 3,000 children annually.",
  },
};

// Legacy ID-based mapping (kept for backward compatibility)
// Detailed project information mapped by project ID
// These details match the blockchain project IDs
export const projectDetails: Record<
  number,
  {
    fullDescription: string;
    situation: string;
    urgency: string;
    impact: string;
  }
> = {
  // Project ID 0 - Food Relief
  0: projectDetailsByName["Emergency Food Relief - Bugesera"],
  // Project ID 1 - Flood Relief (Lake Kivu)
  1: projectDetailsByName["Flood Victims Shelter - Rubavu"],
  // Project ID 2 - Malaria Treatment
  2: projectDetailsByName["Malaria Treatment - Nyagatare"],
  // Project ID 3 - Maternal Health
  3: projectDetailsByName["Maternal Health Crisis - Gicumbi"],
  // Project ID 6 - Literacy Program / Mobile Library
  6: projectDetailsByName["Literacy Program for Children"],
};

// Project name to detail ID mapping helper
export function getProjectDetailsByName(projectName: string) {
  return projectDetailsByName[projectName] || null;
}
