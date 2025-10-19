
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Award, Loader2, User, Mail, LogOut, Bell } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateDonorNFT } from '@/ai/flows/generate-donor-nft';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const profileSchema = z.object({
  userName: z.string().min(2, 'Username must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.').or(z.literal('')),
});

const settingsSchema = z.object({
  notificationsEnabled: z.boolean(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const [nftImage, setNftImage] = useState<string | null>(null);
  const [isGeneratingNFT, setIsGeneratingNFT] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      userName: 'Anonymous User',
      email: '',
    },
  });

  const settingsForm = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      notificationsEnabled: false,
    },
  });

  const handleClaimBadge = async () => {
    setIsGeneratingNFT(true);
    setNftImage(null);
    try {
      const result = await generateDonorNFT({
        donationAmount: 500,
        projectName: 'Test Project',
        donorName: profileForm.getValues('userName') || 'Valued Donor',
      });
      if (result.nftDataUri) {
        setNftImage(result.nftDataUri);
        toast({
          title: 'Badge Claimed!',
          description: 'Your test NFT badge has been generated.',
        });
      }
    } catch (error) {
      console.error('Error generating NFT:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Could not generate the test badge.',
      });
    } finally {
      setIsGeneratingNFT(false);
    }
  };

  const onProfileSubmit = (values: ProfileFormValues) => {
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been saved.',
    });
  };

  const onSettingsSubmit = (values: SettingsFormValues) => {
    toast({
      title: 'Settings Updated',
      description: 'Your notification settings have been saved.',
    });
  };

  const handleLogout = async () => {
    router.push('/');
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background p-4 pb-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="flex-1 text-center text-lg font-bold">Settings</h1>
        <div className="w-12" />
      </header>
      <main className="flex-1 space-y-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
             <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <FormField
                  control={profileForm.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input placeholder="Your username" {...field} className="pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input placeholder="Your email" {...field} className="pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={profileForm.formState.isSubmitting} className="w-full">
                  {profileForm.formState.isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Save Changes
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...settingsForm}>
              <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)}>
                <FormField
                  control={settingsForm.control}
                  name="notificationsEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Push Notifications</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            onSettingsSubmit({ notificationsEnabled: checked });
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="text-primary" />
              My Smile Badges (NFTs)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isGeneratingNFT && (
              <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p>Generating your badge...</p>
              </div>
            )}
            {nftImage && (
              <div className="flex flex-col items-center">
                <Image
                  src={nftImage}
                  alt="Generated NFT Badge"
                  width={256}
                  height={256}
                  className="mb-4 rounded-lg border"
                />
                <p className="mb-4 text-center text-sm text-muted-foreground">
                  Here is your newly minted Smile Badge! In a real app, this would be saved to your account.
                </p>
              </div>
            )}
            <Button onClick={handleClaimBadge} disabled={isGeneratingNFT} className="w-full">
              {isGeneratingNFT
                ? 'Claiming...'
                : nftImage
                ? 'Claim Another Test Badge'
                : 'Claim a Test Badge'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <Button onClick={handleLogout} variant="destructive" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
