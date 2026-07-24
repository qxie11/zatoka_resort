"use client";
/* eslint-disable @next/next/no-img-element */

import * as React from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { X } from "lucide-react";

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
  const [api, setApi] = React.useState<any>();
  const [current, setCurrent] = React.useState(initialSlide);

  React.useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrent(initialSlide);
      if (api) {
        api.scrollTo(initialSlide, true);
      }
    }
  }, [isOpen, initialSlide, api]);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const validImages = images?.filter(Boolean) || [];

  if (validImages.length === 0) {
    return null;
  }

  const handleThumbnailClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] max-h-[100vh] w-screen h-screen bg-black/95 border-none p-0 overflow-hidden flex flex-col z-[100] [&>button:last-child]:hidden [&>button]:hidden rounded-none duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
        
        {/* Floating Header */}
        <div className="absolute top-0 left-0 right-0 z-50 p-4 md:p-8 flex justify-between items-start bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none">
          <div className="pointer-events-auto">
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white drop-shadow-xl">
              {roomName}
            </h2>
            <p className="text-white/70 font-medium text-sm md:text-base mt-2 flex items-center gap-2">
              <span className="inline-block px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md border border-white/10">
                {current + 1} из {validImages.length}
              </span>
            </p>
          </div>
          
          <button 
            onClick={onClose}
            className="pointer-events-auto h-12 w-12 md:h-14 md:w-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-xl border border-white/10 transition-all duration-300 hover:rotate-90 active:scale-90 shadow-2xl"
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </div>

        {/* Main Carousel Area */}
        <div className="flex-1 w-full h-full relative flex flex-col justify-center">
          <Carousel setApi={setApi} className="w-full h-full relative" opts={{ duration: 30, loop: true, startIndex: initialSlide }}>
            <CarouselContent className="h-full ml-0">
              {validImages.map((imageUrl, index) => (
                <CarouselItem key={index} className="pl-0 relative w-full h-full flex items-center justify-center">
                  
                  {/* Blurred Background effect */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-30 blur-[60px] scale-110 transition-opacity duration-700"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                  />
                  
                  {/* Main Image */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center p-4 pb-32 md:pb-36 pt-24 md:pt-32">
                    <img
                      src={imageUrl}
                      alt={`${roomName} - ${index + 1}`}
                      className="max-w-full max-h-full object-contain rounded-xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] select-none"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {validImages.length > 1 && (
              <>
                <CarouselPrevious className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 h-14 w-14 md:h-16 md:w-16 bg-black/40 hover:bg-black/60 text-white border border-white/10 backdrop-blur-xl rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all z-40 flex items-center justify-center" />
                <CarouselNext className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 h-14 w-14 md:h-16 md:w-16 bg-black/40 hover:bg-black/60 text-white border border-white/10 backdrop-blur-xl rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all z-40 flex items-center justify-center" />
              </>
            )}
          </Carousel>
        </div>

        {/* Thumbnails row at the bottom */}
        {validImages.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-32 md:h-40 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex items-end justify-center pb-6 md:pb-8 z-50 pointer-events-none">
            <div className="flex gap-2 md:gap-3 px-4 md:px-8 overflow-x-auto snap-x max-w-full [&::-webkit-scrollbar]:hidden pointer-events-auto items-end">
              {validImages.map((imageUrl, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`relative flex-shrink-0 rounded-lg md:rounded-xl overflow-hidden transition-all duration-300 snap-center outline-none ${
                    current === index 
                      ? "w-20 h-16 md:w-28 md:h-20 ring-2 ring-teal-400 scale-105 opacity-100 shadow-[0_0_30px_rgba(45,212,191,0.3)] z-10" 
                      : "w-16 h-12 md:w-24 md:h-16 opacity-40 hover:opacity-100 hover:scale-105 border border-white/10"
                  }`}
                >
                  <img 
                    src={imageUrl} 
                    className="w-full h-full object-cover transition-transform duration-500" 
                    alt={`Thumbnail ${index + 1}`}
                  />
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
