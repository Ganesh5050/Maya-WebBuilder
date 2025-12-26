import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

interface BentoGridProps {
  className?: string;
  children?: React.ReactNode;
}

interface BentoGridItemProps {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  colors?: {
    primary: string;
    secondary: string;
  };
}

export const BentoGrid = ({ className, children }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  colors = {
    primary: "#6366f1",
    secondary: "#8b5cf6"
  }
}: BentoGridItemProps) => {
  return (
    <motion.div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4",
        className
      )}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {header}
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        <div className="flex items-center space-x-2 mb-2">
          {icon && (
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${colors.primary}20` }}
            >
              <div style={{ color: colors.primary }}>
                {icon}
              </div>
            </div>
          )}
          <div 
            className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2"
            style={{ color: colors.primary }}
          >
            {title}
          </div>
        </div>
        <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">
          {description}
        </div>
      </div>
    </motion.div>
  );
};

// Pre-built Bento Grid for different industries
export const TechBentoGrid = ({ features }: { features: Array<{ title: string; description: string; icon: React.ReactNode }> }) => {
  return (
    <div className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to build amazing products
          </p>
        </div>
        
        <BentoGrid className="max-w-4xl mx-auto">
          {features.map((feature, i) => (
            <BentoGridItem
              key={i}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              className={i === 3 || i === 6 ? "md:col-span-2" : ""}
              colors={{
                primary: "#6366f1",
                secondary: "#8b5cf6"
              }}
            />
          ))}
        </BentoGrid>
      </div>
    </div>
  );
};

export const EcommerceBentoGrid = ({ features }: { features: Array<{ title: string; description: string; icon: React.ReactNode }> }) => {
  return (
    <div className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Shop With Us
          </h2>
          <p className="text-xl text-gray-600">
            Premium quality and exceptional service
          </p>
        </div>
        
        <BentoGrid className="max-w-4xl mx-auto">
          {features.map((feature, i) => (
            <BentoGridItem
              key={i}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              className={i === 0 ? "md:col-span-2" : ""}
              colors={{
                primary: "#ea580c",
                secondary: "#dc2626"
              }}
            />
          ))}
        </BentoGrid>
      </div>
    </div>
  );
};