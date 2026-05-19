import { useEffect } from 'react';

export default function Website() {
  useEffect(() => {
    window.location.href = 'https://aakt-website.vercel.app';
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <p className="text-lg">Redirecting to AAKT Website...</p>
    </div>
  );
}
