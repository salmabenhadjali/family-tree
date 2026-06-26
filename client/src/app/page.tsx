'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TreeDeciduous, Users, Image as ImageIcon, Share2 } from 'lucide-react';

const features = [
  {
    icon: TreeDeciduous,
    title: 'Interactive Tree',
    desc: 'Visualize your family across generations with a beautiful, zoomable tree.',
  },
  {
    icon: Users,
    title: 'Collaborative',
    desc: 'Invite family members to contribute and enrich the history together.',
  },
  {
    icon: ImageIcon,
    title: 'Photo Gallery',
    desc: 'Attach photos to each person, stored securely via Cloudinary.',
  },
  {
    icon: Share2,
    title: 'Share & Preserve',
    desc: 'Keep your family story alive and share it with future generations.',
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="flex flex-col items-center min-h-screen">
      {/* Hero */}
      <section className="w-full flex flex-col items-center justify-center py-28 px-6 text-center bg-gradient-to-b from-amber-50 to-stone-50">
        <span className="text-6xl mb-6">🌳</span>
        <h1 className="text-5xl font-bold tracking-tight text-stone-800 max-w-2xl leading-tight">
          Your family story,<br />told together.
        </h1>
        <p className="mt-5 text-lg text-stone-500 max-w-xl">
          Build, explore, and share your family tree. Invite relatives to contribute
          their memories, photos, and stories.
        </p>
        <div className="mt-10 flex gap-4 flex-wrap justify-center">
          {user ? (
            <Link
              href="/tree"
              className={cn(buttonVariants({ size: 'lg' }), 'rounded-full px-8 bg-amber-700 hover:bg-amber-800 text-white')}
            >
              Open Family Tree
            </Link>
          ) : (
            <>
              <Link
                href="/auth/register"
                className={cn(buttonVariants({ size: 'lg' }), 'rounded-full px-8 bg-amber-700 hover:bg-amber-800 text-white')}
              >
                Get Started
              </Link>
              <Link
                href="/auth/login"
                className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'rounded-full px-8 border-stone-300')}
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="w-full max-w-5xl px-6 py-20 grid grid-cols-1 sm:grid-cols-2 gap-8">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex gap-4 p-6 rounded-2xl bg-white border border-stone-100 shadow-sm">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Icon className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-800">{title}</h3>
              <p className="text-sm text-stone-500 mt-1">{desc}</p>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
