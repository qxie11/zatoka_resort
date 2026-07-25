"use client";
/* eslint-disable @next/next/no-img-element */

import * as React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
  initialSlide?: number;
}

export default function ImageGallery({
  images,
  isOpen,
  onClose,
  roomName,
  initialSlide = 0,
}: ImageGalleryProps) {
  const [current, setCurrent] = React.useState(initialSlide);
  const thumbsRef = React.useRef<HTMLDivElement>(null);

  const validImages = images?.filter(Boolean) || [];

  React.useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrent(initialSlide);
    }
  }, [isOpen, initialSlide]);

  React.useEffect(() => {
    if (thumbsRef.current) {
      const activeThumb = thumbsRef.current.children[current] as HTMLElement;
      activeThumb?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [current]);

  if (validImages.length === 0) return null;

  const prev = () => setCurrent((c) => (c === 0 ? validImages.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === validImages.length - 1 ? 0 : c + 1));

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
    if (e.key === "Escape") onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        onKeyDown={handleKey}
        className="max-w-none w-screen h-[100dvh] bg-black/95 border-none p-0 rounded-none z-[100] [&>button]:hidden overflow-hidden grid"
        style={{ gridTemplateRows: "auto 1fr auto" }}
      >
        <DialogTitle className="sr-only">Галерея фотографий {roomName}</DialogTitle>

        {/* ── ROW 1: Header ── */}
        <div className="flex justify-between items-start px-4 py-4 md:px-8 md:py-6 bg-gradient-to-b from-black/80 to-transparent pointer-events-none relative z-10">
          <div className="pointer-events-auto">
            <h2 className="text-xl md:text-3xl font-black tracking-tight text-white drop-shadow-xl leading-tight">
              {roomName}
            </h2>
            <span className="mt-1.5 inline-block px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md border border-white/10 text-white/70 text-sm font-medium">
              {current + 1} из {validImages.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="pointer-events-auto h-11 w-11 md:h-13 md:w-13 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-xl border border-white/10 transition-all duration-300 hover:rotate-90 active:scale-90 shadow-2xl flex-shrink-0"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* ── ROW 2: Image (takes all remaining space) ── */}
        <div className="relative min-h-0 w-full overflow-hidden">
          {/* Blurred bg */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 blur-[50px] scale-110 transition-all duration-700 pointer-events-none"
            style={{ backgroundImage: `url(${validImages[current]})` }}
          />

          {/* Image */}
          <div className="relative z-10 w-full h-full flex items-center justify-center px-14 md:px-20 py-2">
            <img
              key={current}
              src={validImages[current]}
              alt={`${roomName} - ${current + 1}`}
              className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl shadow-2xl select-none"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>

          {/* Nav arrows */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 md:h-14 md:w-14 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/10 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-90 shadow-2xl"
                aria-label="Предыдущее фото"
              >
                <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
              </button>
              <button
                onClick={next}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 md:h-14 md:w-14 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/10 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-90 shadow-2xl"
                aria-label="Следующее фото"
              >
                <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
              </button>
            </>
          )}
        </div>

        {/* ── ROW 3: Thumbnails ── */}
        {validImages.length > 1 && (
          <div className="bg-gradient-to-t from-black/90 to-transparent px-2 py-2 flex justify-center flex-shrink-0">
            <div
              ref={thumbsRef}
              className="flex gap-2 md:gap-3 overflow-x-auto overflow-y-visible max-w-full [&::-webkit-scrollbar]:hidden snap-x items-center px-2 py-4"
            >
              {validImages.map((imageUrl, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 snap-center outline-none ${
                    current === index
                      ? "w-20 h-14 md:w-24 md:h-16 ring-2 ring-teal-400 scale-105 opacity-100 shadow-[0_0_20px_rgba(45,212,191,0.4)]"
                      : "w-14 h-10 md:w-18 md:h-12 opacity-40 hover:opacity-80 hover:scale-105 border border-white/10"
                  }`}
                >
                  <img src={imageUrl} className="w-full h-full object-cover" alt="" />
                  {current === index && (
                    <div className="absolute inset-0 bg-teal-400/10 pointer-events-none" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
