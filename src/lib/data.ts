import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string): ImagePlaceholder | undefined => PlaceHolderImages.find(img => img.id === id);

export const userStats = {
  totalDonations: 150000,
  projectsSupported: 12,
  livesImpacted: 48,
  roundupsMade: 1234,
};

export const activeProjects = [
  {
    id: 1,
    title: 'Clean Water Initiative',
    fundingGoal: 5000000,
    currentFunding: 3750000,
    image: getImage('active-project-1'),
    description: "This project aims to provide clean and safe drinking water to rural communities in Uganda.",
  },
  {
    id: 2,
    title: 'School Supply Drive',
    fundingGoal: 2500000,
    currentFunding: 1000000,
    image: getImage('active-project-2'),
    description: "This project will establish a mobile library to provide books and educational resources to children in underserved areas.",
  },
];

export const fundedProjects = [
  {
    id: 3,
    title: 'Reforestation Project',
    image: getImage('funded-project-1'),
  },
  {
    id: 4,
    title: 'Community Kitchen',
    image: getImage('funded-project-2'),
  },
];

export const voteProjects = [
    {
        id: 5,
        title: 'Clean Water for All',
        description: 'This project aims to provide clean and safe drinking water to rural communities in Uganda.',
        fundingGoal: 10000000,
        currentFunding: 5000000,
        image: getImage('vote-project-1'),
        category: 'Healthcare',
    },
    {
        id: 6,
        title: 'Literacy Program for Children',
        description: 'This project will establish a mobile library to provide books and educational resources to children in underserved areas.',
        fundingGoal: 7500000,
        currentFunding: 2500000,
        image: getImage('vote-project-2'),
        category: 'Education',
    },
    {
        id: 7,
        title: 'Solar Power for Rural Schools',
        description: 'Providing clean, renewable energy to power schools and enable evening studies for students.',
        fundingGoal: 12000000,
        currentFunding: 9000000,
        image: getImage('vote-project-3'),
        category: 'Community',
    }
];

export const projectCategories = ['All', 'Education', 'Healthcare', 'Environment', 'Community'];

export const donationHistory = [
  {
    id: 1,
    projectName: 'Clean Water Initiative',
    amount: 500,
    date: '2024-07-20',
  },
  {
    id: 2,
    projectName: 'School Supply Drive',
    amount: 250,
    date: '2024-07-19',
  },
  {
    id: 3,
    projectName: 'Reforestation Project',
    amount: 1000,
    date: '2024-07-18',
  },
  {
    id: 4,
    projectName: 'Community Kitchen',
    amount: 750,
    date: '2024-07-17',
  },
  {
    id: 5,
    projectName: 'Clean Water Initiative',
    amount: 500,
    date: '2024-07-16',
  },
];
