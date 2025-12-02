import TutorView from '@/components/TutorView';
import Navbar from '@/components/Navbar';

export default function TutorPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <TutorView />
      </main>
    </div>
  );
}
