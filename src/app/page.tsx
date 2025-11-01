import { redirect } from 'next/navigation';
import { getSession } from './lib/session';
import LandingPage from './landing/page';

export default async function HomePage() {
  const session = await getSession();
  
  // If user is already logged in, redirect to dashboard
  if (session) {
    redirect('/dashboard');
  }
  
  // Otherwise, show landing page
  return <LandingPage />;
}
