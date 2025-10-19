"use client";

import { useState } from 'react';
import { useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { voteProjects, projectCategories } from "@/lib/data";
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function ProjectsPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const { toast } = useToast();
    const { sendTransaction, isPending } = useSendTransaction({
        onSuccess: (hash) => {
            toast({
                title: "Vote Cast Successfully!",
                description: `Your vote transaction has been submitted: ${hash}`,
            });
        },
        onError: (error) => {
            toast({
                variant: 'destructive',
                title: "Vote Failed",
                description: error.message,
            });
        }
    });
    const [votingProjectId, setVotingProjectId] = useState<number | null>(null);

    const handleVote = (projectId: number) => {
        setVotingProjectId(projectId);
        // This is a simulated transaction.
        // In a real app, you would interact with a smart contract.
        sendTransaction({
            to: '0x000000000000000000000000000000000000dEaD', // Burn address as placeholder
            value: parseEther('0.0001'), // nominal value for the vote transaction
        });
    };

    const filteredProjects = voteProjects.filter(project => {
        return activeCategory === 'All' || project.category === activeCategory;
    });

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <header className="sticky top-0 z-10 flex items-center justify-between bg-background p-4 pb-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                </Button>
                <h1 className="flex-1 text-center text-lg font-bold">Vote for Projects</h1>
                <Button variant="ghost" size="icon">
                    <span className="material-symbols-outlined">search</span>
                </Button>
            </header>

            <div className="flex gap-3 overflow-x-auto whitespace-nowrap px-4 py-2">
                {projectCategories.map((category) => (
                    <Button
                        key={category}
                        variant={activeCategory === category ? 'default' : 'secondary'}
                        size="sm"
                        className="rounded-full bg-primary/20 text-foreground"
                        onClick={() => setActiveCategory(category)}
                    >
                        {category}
                    </Button>
                ))}
            </div>

            <main className="flex-1 space-y-4 overflow-y-auto p-4">
                {filteredProjects.map((project) => (
                    <Card key={project.id} className="overflow-hidden bg-card shadow-sm">
                        {project.image && (
                            <div className="aspect-video w-full bg-cover bg-center" style={{ backgroundImage: `url(${project.image.imageUrl})` }} data-alt={project.image.description}></div>
                        )}
                        <CardContent className="space-y-3 p-4">
                            <p className="text-lg font-bold">{project.title}</p>
                            <p className="text-sm text-muted-foreground">{project.description}</p>
                            <Progress value={(project.currentFunding / project.fundingGoal) * 100} className="h-2 rounded bg-primary/20" />
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    {new Intl.NumberFormat('en-US').format(project.currentFunding)} / {new Intl.NumberFormat('en-US').format(project.fundingGoal)} UGX
                                </p>
                                <Button
                                    size="sm"
                                    className="rounded-full px-6 font-bold"
                                    onClick={() => handleVote(project.id)}
                                    disabled={isPending && votingProjectId === project.id}
                                >
                                    {isPending && votingProjectId === project.id ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        'Vote'
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </main>
        </div>
    );
}
