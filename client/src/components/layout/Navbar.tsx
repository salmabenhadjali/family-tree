'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { buttonVariants } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { TreeDeciduous, LogOut, Users, LayoutGrid } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();

  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 bg-white/80 backdrop-blur-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-stone-800">
          <TreeDeciduous className="h-5 w-5 text-amber-700" />
          <span>Family Tree</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            <Link href="/tree" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
              <LayoutGrid className="h-4 w-4 mr-1.5" />
              Tree
            </Link>
            <Link href="/people" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
              <Users className="h-4 w-4 mr-1.5" />
              People
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full ring-2 ring-amber-200 hover:ring-amber-400 transition-all outline-none cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-amber-100 text-amber-800 text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm">
                  <p className="font-medium text-stone-900">{user.name}</p>
                  <p className="text-stone-400 text-xs capitalize">{user.role}</p>
                </div>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem onClick={() => router.push('/admin/invite')}>
                    Invite family member
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => { logout(); router.push('/'); }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
              Sign in
            </Link>
            <Link href="/auth/register" className={cn(buttonVariants({ size: 'sm' }), 'bg-amber-700 hover:bg-amber-800 rounded-full text-white')}>
              Get started
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
