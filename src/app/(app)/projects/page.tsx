"use client";

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { voteProjects, projectCategories } from "@/lib/data";

export default function ProjectsPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProjects = voteProjects.filter(project => {
        const categoryMatch = activeCategory === 'All' || project.category === activeCategory;
        const searchMatch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || project.description.toLowerCase().includes(searchQuery.toLowerCase());
        return categoryMatch && searchMatch;
    });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background p-4 pb-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="flex-1 text-center text-lg font-bold">Vote for Projects</h1>
        <Button variant="ghost" size="icon">
          <Search />
        </Button>
      </header>
      
      <div className="px-4">
        <Input 
            placeholder="Search for projects..." 
            className="my-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex gap-3 overflow-x-auto whitespace-nowrap px-4 py-2">
        {projectCategories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? 'default' : 'secondary'}
            size="sm"
            className="rounded-full"
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <main className="flex-1 space-y-4 overflow-y-auto p-4">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            {project.image && (
              <Image
                src={project.image.imageUrl}
                alt={project.image.description}
                width={1200}
                height={675}
                className="aspect-video w-full object-cover"
                data-ai-hint={project.image.imageHint}
              />
            )}
            <CardContent className="space-y-3 p-4">
              <p className="text-lg font-bold">{project.title}</p>
              <p className="text-sm text-muted-foreground">{project.description}</p>
              <Progress value={(project.currentFunding / project.fundingGoal) * 100} className="h-2" />
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {new Intl.NumberFormat('en-US').format(project.currentFunding)} / {new Intl.NumberFormat('en-US').format(project.fundingGoal)} UGX
                </p>
                <Button size="sm" className="rounded-full px-6 font-bold">
                  Vote
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
}
