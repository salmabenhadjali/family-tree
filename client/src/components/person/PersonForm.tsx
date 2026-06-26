'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Person } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Camera } from 'lucide-react';

interface Props {
  person?: Person;
  onSuccess?: () => void;
}

export default function PersonForm({ person, onSuccess }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(person?.photo || null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    firstName: person?.firstName || '',
    lastName: person?.lastName || '',
    maidenName: person?.maidenName || '',
    gender: person?.gender || 'female',
    birthDate: person?.birthDate ? person.birthDate.slice(0, 10) : '',
    birthPlace: person?.birthPlace || '',
    deathDate: person?.deathDate ? person.deathDate.slice(0, 10) : '',
    deathPlace: person?.deathPlace || '',
    isAlive: person?.isAlive ?? true,
    bio: person?.bio || '',
  });

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }

  function set(key: string, val: string | boolean) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== '') fd.append(k, String(v));
      });
      const file = fileRef.current?.files?.[0];
      if (file) fd.append('photo', file);

      if (person) {
        await api.people.update(person._id, fd);
        toast.success('Updated successfully');
      } else {
        await api.people.create(fd);
        toast.success('Person added');
      }
      onSuccess?.();
      router.push('/people');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Photo upload */}
      <div className="flex items-center gap-4">
        <div
          className="relative w-20 h-20 rounded-2xl bg-amber-50 border-2 border-dashed border-amber-200 overflow-hidden cursor-pointer flex items-center justify-center hover:border-amber-400 transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          {preview ? (
            <Image src={preview} alt="preview" fill className="object-cover" />
          ) : (
            <Camera className="h-7 w-7 text-amber-400" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-stone-700">Photo</p>
          <p className="text-xs text-stone-400">JPG, PNG · max 5 MB</p>
          {preview && (
            <button
              type="button"
              className="text-xs text-red-500 hover:underline mt-0.5"
              onClick={() => { setPreview(null); if (fileRef.current) fileRef.current.value = ''; }}
            >
              Remove
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="firstName">First name *</Label>
          <Input id="firstName" required value={form.firstName} onChange={(e) => set('firstName', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName">Last name *</Label>
          <Input id="lastName" required value={form.lastName} onChange={(e) => set('lastName', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="maidenName">Maiden name</Label>
          <Input id="maidenName" value={form.maidenName} onChange={(e) => set('maidenName', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="gender">Gender *</Label>
          <select
            id="gender"
            required
            value={form.gender}
            onChange={(e) => set('gender', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="birthDate">Birth date</Label>
          <Input id="birthDate" type="date" value={form.birthDate} onChange={(e) => set('birthDate', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="birthPlace">Birth place</Label>
          <Input id="birthPlace" value={form.birthPlace} onChange={(e) => set('birthPlace', e.target.value)} placeholder="City, Country" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isAlive"
          type="checkbox"
          checked={form.isAlive}
          onChange={(e) => set('isAlive', e.target.checked)}
          className="h-4 w-4 rounded accent-amber-700"
        />
        <Label htmlFor="isAlive" className="cursor-pointer">Currently living</Label>
      </div>

      {!form.isAlive && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="deathDate">Death date</Label>
            <Input id="deathDate" type="date" value={form.deathDate} onChange={(e) => set('deathDate', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="deathPlace">Death place</Label>
            <Input id="deathPlace" value={form.deathPlace} onChange={(e) => set('deathPlace', e.target.value)} />
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="bio">Biography</Label>
        <Textarea
          id="bio"
          rows={4}
          placeholder="A few words about this person…"
          value={form.bio}
          onChange={(e) => set('bio', e.target.value)}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1 bg-amber-700 hover:bg-amber-800 text-white" disabled={loading}>
          {loading ? 'Saving…' : person ? 'Save changes' : 'Add person'}
        </Button>
      </div>
    </form>
  );
}
