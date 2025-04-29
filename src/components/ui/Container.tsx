
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div 
      className={cn(
        "w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8", 
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
