import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  anchor?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

export const BorderBeam = ({
  className,
  size = 200,
  duration = 15,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  delay = 0,
}: BorderBeamProps) => {
  return (
    <div
      style={
        {
          "--size": size,
          "--duration": duration,
          "--anchor": anchor,
          "--border-width": borderWidth,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--delay": `-${delay}s`,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent]",
        // mask styles
        "[mask-clip:padding-box,border-box] [mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]",
        // pseudo styles
        "after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:animate-border-beam after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:calc(var(--anchor)*1%)_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]",
        className,
      )}
    />
  );
};

// Border Beam Button Component
export const BorderBeamButton = ({
  children,
  className,
  colors = { from: "#ffaa40", to: "#9c40ff" },
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  colors?: { from: string; to: string };
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={cn(
        "relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50",
        className
      )}
      {...props}
    >
      <BorderBeam
        size={100}
        duration={12}
        colorFrom={colors.from}
        colorTo={colors.to}
      />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 py-1 text-sm font-medium text-white backdrop-blur-3xl transition-all duration-200 hover:bg-slate-800">
        {children}
      </span>
    </button>
  );
};

// Industry-specific Border Beam Buttons
export const TechBorderBeamButton = ({ children, ...props }: { children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <BorderBeamButton
      colors={{ from: "#6366f1", to: "#8b5cf6" }}
      {...props}
    >
      {children}
    </BorderBeamButton>
  );
};

export const EcommerceBorderBeamButton = ({ children, ...props }: { children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <BorderBeamButton
      colors={{ from: "#ea580c", to: "#dc2626" }}
      {...props}
    >
      {children}
    </BorderBeamButton>
  );
};

export const LuxuryBorderBeamButton = ({ children, ...props }: { children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <BorderBeamButton
      colors={{ from: "#d4af37", to: "#1b4332" }}
      {...props}
    >
      {children}
    </BorderBeamButton>
  );
};