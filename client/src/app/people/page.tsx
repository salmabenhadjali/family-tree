'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Person } from '@/types';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Calendar } from 'lucide-react';

export default function PeoplePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [people, setPeople] = useState<Person[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) { router.push('/auth/login'); return; }
    try {
      const data = query
        ? await api.people.search(query) as Person[]
        : await api.people.getAll() as Person[];
      setPeople(data);
    } catch {
      toast.error('Failed to load people');
    } finally {
      setLoading(false);
    }
  }, [user, router, query]);

  useEffect(() => {
    const t = setTimeout(load, query ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, query]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-stone-800">Family Members</h1>
          <Button
            className="bg-amber-700 hover:bg-amber-800 rounded-full"
            onClick={() => router.push('/people/new')}
          >
            <Plus className="h-4 w-4 mr-1.5" /> Add person
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            className="pl-9"
            placeholder="Search by name…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-stone-100 animate-pulse" />
            ))}
          </div>
        ) : people.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <p className="text-lg">{query ? 'No results found.' : 'No family members yet.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {people.map((person) => (
              <Link
                key={person._id}
                href={`/people/${person._id}`}
                className="flex items-center gap-3 p-4 rounded-xl bg-white border border-stone-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all"
              >
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarImage src={person.photo} />
                  <AvatarFallback className="bg-amber-100 text-amber-800 font-semibold">
                    {person.firstName[0]}{person.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-semibold text-stone-800 truncate">
                    {person.firstName} {person.lastName}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="secondary" className="text-xs capitalize px-1.5 py-0">
                      {person.gender}
                    </Badge>
                    {person.birthDate && (
                      <span className="text-xs text-stone-400 flex items-center gap-0.5">
                        <Calendar className="h-3 w-3" />
                        {new Date(person.birthDate).getFullYear()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
