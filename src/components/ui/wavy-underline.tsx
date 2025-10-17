import { cn } from "@/lib/utils";

interface WavyUnderlineProps extends React.HTMLAttributes<HTMLDivElement> {
  colorClassName?: string;
}

export function WavyUnderline({ className, colorClassName = 'text-primary' }: WavyUnderlineProps) {
  return (
    <div className={cn("flex justify-center my-2", className)}>
      <svg
        className={cn("w-32 h-auto", colorClassName)}
        viewBox="0 0 125 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.5 6C20.0833 11.1667 43.3 1.16667 62.5 6C81.7 10.8333 104.917 1 123.5 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
