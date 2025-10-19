'use server';

/**
 * @fileOverview Flow to generate NFT badges for donors.
 *
 * - generateDonorNFT - A function that generates an NFT image based on the donor's contribution.
 * - GenerateDonorNFTInput - The input type for the generateDonorNFT function.
 * - GenerateDonorNFTOutput - The return type for the generateDonorNFT function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDonorNFTInputSchema = z.object({
  donationAmount: z.number().describe('The amount donated by the user.'),
  projectName: z.string().describe('The name of the project the user donated to.'),
  donorName: z.string().describe('The name of the donor.'),
});
export type GenerateDonorNFTInput = z.infer<typeof GenerateDonorNFTInputSchema>;

const GenerateDonorNFTOutputSchema = z.object({
  nftDataUri: z.string().describe('The data URI of the generated NFT image.'),
});
export type GenerateDonorNFTOutput = z.infer<typeof GenerateDonorNFTOutputSchema>;

export async function generateDonorNFT(input: GenerateDonorNFTInput): Promise<GenerateDonorNFTOutput> {
  return generateDonorNFTFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDonorNFTPrompt',
  input: {schema: GenerateDonorNFTInputSchema},
  output: {schema: GenerateDonorNFTOutputSchema},
  prompt: `You are an NFT generator for PaySmile, which provides micro-loans to Ugandans.

  Generate an NFT image that recognizes the donor's contribution to the project. The NFT should be visually appealing and represent the positive impact of their donation.  The NFT should have the color #20df6c as the main accent color.

  Donor Name: {{{donorName}}}
  Donation Amount: {{{donationAmount}}} UGX
  Project Name: {{{projectName}}}

  The return should be a single image with a data URI.
  
  Example of data URI: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w+v///9iYGAQYg5KSEv1///fwQQYAAC9E8Q9AAAAAElFTkSuQmCC`,
});

const generateDonorNFTFlow = ai.defineFlow(
  {
    name: 'generateDonorNFTFlow',
    inputSchema: GenerateDonorNFTInputSchema,
    outputSchema: GenerateDonorNFTOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      prompt: `Generate an image that recognizes the donor's contribution of ${input.donationAmount} UGX to the ${input.projectName} project for donor ${input.donorName}. Make sure the color is #20df6c.`, 
      model: 'googleai/imagen-4.0-fast-generate-001',
    });

    return {
      nftDataUri: media.url,
    };
  }
);
