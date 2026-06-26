'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Person } from '@/types';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import PersonCard from '@/components/person/PersonCard';

const Tree = dynamic(() => import('react-d3-tree'), { ssr: false });

interface TreeNode {
  name: string;
  attributes?: Record<string, string>;
  children?: TreeNode[];
  _id?: string;
}

function buildTree(people: Person[]): TreeNode[] {
  const map = new Map(people.map((p) => [p._id, p]));
  const roots = people.filter((p) => p.parents.length === 0);
  if (roots.length === 0 && people.length > 0) return [toNode(people[0], map, new Set())];
  return roots.map((r) => toNode(r, map, new Set()));
}

function toNode(person: Person, map: Map<string, Person>, visited: Set<string>): TreeNode {
  visited.add(person._id);
  const children = person.children
    .filter((c) => !visited.has(c._id) && map.has(c._id))
    .map((c) => toNode(map.get(c._id)!, map, visited));

  return {
    name: `${person.firstName} ${person.lastName}`,
    _id: person._id,
    attributes: {
      ...(person.birthDate ? { Born: new Date(person.birthDate).getFullYear().toString() } : {}),
      ...(person.birthPlace ? { From: person.birthPlace } : {}),
    },
    ...(children.length > 0 ? { children } : {}),
  };
}

export default function TreePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [people, setPeople] = useState<Person[]>([]);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Person | null>(null);

  const load = useCallback(async () => {
    if (!user) { router.push('/auth/login'); return; }
    setLoading(true);
    try {
      const data = await api.people.getAll() as Person[];
      setPeople(data);
      setTreeData(buildTree(data));
    } catch {
      toast.error('Failed to load family tree');
    } finally {
      setLoading(false);
    }
  }, [user, router]);

  useEffect(() => { load(); }, [load]);

  function handleNodeClick(node: any) {
    const id = node.data._id;
    if (!id) return;
    const person = people.find((p) => p._id === id);
    if (person) setSelected(person);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <RefreshCw className="animate-spin h-8 w-8 text-amber-700" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 relative">
        {people.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 py-32 text-center">
            <span className="text-6xl">🌱</span>
            <h2 className="text-2xl font-semibold text-stone-700">Your tree is empty</h2>
            <p className="text-stone-400 max-w-xs">Add your first family member to start building the tree.</p>
            <Button
              className="bg-amber-700 hover:bg-amber-800 rounded-full text-white"
              onClick={() => router.push('/people/new')}
            >
              <Plus className="h-4 w-4 mr-2" /> Add first person
            </Button>
          </div>
        ) : (
          <>
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <Button
                size="sm"
                className="bg-amber-700 hover:bg-amber-800 rounded-full shadow text-white"
                onClick={() => router.push('/people/new')}
              >
                <Plus className="h-4 w-4 mr-1.5" /> Add person
              </Button>
            </div>
            <div style={{ width: '100%', height: 'calc(100vh - 56px)' }}>
              <Tree
                data={treeData.length === 1 ? treeData[0] : { name: 'Family', children: treeData }}
                orientation="vertical"
                pathFunc="step"
                separation={{ siblings: 2, nonSiblings: 2 }}
                onNodeClick={handleNodeClick}
              />
            </div>
          </>
        )}

        {selected && (
          <div className="absolute top-0 right-0 h-full w-80 bg-white border-l border-stone-200 shadow-xl overflow-y-auto z-20">
            <PersonCard person={selected} onClose={() => setSelected(null)} onUpdated={load} />
          </div>
        )}
      </div>
    </div>
  );
}
