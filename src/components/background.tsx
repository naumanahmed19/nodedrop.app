import React from "react";

import { cn } from "@/lib/utils";

type BackgroundProps = {
  children: React.ReactNode;
  variant?: "top" | "bottom";
  className?: string;
};

export const Background = ({
  children,
  variant = "top",
  className,
}: BackgroundProps) => {
  return (
    <div
      className={cn(
        "relative ",
        variant === "top" &&
        "from-primary/50 via-background to-background/80 rounded-t-4xl rounded-b-2xl bg-linear-to-b via-20%",
        variant === "bottom" &&
        "from-background via-background to-primary/50 rounded-t-2xl rounded-b-4xl bg-linear-to-b",
        className,
      )}
      style={{
        backgroundImage: `
          linear-gradient(to bottom, hsl(0 0% 50% / 0.03), hsl(0 0% 50% / 0.03)),
          linear-gradient(to right, hsl(214.3 31.8% 91.4% / 0.5) 1px, transparent 1px),
          linear-gradient(to bottom, hsl(214.3 31.8% 91.4% / 0.5) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 60px 60px, 60px 60px',
      }}
    >
      {children}
    </div>
  );
};
