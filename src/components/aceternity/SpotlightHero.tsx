import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpotlightHeroProps {
  title: string;
  subtitle?: string;
  description: string;
  primaryCTA: string;
  secondaryCTA?: string;
  className?: string;
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export function SpotlightHero({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  className,
  colors = {
    primary: "#6366f1",
    secondary: "#8b5cf6", 
    accent: "#ec4899"
  }
}: SpotlightHeroProps) {
  return (
    <div className={cn("relative h-screen w-full overflow-hidden bg-black/[0.96] antialiased bg-grid-white/[0.02]", className)}>
      {/* Spotlight Effect */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill={colors.primary}
      />
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      
      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="mx-auto max-w-7xl px-4 text-center">
          {subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <span 
                className="inline-block rounded-full px-4 py-2 text-sm font-medium"
                style={{ 
                  backgroundColor: `${colors.primary}20`,
                  color: colors.primary,
                  border: `1px solid ${colors.primary}40`
                }}
              >
                {subtitle}
              </span>
            </motion.div>
          )}
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-white to-gray-400 bg-clip-text text-4xl font-bold text-transparent md:text-7xl"
          >
            {title}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl"
          >
            {description}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <button
              className="group relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
              style={{ background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})` }}
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span 
                className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: `${colors.primary}dd` }}
              >
                {primaryCTA}
              </span>
            </button>
            
            {secondaryCTA && (
              <button className="inline-flex h-12 items-center justify-center rounded-full border border-gray-600 px-8 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-gray-400 hover:text-white">
                {secondaryCTA}
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Spotlight component
const Spotlight = ({ className, fill }: { className?: string; fill?: string }) => {
  return (
    <svg
      className={cn(
        "pointer-events-none absolute z-[1] h-[169%] w-[138%] animate-spotlight opacity-0 lg:w-[84%]",
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter="url(#filter)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill={fill || "white"}
          fillOpacity="0.21"
        ></ellipse>
      </g>
      <defs>
        <filter
          id="filter"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          ></feBlend>
          <feGaussianBlur
            stdDeviation="151"
            result="effect1_foregroundBlur_1065_8"
          ></feGaussianBlur>
        </filter>
      </defs>
    </svg>
  );
};