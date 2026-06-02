"use client";

import * as React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
}

export default function ImageGallery({
  images,
  isOpen,
  onClose,
  roomName,
}: ImageGalleryProps) {
  const [api, setApi] = React.useState<any>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const validImages = images?.filter(Boolean) || [];

  if (validImages.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] md:w-full bg-slate-950/95 border border-slate-800 text-white backdrop-blur-xl rounded-[2rem] shadow-2xl p-6 sm:p-8 overflow-hidden z-50">
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b border-white/10">
          <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-white">{roomName}</DialogTitle>
        </DialogHeader>
        
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] mt-6 rounded-2xl overflow-hidden bg-slate-900/50 border border-white/5 flex items-center justify-center">
          <Carousel setApi={setApi} className="w-full h-full">
            <CarouselContent className="h-full ml-0">
              {validImages.map((imageUrl, index) => (
                <CarouselItem key={index} className="pl-0 relative w-full h-full aspect-[16/10] sm:aspect-[16/9]">
                  <div className="relative w-full h-full flex items-center justify-center p-2">
                    <img
                      src={imageUrl}
                      alt={`${roomName} - изображение ${index + 1}`}
                      className="rounded-2xl max-w-full max-h-full object-contain shadow-lg selection:bg-transparent"
                      onError={(e) => {
                        console.error("Image load error:", imageUrl, e);
                        const target = e.target as HTMLImageElement;
                        if (target) { 
                          target.style.display = "none";
                        }
                      }}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {validImages.length > 1 && (
              <>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-md rounded-full shadow-lg hover:scale-105 active:scale-95 transition-smooth z-10" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-md rounded-full shadow-lg hover:scale-105 active:scale-95 transition-smooth z-10" />
              </>
            )}
          </Carousel>
        </div>

        {validImages.length > 1 && (
          <div className="flex justify-between items-center mt-5 text-sm">
            <span className="text-slate-400">Галерея номеров</span>
            <div className="text-slate-200 bg-white/10 border border-white/10 px-3.5 py-1 rounded-full font-medium tracking-wider">
              {current + 1} / {validImages.length}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
