'use client';

import { use, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Person } from '@/types';
import Navbar from '@/components/layout/Navbar';
import PersonForm from '@/components/person/PersonForm';

export default function EditPersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [person, setPerson] = useState<Person | null>(null);

  useEffect(() => {
    api.people.getOne(id)
      .then((p) => setPerson(p as Person))
      .catch(() => toast.error('Person not found'));
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">
        <h1 className="text-2xl font-bold text-stone-800 mb-6">Edit person</h1>
        {person ? (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
            <PersonForm person={person} />
          </div>
        ) : (
          <div className="text-stone-400 text-center py-20">Loading…</div>
        )}
      </main>
    </div>
  );
}
