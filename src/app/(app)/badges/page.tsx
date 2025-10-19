'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const badges = [
    {
        name: 'First Step',
        description: 'For making your first donation.',
        imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHGw2BIvSx41HOA-q6257_Azda7DU1oTsA_0B0wjtt5sKECNopKXOzWCo_BYTk_phLG78rbprtwd-bP05Ql7I7zDwysn-HVLiba3oXVOX6c73DfAul5Z7ZjSULSWqwM0YTQys8GWMA1izkEg0lBYGhPyGSg5f_xxC0RBKgI9zLWLshGf9YDwNGem0LNF89VSE837XE0gwIYXXHkKcFGFVnYrmKSRqI9CqBSU5OBSmbSon-xTbj15XcS40QrsfNPYGbY8plpR_Z3P6H',
        alt: 'Golden star badge with intricate patterns.'
    },
    {
        name: 'Community Builder',
        description: 'Contributed to a project in all regions of Uganda.',
        imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwFzE4jVvbANa5Nw1L_qJY0s1Ut50QMM5je92NAXIrFbbADTsWIBScO6W0I6L1ze-PQOqJIsPBvUzsB0vg1sJdCeL1A9WdU9MDYG1a11Q07Y-MhoLsXe7646YTBi_MP89wJw3oAL5TTfenthz_2zjpPvLwVRdo1etUzTmcUi9CC6wZWjouTTZFqvXc0T1bGB_QT6nMJqF7Fke62jm2HFsRiLz2t8c313AwB7LC0GTyNNynsz7pX9exc96dQtYmc4e56uECOHa-JgG4',
        alt: 'Badge showing a map of Uganda with pins.'
    },
    {
        name: 'Education Champion',
        description: 'Funded 3 education-focused projects.',
        imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8CWrL9J68D4ept6PFontXnK-NaJWUsqoVQAFEalXikv2dQ_UaFbEs3IM1EIiFJcgzxeTbrA8b57DhTWpRL8E4TOqwGZLrYEnL0gvBlVSFzHCxZhCE7Vhfl9mWTJoYa9SsmMr1lzdifBjadF3f6LtoKZnwx18FEv9_Xfiub9d-ujm104VI8nO6vioJWxqTEDQTR1BLQ4EsAKw1b7EhdvoxnEcvqyMxK01z4HFzz-igA1fHiMEi7RkOcc5IcnrBM-qnH_hX9MCd9lbC',
        alt: 'Badge with an open book and a graduation cap.'
    },
    {
        name: 'Water Warrior',
        description: 'Supported a clean water initiative.',
        imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABV8RRyiFwpiHndH7_ErCqchGIKkAeG-Mx7FMwAirxAITNMe3NdwKKYI0PdcJ4CyW-vZeS21waq6Pg8HnKh-b3svka9GOsE3HHc20EMet0tDL0eX-H99SzKW6FpwncW6wTj7iywk6A2EiCXzYTIFHLhN4h4GJy09hKAZnU8ApYoRNpa-YEyJbX3wLGjrOIPqOpCuZJHucdudmUHKCg2SLX02lDWZN5uOEK8FmP9ftgevsqs602hGnfqqUFMfU3Q00Pqz6D7oouXea2',
        alt: 'Badge with a water droplet and helping hands.'
    },
    {
        name: 'Health Hero',
        description: 'Donated to 5 health projects.',
        imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHrdp6WXKaZ2_MkIQMRRUuaBm5vrjHeiit4wC4Pv8ogM4hdCJ-SV724PDbo-fPkG6UfIJyxP-7Wvai7AQ3yPM3iADWjOltbRDZSlj-pNMjoSQTwvDPPSdKfdA4kyqbMVoPVMmmRzLQvWutxikrD88Fx4VXXtqZX5pID8sugh_G8INqXgXUihx-GkypbxqX3ux39rlcTm6c4NsYS_L2sviDvECif1LU6bFo415ISI8xeFP5LbaM8JkNTwdIsrsG8PW41USrVKEoQ7mF',
        alt: 'Badge with a heart and a plus sign for health.'
    },
    {
        name: 'Green Guardian',
        description: 'Funded an environmental project.',
        imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDs5ynAt10MUjKUXhrE6cXVzirrUS_8-6EUNLXziLVsLWCODCUXW7xhKa68F2QngJj0vc5WODaah6cq6IDLDNDkcYz-Hhr31E6eAGEmVzpZrKTUqDp_DJwYaXw_DFgdemooq70tFZbnYPxHlb9vbfoOT_YZpbs3p0sBNKby6ufO5TZKWkOa_6ttCXtrb2hSwyMHle2C7QA_Vlw-gbYGhJsUhVmZRn_BYFp_t_F-B05Fy8OaVqeJROKscPe2itxXtwtzXQ4YY2JKoWuC',
        alt: 'Badge with a stylized tree representing growth.'
    }
];

export default function BadgesPage() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
                <div className="flex items-center justify-between p-4 pb-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/settings">
                            <span className="material-symbols-outlined text-2xl">arrow_back</span>
                        </Link>
                    </Button>
                    <h1 className="flex-1 text-center text-xl font-bold">My NFT Badges</h1>
                    <div className="w-12 shrink-0"></div>
                </div>
            </header>
            <main className="flex-1 flex-col">
                <div className="flex flex-col gap-2 p-4 pt-2">
                    <p className="text-base font-medium">You've collected 7 out of 20 badges!</p>
                    <div className="h-2.5 rounded-full bg-primary/20">
                        <div className="h-2.5 rounded-full bg-primary" style={{ width: '35%' }}></div>
                    </div>
                </div>

                <div className="flex gap-3 overflow-x-auto p-4">
                    <Button variant="secondary" className="rounded-full bg-primary/20">
                        Most Recent <span className="material-symbols-outlined text-xl">expand_more</span>
                    </Button>
                    <Button variant="secondary" className="rounded-full bg-muted">
                        Rarest <span className="material-symbols-outlined text-xl">expand_more</span>
                    </Button>
                    <Button variant="secondary" className="rounded-full bg-muted">
                        Category <span className="material-symbols-outlined text-xl">expand_more</span>
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4">
                    {badges.map((badge, index) => (
                        <div key={index} className="flex flex-col items-center rounded-lg bg-card p-4 shadow-md transition-transform hover:scale-105">
                            <Image className="mb-3 h-24 w-24 rounded-full" src={badge.imgSrc} alt={badge.alt} width={96} height={96} />
                            <h3 className="text-center text-base font-bold leading-tight">{badge.name}</h3>
                            <p className="mt-1 text-center text-xs text-gray-500">{badge.description}</p>
                            <Button variant="ghost" size="icon" className="mt-4 text-secondary">
                                <span className="material-symbols-outlined">share</span>
                            </Button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
