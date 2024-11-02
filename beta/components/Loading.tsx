import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';

export default function Loading() {
  return (
    <div className="flex justify-center h-full w-full my-20">
      <Loader2 className="h-20 w-20 animate-spin text-black" />
    </div>
  );
}
