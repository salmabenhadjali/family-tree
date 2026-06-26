'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Copy, Check } from 'lucide-react';

export default function InvitePage() {
  const { isAdmin } = useAuth();
  const [form, setForm] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.auth.invite(form) as any;
      setInviteLink(res.inviteLink);
      toast.success(`Invite created for ${form.name}`);
      setForm({ name: '', email: '' });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-stone-400">
          Admin access required.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-10">
        <Card className="shadow-sm border-stone-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-amber-700" />
              Invite a family member
            </CardTitle>
            <CardDescription>
              Generate an invite link to share with a relative. They will be able to
              set a password and access the family tree as an editor.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Their name</Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Aunt Fatima"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Their email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="fatima@example.com"
                />
              </div>
              <Button type="submit" className="w-full bg-amber-700 hover:bg-amber-800" disabled={loading}>
                {loading ? 'Generating…' : 'Generate invite link'}
              </Button>
            </form>

            {inviteLink && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-xs font-semibold text-amber-800 mb-2">Invite link (valid for 7 days)</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs text-stone-700 bg-white border border-stone-100 rounded-md px-2 py-1.5 overflow-hidden text-ellipsis whitespace-nowrap block">
                    {inviteLink}
                  </code>
                  <Button size="sm" variant="outline" onClick={copyLink} className="flex-shrink-0">
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-amber-700 mt-2">Copy and share this link with your family member.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
