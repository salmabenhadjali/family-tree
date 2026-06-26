import Navbar from '@/components/layout/Navbar';
import PersonForm from '@/components/person/PersonForm';

export default function NewPersonPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">
        <h1 className="text-2xl font-bold text-stone-800 mb-6">Add family member</h1>
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <PersonForm />
        </div>
      </main>
    </div>
  );
}
