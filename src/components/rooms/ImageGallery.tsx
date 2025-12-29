"use client";

import * as React from "react";
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

  // Для отладки
  React.useEffect(() => {
    if (isOpen) {
      console.log("ImageGallery opened with images:", validImages);
    }
  }, [isOpen, validImages]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{roomName}</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-[70vh] px-12 pb-6 box-border overflow-hidden">
          <Carousel setApi={setApi} className="w-full h-full">
            <CarouselContent className="h-full -ml-4">
              {validImages.map((imageUrl, index) => (
                <CarouselItem key={index} className="h-[400px] pl-4 basis-full">
                  <img
                    src={imageUrl}
                    alt={`${roomName} - изображение ${index + 1}`}
                    className="rounded-lg block h-auto w-auto mx-auto max-h-full max-w-full"
                    onError={(e) => {
                      console.error("Image load error:", imageUrl, e);
                      const target = e.target as HTMLImageElement;
                      if (target) { 
                        target.style.display = "none";
                      }
                    }}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {validImages.length > 1 && (
              <>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </>
            )}
          </Carousel>
          {validImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-muted-foreground bg-background/80 px-3 py-1 rounded-full">
              {current + 1} / {validImages.length}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
