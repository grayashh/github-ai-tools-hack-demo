import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold">London Underground Station Explorer</h1>
        <div className="text-sm">Explore London Underground stations and their connections!</div>
        <Link href="/stations">
          <Button size="sm" className="mt-4">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
}
