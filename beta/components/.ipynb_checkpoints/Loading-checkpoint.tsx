import { Loader2 } from "lucide-react";

interface LoadingProps {
  className?: string;
}

export default function Loading({ className = "m-20 h-20 w-20" }: LoadingProps) {
  return (
    <div className="flex justify-center h-full w-full">
      <Loader2 className={`animate-spin text-black ${className}`} />
    </div>
  );
}
