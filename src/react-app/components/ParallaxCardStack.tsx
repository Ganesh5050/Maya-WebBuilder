import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { X, Play } from "lucide-react";

// Sample images for the stack
const stackImages = [
  {
    title: "Dashboard Preview",
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
  },
  {
    title: "Analytics View",
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
  },
  {
    title: "Mobile App",
    src: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
  },
];

interface StickyCardProps {
  i: number;
  title: string;
  src: string;
  progress: any;
  range: [number, number];
  targetScale: number;
}

const StickyCard = ({
  i,
  title,
  src,
  progress,
  range,
  targetScale,
}: StickyCardProps) => {
  const container = useRef<HTMLDivElement>(null);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="sticky top-0 flex items-center justify-center h-screen"
    >
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 25 + 100}px)`,
        }}
        className="relative rounded-3xl flex h-[400px] w-[700px] max-w-[90vw] origin-top flex-col overflow-hidden shadow-2xl"
      >
        <img 
          src={src} 
          alt={title} 
          className="h-full w-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6">
          <h3 className="text-white text-xl font-semibold">{title}</h3>
        </div>
      </motion.div>
    </div>
  );
};

// Video Modal Component
const VideoModal = ({ 
  isOpen, 
  onClose, 
  videoUrl 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  videoUrl: string;
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-[90vw] h-[80vh] max-w-6xl bg-black rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        
        {/* Video Placeholder or iframe */}
        {videoUrl ? (
          <iframe
            src={videoUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-white">
              <Play className="w-20 h-20 mx-auto mb-4 opacity-50" />
              <p className="text-lg opacity-70">Video URL not provided</p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Tab Content Components
const VideoTab = ({ onOpenVideo }: { onOpenVideo: () => void }) => (
  <div 
    onClick={onOpenVideo}
    className="relative h-[400px] w-[700px] max-w-[90vw] rounded-3xl overflow-hidden cursor-pointer group shadow-2xl"
  >
    <img 
      src="https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&h=600&fit=crop" 
      alt="Video thumbnail"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
        <Play className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" />
      </div>
    </div>
    <div className="absolute bottom-6 left-6">
      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">
        Watch Demo
      </span>
    </div>
  </div>
);

const ComingSoonTab = () => (
  <div className="relative h-[400px] w-[700px] max-w-[90vw] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800">
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
      <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-3xl font-bold text-white mb-3">Coming Soon</h3>
      <p className="text-gray-400 max-w-md">
        We're working on something exciting. Stay tuned for new features and updates.
      </p>
      <button className="mt-6 px-6 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-colors">
        Get Notified
      </button>
    </div>
  </div>
);

export default function ParallaxCardStack() {
  const container = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'video' | 'images' | 'coming-soon'>('images');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl] = useState(''); // Will be provided later

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const tabs = [
    { id: 'video', label: 'Video' },
    { id: 'images', label: 'Images' },
    { id: 'coming-soon', label: 'Coming Soon' },
  ] as const;

  return (
    <section className="relative bg-white">
      {/* Tab Navigation */}
      <div className="sticky top-20 z-40 flex justify-center py-6 bg-white/80 backdrop-blur-sm">
        <div className="inline-flex items-center gap-1 p-1.5 bg-gray-100 rounded-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'video' && (
        <div className="flex items-center justify-center py-20">
          <VideoTab onOpenVideo={() => setShowVideoModal(true)} />
        </div>
      )}

      {activeTab === 'images' && (
        <div
          ref={container}
          className="relative"
          style={{ height: `${stackImages.length * 100}vh` }}
        >
          {/* Scroll indicator */}
          <div className="absolute left-1/2 top-[5%] -translate-x-1/2 text-center z-10">
            <span className="text-xs uppercase tracking-widest text-gray-400 relative">
              scroll down to see card stack
              <span className="absolute left-1/2 top-full mt-2 h-12 w-px bg-gradient-to-b from-gray-400 to-transparent -translate-x-1/2" />
            </span>
          </div>

          {/* Stacked Cards */}
          {stackImages.map((project, i) => {
            const targetScale = Math.max(0.85, 1 - (stackImages.length - i - 1) * 0.05);
            return (
              <StickyCard
                key={`card_${i}`}
                i={i}
                {...project}
                progress={scrollYProgress}
                range={[i * 0.25, 1]}
                targetScale={targetScale}
              />
            );
          })}
        </div>
      )}

      {activeTab === 'coming-soon' && (
        <div className="flex items-center justify-center py-20">
          <ComingSoonTab />
        </div>
      )}

      {/* Video Modal */}
      <VideoModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        videoUrl={videoUrl}
      />
    </section>
  );
}
