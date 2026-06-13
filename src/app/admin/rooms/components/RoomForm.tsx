"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, ArrowLeft, ArrowRight, Trash2, Upload, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import type { Room } from "@/lib/types";

const roomSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  slug: z.string().min(1, "Слаг обязателен").regex(/^[a-z0-9-]+$/, "Слаг должен состоять из латинских букв в нижнем регистре, цифр и дефисов"),
  description: z.string().min(1, "Описание обязательно"),
  price: z.coerce.number().min(0, "Цена должна быть положительным числом"),
  capacity: z.coerce.number().int().min(1, "Вместимость должна быть не менее 1"),
  amenities: z.string(),
  imageUrl: z.string().optional(),
  imageUrls: z.string().optional(),
  imageHint: z.string().optional(),
});

type RoomFormValues = {
  name: string;
  slug: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string;
  imageUrl?: string;
  imageUrls?: string;
  imageHint?: string;
};

interface RoomFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (values: Omit<Room, 'id'>, id?: string) => void;
  room: Room | null;
}

interface RoomFormImage {
  id: string;
  url: string;
  file?: File;
}

export default function RoomForm({ isOpen, onOpenChange, onSubmit, room }: RoomFormProps) {
  const { toast } = useToast();
  const [images, setImages] = useState<RoomFormImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
        name: '',
        slug: '',
        description: '',
        price: 0,
        capacity: 1,
        amenities: '',
        imageUrl: '',
        imageUrls: '',
        imageHint: ''
    }
  });

  const clearLocalUrls = (imgs: RoomFormImage[]) => {
    imgs.forEach(img => {
      if (img.file && img.url.startsWith('blob:')) {
        URL.revokeObjectURL(img.url);
      }
    });
  };

  useEffect(() => {
    // Clean up previous URLs
    clearLocalUrls(images);

    if (room) {
      const initialImages: RoomFormImage[] = [];
      if (room.imageUrl) {
        initialImages.push({ id: "main-initial", url: room.imageUrl });
      }
      if (room.imageUrls && room.imageUrls.length > 0) {
        room.imageUrls.forEach((url, idx) => {
          initialImages.push({ id: `add-initial-${idx}`, url });
        });
      }
      setImages(initialImages);

      form.reset({
          name: room.name,
          slug: room.slug || '',
          description: room.description,
          price: room.price,
          capacity: room.capacity,
          amenities: room.amenities.join(', '),
          imageUrl: room.imageUrl,
          imageUrls: room.imageUrls?.join(', ') || '',
          imageHint: room.imageHint
      });
    } else {
      setImages([]);
      form.reset({
        name: '',
        slug: '',
        description: '',
        price: 0,
        capacity: 1,
        amenities: '',
        imageUrl: '',
        imageUrls: '',
        imageHint: ''
      });
    }
  }, [room, isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearLocalUrls(images);
    };
  }, []);

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newImages.length) {
      const temp = newImages[index];
      newImages[index] = newImages[targetIndex];
      newImages[targetIndex] = temp;
      setImages(newImages);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const removed = newImages.splice(index, 1)[0];
    if (removed && removed.file && removed.url.startsWith('blob:')) {
      URL.revokeObjectURL(removed.url);
    }
    setImages(newImages);
  };

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newImages = files.map(file => ({
        id: Math.random().toString(36).substring(7) + '-' + Date.now(),
        url: URL.createObjectURL(file),
        file
      }));
      setImages(prev => [...prev, ...newImages]);
    }
    e.target.value = ''; // Reset
  };

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      setImages(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7) + '-' + Date.now(),
          url: urlInput.trim()
        }
      ]);
      setUrlInput('');
    }
  };

  const handleFormSubmit = form.handleSubmit(async (data) => {
    setIsUploading(true);
    try {
      const filesToUpload = images.filter(img => img.file);
      const uploadedMap = new Map<string, string>();

      if (filesToUpload.length > 0) {
        const formData = new FormData();
        filesToUpload.forEach(img => {
          if (img.file) {
            formData.append('files', img.file);
          }
        });

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Ошибка при загрузке изображений');
        }

        const uploadResult = await uploadResponse.json();
        if (uploadResult.paths && uploadResult.paths.length === filesToUpload.length) {
          filesToUpload.forEach((img, idx) => {
            uploadedMap.set(img.id, uploadResult.paths[idx]);
          });
        } else {
          throw new Error('Ошибка при сохранении загруженных изображений');
        }
      }

      const finalUrls = images.map(img => {
        if (img.file) {
          return uploadedMap.get(img.id) || '';
        }
        return img.url;
      }).filter(Boolean);

      const mainImagePath = finalUrls[0] || '';
      const additionalImagePaths = finalUrls.slice(1);

      const amenitiesArray = Array.isArray(data.amenities) 
        ? data.amenities 
        : String(data.amenities).split(',').map(s => s.trim()).filter(Boolean);

      onSubmit({ 
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        capacity: data.capacity,
        amenities: amenitiesArray,
        imageUrl: mainImagePath,
        imageUrls: additionalImagePaths,
        imageHint: data.imageHint || ''
      }, room?.id);

      // Reset local urls state
      clearLocalUrls(images);
      setImages([]);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : 'Ошибка при сохранении изменений',
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  });

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[525px] overflow-y-auto bg-slate-950 border-l border-white/10 shadow-2xl text-slate-100">
        <SheetHeader className="pb-4 border-b border-white/10">
          <SheetTitle className="text-2xl font-bold text-white">
            {room ? "Редактировать номер" : "Создать новый номер"}
          </SheetTitle>
          <SheetDescription className="text-slate-400 font-light mt-1">
            {room ? "Внесите изменения в подробную информацию о номере." : "Заполните необходимые детали нового номера для гостей."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleFormSubmit} className="grid gap-5 py-5 text-slate-200">
            <div className="grid gap-2">
                 <Label htmlFor="name" className="font-semibold text-slate-300">Название</Label>
                 <Input id="name" {...form.register("name")} className="bg-slate-900 border-white/10 text-white rounded-xl focus:ring-teal-500 shadow-sm h-11" />
                 {form.formState.errors.name && <p className="text-xs text-rose-500">{form.formState.errors.name.message}</p>}
             </div>
            <div className="grid gap-2">
                 <Label htmlFor="slug" className="font-semibold text-slate-300">Слаг (URL)</Label>
                 <Input id="slug" {...form.register("slug")} placeholder="deluxe-suite" className="bg-slate-900 border-white/10 text-white rounded-xl focus:ring-teal-500 shadow-sm h-11 font-mono text-sm" />
                 {form.formState.errors.slug && <p className="text-xs text-rose-500">{form.formState.errors.slug.message}</p>}
             </div>
            <div className="grid gap-2">
                 <Label htmlFor="description" className="font-semibold text-slate-300">Описание</Label>
                 <Textarea id="description" {...form.register("description")} className="bg-slate-900 border-white/10 text-white rounded-xl focus:ring-teal-500 shadow-sm min-h-[100px] font-light leading-relaxed" />
                 {form.formState.errors.description && <p className="text-xs text-rose-500">{form.formState.errors.description.message}</p>}
             </div>
            <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                      <Label htmlFor="price" className="font-semibold text-slate-300">Цена (грн)</Label>
                      <div className="flex items-center bg-slate-900 border border-white/10 rounded-xl h-11 px-1.5 w-full">
                        <button
                          type="button"
                          onClick={() => form.setValue("price", Math.max(0, (form.watch("price") || 0) - 100))}
                          className="h-8 w-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all active:scale-95 shrink-0"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <input
                          id="price"
                          type="number"
                          {...form.register("price", { valueAsNumber: true })}
                          className="w-full text-center bg-transparent border-0 outline-none focus:ring-0 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          type="button"
                          onClick={() => form.setValue("price", (form.watch("price") || 0) + 100)}
                          className="h-8 w-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all active:scale-95 shrink-0"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      {form.formState.errors.price && <p className="text-xs text-rose-500">{form.formState.errors.price.message}</p>}
                  </div>
                  <div className="grid gap-2">
                      <Label htmlFor="capacity" className="font-semibold text-slate-300">Вместимость (гостей)</Label>
                      <div className="flex items-center bg-slate-900 border border-white/10 rounded-xl h-11 px-1.5 w-full">
                        <button
                          type="button"
                          onClick={() => form.setValue("capacity", Math.max(1, (form.watch("capacity") || 1) - 1))}
                          className="h-8 w-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all active:scale-95 shrink-0"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <input
                          id="capacity"
                          type="number"
                          {...form.register("capacity", { valueAsNumber: true })}
                          className="w-full text-center bg-transparent border-0 outline-none focus:ring-0 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          type="button"
                          onClick={() => form.setValue("capacity", Math.min(10, (form.watch("capacity") || 1) + 1))}
                          className="h-8 w-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all active:scale-95 shrink-0"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      {form.formState.errors.capacity && <p className="text-xs text-rose-500">{form.formState.errors.capacity.message}</p>}
                  </div>
              </div>
            <div className="grid gap-2">
                 <Label htmlFor="amenities" className="font-semibold text-slate-300">Удобства (через запятую)</Label>
                 <Input id="amenities" {...form.register("amenities")} className="bg-slate-900 border-white/10 text-white rounded-xl focus:ring-teal-500 shadow-sm h-11" />
                 {form.formState.errors.amenities && <p className="text-xs text-rose-500">{form.formState.errors.amenities.message}</p>}
             </div>
            
            <div className="grid gap-4 bg-slate-900/40 p-4 rounded-2xl border border-white/10">
                 <Label className="font-semibold text-slate-300">Галерея изображений</Label>
                 
                 {images.length === 0 ? (
                   <div className="flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl p-8 text-slate-500">
                     <ImageIcon className="h-10 w-10 mb-2 stroke-[1.5]" />
                     <p className="text-sm">Нет изображений. Загрузите файлы или добавьте по ссылке.</p>
                   </div>
                 ) : (
                   <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                     {images.map((img, idx) => (
                       <div key={img.id} className="group relative flex flex-col bg-slate-950 border border-white/10 rounded-xl overflow-hidden shadow-md">
                         <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                           <img 
                             src={img.url} 
                             alt={`Preview ${idx + 1}`}
                             className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                           />
                           {idx === 0 && (
                             <span className="absolute top-2 left-2 bg-teal-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                               Основное
                             </span>
                           )}
                           {img.file && (
                             <span className="absolute top-2 right-2 bg-sky-500/80 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                               Файл
                             </span>
                           )}
                         </div>
                         <div className="flex items-center justify-between p-2 bg-slate-900/80 border-t border-white/5">
                           <div className="flex gap-1">
                             <Button
                               type="button"
                               variant="ghost"
                               size="icon"
                               onClick={() => moveImage(idx, 'up')}
                               disabled={idx === 0}
                               className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 rounded-lg"
                             >
                               <ArrowLeft className="h-4 w-4" />
                             </Button>
                             <Button
                               type="button"
                               variant="ghost"
                               size="icon"
                               onClick={() => moveImage(idx, 'down')}
                               disabled={idx === images.length - 1}
                               className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 rounded-lg"
                             >
                               <ArrowRight className="h-4 w-4" />
                             </Button>
                           </div>
                           <Button
                             type="button"
                             variant="ghost"
                             size="icon"
                             onClick={() => removeImage(idx)}
                             className="h-8 w-8 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg"
                           >
                             <Trash2 className="h-4 w-4" />
                           </Button>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}

                 <div className="grid gap-3 pt-2">
                   <div className="flex flex-col gap-1.5">
                     <span className="text-xs text-slate-400 font-medium">Загрузить с компьютера</span>
                     <div className="flex items-center gap-2">
                       <Input 
                         id="gallery-upload"
                         type="file" 
                         accept="image/*"
                         multiple
                         onChange={handleAddFiles}
                         className="hidden"
                       />
                       <Button
                         type="button"
                         variant="outline"
                         onClick={() => document.getElementById('gallery-upload')?.click()}
                         className="w-full bg-slate-900 border-white/10 hover:bg-slate-800 text-slate-200 rounded-xl h-11 gap-2 border"
                       >
                         <Upload className="h-4 w-4" /> Выберите файлы
                       </Button>
                     </div>
                   </div>

                   <div className="flex flex-col gap-1.5 mt-1">
                     <span className="text-xs text-slate-400 font-medium">Или добавить по ссылке</span>
                     <div className="flex gap-2">
                       <Input 
                         type="text" 
                         placeholder="https://..."
                         value={urlInput}
                         onChange={(e) => setUrlInput(e.target.value)}
                         className="bg-slate-900 border-white/10 text-white rounded-xl focus:ring-teal-500 shadow-sm h-11"
                       />
                       <Button
                         type="button"
                         onClick={handleAddUrl}
                         className="bg-slate-800 border border-white/10 hover:bg-slate-700 text-white rounded-xl h-11 px-4 shrink-0"
                       >
                         <LinkIcon className="h-4 w-4" />
                       </Button>
                     </div>
                   </div>
                 </div>
            </div>

            <div className="grid gap-2">
                 <Label htmlFor="imageHint" className="font-semibold text-slate-300">Подсказка для AI (1-2 слова)</Label>
                 <Input id="imageHint" {...form.register("imageHint")} className="bg-slate-900 border-white/10 text-white rounded-xl focus:ring-teal-500 shadow-sm h-11" />
                 {form.formState.errors.imageHint && <p className="text-xs text-rose-500">{form.formState.errors.imageHint.message}</p>}
             </div>
  
               <SheetFooter className="mt-6 border-t border-white/10 pt-4 gap-2">
                  <SheetClose asChild>
                      <Button type="button" variant="outline" disabled={isUploading} className="rounded-xl border-white/10 text-slate-300 hover:bg-white/5 h-11">Отмена</Button>
                  </SheetClose>
                  <Button type="submit" disabled={isUploading} className="bg-gradient-to-r from-teal-400 to-sky-500 hover:from-teal-300 hover:to-sky-400 text-slate-950 font-bold border-0 shadow-lg shadow-teal-500/20 rounded-xl px-5 h-11">
                    {isUploading ? "Сохранение..." : "Сохранить номер"}
                  </Button>
               </SheetFooter>
         </form>
       </SheetContent>
     </Sheet>
  );
}

