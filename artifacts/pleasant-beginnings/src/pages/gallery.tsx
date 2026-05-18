import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { useListGallery, getListGalleryQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES = ["All", "Programs", "Events", "Community", "General"];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { data: galleryImages = [], isLoading } = useListGallery({
    query: { queryKey: getListGalleryQueryKey() }
  });

  const filteredImages = galleryImages.filter(
    (img) => activeCategory === "All" || img.category === activeCategory
  );

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const showNext = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % filteredImages.length);
    }
  }, [selectedIndex, filteredImages.length]);

  const showPrev = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + filteredImages.length) % filteredImages.length);
    }
  }, [selectedIndex, filteredImages.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = selectedIndex !== null ? "hidden" : "auto";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [selectedIndex, showNext, showPrev]);

  const getImageUrl = (objectPath: string) => `/api/storage${objectPath}`;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader
        title="Our Community"
        description="Moments from our programs, events, and the families we serve."
      />

      <section className="py-16 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "bg-secondary text-secondary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 auto-rows-[250px]">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="w-full h-full rounded-xl" />
              ))}
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground">
              <ImageOff className="w-12 h-12 mb-4 opacity-40" />
              <p className="text-lg">No photos yet in this category.</p>
              <p className="text-sm mt-1">Check back soon — we're always adding new moments!</p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 auto-rows-[250px]"
            >
              <AnimatePresence>
                {filteredImages.map((image, index) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={image.id}
                    className="relative group overflow-hidden rounded-xl shadow-sm cursor-pointer row-span-1"
                    onClick={() => openLightbox(index)}
                  >
                    <img
                      src={getImageUrl(image.objectPath)}
                      alt={image.caption}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <span className="text-secondary text-xs font-bold uppercase tracking-wider mb-2">
                        {image.category}
                      </span>
                      <p className="text-white text-lg font-medium leading-snug">
                        {image.caption}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && filteredImages[selectedIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-primary/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
            onClick={closeLightbox}
          >
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-primary/50 rounded-full p-2"
              onClick={closeLightbox}
            >
              <X size={24} />
            </button>

            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors bg-primary/50 rounded-full p-3 hidden sm:block"
              onClick={(e) => { e.stopPropagation(); showPrev(); }}
            >
              <ChevronLeft size={32} />
            </button>

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors bg-primary/50 rounded-full p-3 hidden sm:block"
              onClick={(e) => { e.stopPropagation(); showNext(); }}
            >
              <ChevronRight size={32} />
            </button>

            <div
              className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={getImageUrl(filteredImages[selectedIndex].objectPath)}
                alt={filteredImages[selectedIndex].caption}
                className="max-w-full max-h-[75vh] object-contain rounded-md shadow-2xl"
              />
              <div className="mt-6 text-center">
                <p className="text-white text-xl font-medium">{filteredImages[selectedIndex].caption}</p>
                <p className="text-secondary mt-1 text-sm uppercase tracking-wider">{filteredImages[selectedIndex].category}</p>
              </div>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm">
              {selectedIndex + 1} / {filteredImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
