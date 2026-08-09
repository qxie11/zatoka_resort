"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Images, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ImageGallery from "./ImageGallery";

interface RoomGalleryProps {
  images: string[];
  roomName: string;
}

export default function RoomGallery({ images, roomName }: RoomGalleryProps) {
  const { t } = useTranslation();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const validImages = images?.filter(Boolean) || [];

  if (validImages.length === 0) {
    return null;
  }

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent opening lightbox when clicking navigation arrows
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent opening lightbox when clicking navigation arrows
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleThumbnailClick = (index: number) => {
    if (index === activeIndex || isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  return (
    <div className="glass-card-dark border border-white/10 rounded-3xl p-4 md:p-6 shadow-2xl bg-slate-900/40 backdrop-blur-sm relative overflow-hidden space-y-6">

      {/* Title & Stats */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Images className="h-5 w-5 text-teal-400" />
          {t("roomGallery") || "Галерея номера"}
        </h3>
        <span className="text-slate-400 text-xs font-mono bg-slate-950/60 border border-white/5 px-2.5 py-1 rounded-full">
          {activeIndex + 1} / {validImages.length}
        </span>
      </div>

      {/* Main Image Box */}
      <div
        onClick={() => setIsLightboxOpen(true)}
        className="relative aspect-[16/10] md:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950/80 border border-white/5 group shadow-inner cursor-zoom-in"
      >

        {/* Ambient Blur Background */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div
            className="absolute inset-[-10%] blur-3xl opacity-40 transition-all duration-700 ease-in-out scale-110"
            style={{
              backgroundImage: `url(${validImages[activeIndex]})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          />
        </div>

        {/* Main Displayed Image - Render all for instant transitions */}
        <div className="relative w-full h-full z-10">
          {validImages.map((imageUrl, idx) => (
            <div
              key={idx}
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out",
                idx === activeIndex
                  ? isTransitioning ? "opacity-40 scale-[1.03]" : "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              )}
            >
              <Image
                src={imageUrl}
                alt={`${roomName} - ${idx + 1}`}
                fill
                className="object-cover select-none"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority={idx === 0}
              />
            </div>
          ))}
        </div>

        {/* Hover Action Indicators */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/20 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-slate-900/80 backdrop-blur-md text-white border border-white/10 p-3.5 rounded-full shadow-2xl scale-90 group-hover:scale-100 transition-all duration-300">
            <Maximize2 className="h-6 w-6 text-teal-400" />
          </div>
        </div>

        {/* Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              type="button"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 h-11 w-11 flex items-center justify-center rounded-full bg-slate-950/60 hover:bg-teal-400/90 hover:text-slate-950 text-white border border-white/10 backdrop-blur-md transition-all duration-350 hover:scale-105 active:scale-95 group/btn"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6 transition-transform group-hover/btn:-translate-x-0.5" />
            </button>
            <button
              onClick={handleNext}
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 h-11 w-11 flex items-center justify-center rounded-full bg-slate-950/60 hover:bg-teal-400/90 hover:text-slate-950 text-white border border-white/10 backdrop-blur-md transition-all duration-350 hover:scale-105 active:scale-95 group/btn"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6 transition-transform group-hover/btn:translate-x-0.5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails list */}
      {validImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto py-2 px-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent snap-x">
          {validImages.map((imageUrl, idx) => (
            <button
              key={idx}
              onClick={() => handleThumbnailClick(idx)}
              type="button"
              className={cn(
                "relative aspect-[16/10] w-20 md:w-24 shrink-0 rounded-xl overflow-hidden border transition-all duration-300 snap-start",
                idx === activeIndex
                  ? "border-teal-400 ring-2 ring-teal-400/30 scale-105 shadow-[0_0_15px_rgba(45,212,191,0.3)]"
                  : "border-white/10 opacity-60 hover:opacity-100 hover:border-white/30 hover:scale-[1.02]"
              )}
            >
              <Image
                src={imageUrl}
                alt={`${roomName} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}

      {/* --- LIGHTBOX DIALOG MODAL --- */}
      <ImageGallery
        images={validImages}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        roomName={roomName}
        initialSlide={activeIndex}
      />

    </div>
  );
}
