'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Person } from '@/types';
import { useAuth } from '@/lib/auth-context';
import Navbar from '@/components/layout/Navbar';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Edit, Trash2, ArrowLeft, Calendar } from 'lucide-react';

function fmt(d?: string) {
  if (!d) return null;
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAdmin, isEditor } = useAuth();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.people.getOne(id)
      .then((p) => setPerson(p as Person))
      .catch(() => toast.error('Person not found'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!confirm('Delete this person? This cannot be undone.')) return;
    await api.people.delete(id);
    toast.success('Deleted');
    router.push('/people');
  }

  if (loading) return <div className="min-h-screen flex flex-col"><Navbar /><div className="flex-1 flex items-center justify-center text-stone-400">Loading…</div></div>;
  if (!person) return <div className="min-h-screen flex flex-col"><Navbar /><div className="flex-1 flex items-center justify-center text-stone-400">Not found</div></div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <Link href="/people" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mb-4 -ml-2 text-stone-500')}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Link>

        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          {person.photo && (
            <div className="relative w-full h-64 bg-stone-100">
              <Image src={person.photo} alt={person.firstName} fill className="object-cover" />
            </div>
          )}

          <div className="p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-stone-800">
                  {person.firstName} {person.lastName}
                </h1>
                {person.maidenName && <p className="text-stone-400 mt-0.5">née {person.maidenName}</p>}
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary" className="capitalize">{person.gender}</Badge>
                  {!person.isAlive && <Badge variant="outline" className="text-stone-500">Deceased</Badge>}
                </div>
              </div>
              {(isEditor || isAdmin) && (
                <div className="flex gap-2">
                  <Link
                    href={`/people/${person._id}/edit`}
                    className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                  >
                    <Edit className="h-4 w-4 mr-1.5" /> Edit
                  </Link>
                  {isAdmin && (
                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={handleDelete}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-stone-600">
              {person.birthDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-stone-400" />
                  <span>Born {fmt(person.birthDate)}{person.birthPlace && `, ${person.birthPlace}`}</span>
                </div>
              )}
              {!person.isAlive && person.deathDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-stone-400" />
                  <span>Died {fmt(person.deathDate)}{person.deathPlace && `, ${person.deathPlace}`}</span>
                </div>
              )}
            </div>

            {person.bio && <p className="text-stone-600 leading-relaxed">{person.bio}</p>}

            {[
              { label: 'Parents', list: person.parents },
              { label: 'Spouses', list: person.spouses },
              { label: 'Children', list: person.children },
            ]
              .filter(({ list }) => list.length > 0)
              .map(({ label, list }) => (
                <div key={label}>
                  <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">{label}</h2>
                  <div className="flex flex-wrap gap-2">
                    {list.map((p) => (
                      <Link key={p._id} href={`/people/${p._id}`}>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-50 border border-stone-100 hover:border-amber-300 transition-colors text-sm">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={p.photo} />
                            <AvatarFallback className="text-xs bg-amber-100 text-amber-800">
                              {p.firstName[0]}{p.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-stone-700">{p.firstName} {p.lastName}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}
