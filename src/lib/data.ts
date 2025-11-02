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
