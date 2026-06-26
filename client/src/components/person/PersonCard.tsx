'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Person } from '@/types';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { X, Edit, Trash2, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Props {
  person: Person;
  onClose: () => void;
  onUpdated: () => void;
}

function fmt(dateStr?: string) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function PersonCard({ person, onClose, onUpdated }: Props) {
  const { isAdmin, isEditor } = useAuth();
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Delete ${person.firstName} ${person.lastName}? This cannot be undone.`)) return;
    try {
      await api.people.delete(person._id);
      toast.success('Person deleted');
      onClose();
      onUpdated();
    } catch {
      toast.error('Failed to delete');
    }
  }

  const initials = `${person.firstName[0]}${person.lastName[0]}`.toUpperCase();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={person.photo} alt={person.firstName} />
            <AvatarFallback className="bg-amber-100 text-amber-800 font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-stone-800">
              {person.firstName} {person.lastName}
            </h2>
            {person.maidenName && (
              <p className="text-xs text-stone-400">née {person.maidenName}</p>
            )}
            <Badge variant="secondary" className="mt-0.5 text-xs capitalize">
              {person.gender}
            </Badge>
          </div>
        </div>
        <button onClick={onClose} className="text-stone-400 hover:text-stone-600 mt-0.5">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Photo */}
      {person.photo && (
        <div className="relative w-full aspect-square bg-stone-100">
          <Image src={person.photo} alt={person.firstName} fill className="object-cover" />
        </div>
      )}

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Dates */}
        <div className="space-y-2 text-sm">
          {person.birthDate && (
            <div className="flex items-start gap-2 text-stone-600">
              <Calendar className="h-4 w-4 mt-0.5 text-stone-400 flex-shrink-0" />
              <span>
                Born {fmt(person.birthDate)}
                {person.birthPlace && ` in ${person.birthPlace}`}
              </span>
            </div>
          )}
          {!person.isAlive && person.deathDate && (
            <div className="flex items-start gap-2 text-stone-500">
              <Calendar className="h-4 w-4 mt-0.5 text-stone-400 flex-shrink-0" />
              <span>
                Died {fmt(person.deathDate)}
                {person.deathPlace && ` in ${person.deathPlace}`}
              </span>
            </div>
          )}
        </div>

        {/* Bio */}
        {person.bio && (
          <p className="text-sm text-stone-600 leading-relaxed">{person.bio}</p>
        )}

        {/* Relationships */}
        {person.parents.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1.5">Parents</p>
            <div className="flex flex-wrap gap-1.5">
              {person.parents.map((p) => (
                <Badge key={p._id} variant="outline" className="text-xs">
                  {p.firstName} {p.lastName}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {person.spouses.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1.5">
              {person.spouses.length === 1 ? 'Spouse' : 'Spouses'}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {person.spouses.map((p) => (
                <Badge key={p._id} variant="outline" className="text-xs">
                  {p.firstName} {p.lastName}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {person.children.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1.5">Children</p>
            <div className="flex flex-wrap gap-1.5">
              {person.children.map((p) => (
                <Badge key={p._id} variant="outline" className="text-xs">
                  {p.firstName} {p.lastName}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {(isEditor || isAdmin) && (
        <div className="p-4 border-t border-stone-100 flex gap-2">
          <Link
            href={`/people/${person._id}/edit`}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'flex-1 justify-center')}
          >
            <Edit className="h-4 w-4 mr-1.5" /> Edit
          </Link>
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
