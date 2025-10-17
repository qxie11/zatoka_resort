import { cn } from "@/lib/utils";

interface WavyUnderlineProps extends React.HTMLAttributes<HTMLDivElement> {
  colorClassName?: string;
}

export function WavyUnderline({ className, colorClassName = 'text-primary' }: WavyUnderlineProps) {
  return (
    <div className={cn("flex justify-center my-4", className)}>
      <svg
        className={cn("w-24 h-auto", colorClassName)}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 81.25 4.94"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1.25,2.5 C1.25,2.5 21.25,5.5 40.625,2.5 C60, -0.5 80,2.5 80,2.5" />
      </svg>
    </div>
  );
}
