
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function RoomForm({ isOpen, onOpenChange, onSubmit, room }: RoomFormProps) {
  const { toast } = useToast();
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
        name: '',
        description: '',
        price: 0,
        capacity: 1,
        amenities: '',
        imageUrl: '',
        imageUrls: '',
        imageHint: ''
    }
  });

  useEffect(() => {
    if (room) {
      form.reset({
          name: room.name,
          description: room.description,
          price: room.price,
          capacity: room.capacity,
          amenities: room.amenities.join(', '),
          imageUrl: room.imageUrl,
          imageUrls: room.imageUrls?.join(', ') || '',
          imageHint: room.imageHint
      });
      setMainImageFile(null);
      setAdditionalImageFiles([]);
    } else {
      form.reset({
        name: '',
        description: '',
        price: 0,
        capacity: 1,
        amenities: '',
        imageUrl: '',
        imageUrls: '',
        imageHint: ''
      });
      setMainImageFile(null);
      setAdditionalImageFiles([]);
    }
  }, [room, form, isOpen]);

  const handleFormSubmit = form.handleSubmit(async (data) => {
    setIsUploading(true);
    try {
      let mainImagePath: string | undefined = data.imageUrl || undefined;
      let additionalImagePaths: string[] = data.imageUrls
        ? String(data.imageUrls).split(',').map(s => s.trim()).filter(Boolean)
        : [];

      if (mainImageFile) {
        const formData = new FormData();
        formData.append('files', mainImageFile);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Ошибка при загрузке основного изображения');
        }

        const uploadResult = await uploadResponse.json();
        if (uploadResult.paths && uploadResult.paths.length > 0) {
          mainImagePath = uploadResult.paths[0];
        }
      }

      if (additionalImageFiles.length > 0) {
        const formData = new FormData();
        additionalImageFiles.forEach((file) => {
          formData.append('files', file);
        });

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Ошибка при загрузке дополнительных изображений');
        }

        const uploadResult = await uploadResponse.json();
        if (uploadResult.paths && uploadResult.paths.length > 0) {
          additionalImagePaths.push(...uploadResult.paths);
        }
      }

      const amenitiesArray = Array.isArray(data.amenities) 
        ? data.amenities 
        : String(data.amenities).split(',').map(s => s.trim()).filter(Boolean);

      if (!mainImagePath && additionalImagePaths.length > 0) {
        mainImagePath = additionalImagePaths[0];
        additionalImagePaths.shift();
      }

      if (room && !mainImagePath && !mainImageFile) {
        mainImagePath = room.imageUrl;
      }

      if (room && additionalImageFiles.length === 0 && data.imageUrls) {
        const existingUrls = room.imageUrls || [];
        const urlArray = String(data.imageUrls).split(',').map(s => s.trim()).filter(Boolean);
        additionalImagePaths = [...existingUrls, ...urlArray];
      } else if (room && additionalImageFiles.length === 0 && !data.imageUrls) {
        additionalImagePaths = room.imageUrls || [];
      }
        
      onSubmit({ 
        name: data.name,
        description: data.description,
        price: data.price,
        capacity: data.capacity,
        amenities: amenitiesArray,
        imageUrl: mainImagePath || (room?.imageUrl || ''),
        imageUrls: additionalImagePaths,
        imageHint: data.imageHint || ''
      }, room?.id);

      setMainImageFile(null);
      setAdditionalImageFiles([]);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : 'Ошибка при загрузке изображений',
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  });

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[525px] overflow-y-auto bg-gradient-to-br from-white via-sky-50/20 to-white border-l border-slate-200/50 shadow-gentle">
        <SheetHeader className="pb-4 border-b border-slate-100/50">
          <SheetTitle className="text-2xl font-bold text-slate-900">
            {room ? "Редактировать номер" : "Создать новый номер"}
          </SheetTitle>
          <SheetDescription className="text-slate-500 font-light mt-1">
            {room ? "Внесите изменения в подробную информацию о номере." : "Заполните необходимые детали нового номера для гостей."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleFormSubmit} className="grid gap-5 py-5 text-slate-800">
            <div className="grid gap-2">
                 <Label htmlFor="name" className="font-bold text-slate-700">Название</Label>
                 <Input id="name" {...form.register("name")} className="bg-white border-slate-200 text-slate-900 rounded-xl focus:ring-primary shadow-sm h-11" />
                 {form.formState.errors.name && <p className="text-xs text-rose-500">{form.formState.errors.name.message}</p>}
             </div>
            <div className="grid gap-2">
                 <Label htmlFor="description" className="font-bold text-slate-700">Описание</Label>
                 <Textarea id="description" {...form.register("description")} className="bg-white border-slate-200 text-slate-900 rounded-xl focus:ring-primary shadow-sm min-h-[100px] font-light leading-relaxed" />
                 {form.formState.errors.description && <p className="text-xs text-rose-500">{form.formState.errors.description.message}</p>}
             </div>
            <div className="grid grid-cols-2 gap-4">
                 <div className="grid gap-2">
                     <Label htmlFor="price" className="font-bold text-slate-700">Цена (грн)</Label>
                     <Input id="price" type="number" {...form.register("price")} className="bg-white border-slate-200 text-slate-900 rounded-xl focus:ring-primary shadow-sm h-11" />
                     {form.formState.errors.price && <p className="text-xs text-rose-500">{form.formState.errors.price.message}</p>}
                 </div>
                 <div className="grid gap-2">
                     <Label htmlFor="capacity" className="font-bold text-slate-700">Вместимость (гостей)</Label>
                     <Input id="capacity" type="number" {...form.register("capacity")} className="bg-white border-slate-200 text-slate-900 rounded-xl focus:ring-primary shadow-sm h-11" />
                     {form.formState.errors.capacity && <p className="text-xs text-rose-500">{form.formState.errors.capacity.message}</p>}
                 </div>
             </div>
            <div className="grid gap-2">
                 <Label htmlFor="amenities" className="font-bold text-slate-700">Удобства (через запятую)</Label>
                 <Input id="amenities" {...form.register("amenities")} className="bg-white border-slate-200 text-slate-900 rounded-xl focus:ring-primary shadow-sm h-11" />
                 {form.formState.errors.amenities && <p className="text-xs text-rose-500">{form.formState.errors.amenities.message}</p>}
             </div>
            <div className="grid gap-2 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                 <Label htmlFor="mainImage" className="font-bold text-slate-700">Основное изображение</Label>
                 <Input 
                   id="mainImage" 
                   type="file" 
                   accept="image/*"
                   onChange={(e) => {
                     const file = e.target.files?.[0];
                     if (file) {
                       setMainImageFile(file);
                       form.setValue("imageUrl", "");
                     }
                   }}
                   className="bg-white border-slate-200 text-slate-900 rounded-xl shadow-sm cursor-pointer file:bg-slate-50 file:border-r file:border-slate-200 file:text-slate-700 hover:file:bg-slate-100"
                 />
                 {mainImageFile && (
                   <p className="text-xs text-slate-500">
                     Выбран: {mainImageFile.name}
                   </p>
                 )}
                 {room?.imageUrl && !mainImageFile && (
                   <p className="text-xs text-slate-500 truncate">
                     Текущее: {room.imageUrl}
                   </p>
                 )}
                 <div className="text-xs text-slate-500 mt-2">
                   Или укажите прямую ссылку:
                   <Input 
                     type="text" 
                     placeholder="https://..."
                     className="mt-1.5 bg-white border-slate-200 text-slate-900 rounded-xl focus:ring-primary shadow-sm h-10"
                     {...form.register("imageUrl")} 
                   />
                 </div>
                 {form.formState.errors.imageUrl && <p className="text-xs text-rose-500">{form.formState.errors.imageUrl.message}</p>}
             </div>
            <div className="grid gap-2 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                 <Label htmlFor="additionalImages" className="font-bold text-slate-700">Дополнительные изображения</Label>
                 <Input 
                   id="additionalImages" 
                   type="file" 
                   accept="image/*"
                   multiple
                   onChange={(e) => {
                     const files = Array.from(e.target.files || []);
                     if (files.length > 0) {
                       setAdditionalImageFiles(files);
                       form.setValue("imageUrls", "");
                     }
                   }}
                   className="bg-white border-slate-200 text-slate-900 rounded-xl shadow-sm cursor-pointer file:bg-slate-50 file:border-r file:border-slate-200 file:text-slate-700 hover:file:bg-slate-100"
                 />
                 {additionalImageFiles.length > 0 && (
                   <div className="text-xs text-slate-500 mt-1">
                     Выбрано файлов: {additionalImageFiles.length}
                     <ul className="list-disc list-inside mt-1">
                       {additionalImageFiles.map((file, idx) => (
                         <li key={idx} className="truncate">{file.name}</li>
                       ))}
                     </ul>
                   </div>
                 )}
                 {room?.imageUrls && room.imageUrls.length > 0 && additionalImageFiles.length === 0 && (
                   <div className="text-xs text-slate-500 mt-1">
                     Текущие дополнительные: {room.imageUrls.length} шт.
                   </div>
                 )}
                 <div className="text-xs text-slate-500 mt-2">
                   Или укажите прямые ссылки (через запятую):
                   <Textarea 
                     placeholder="ссылка_1, ссылка_2, ..."
                     className="mt-1.5 bg-white border-slate-200 text-slate-900 rounded-xl focus:ring-primary shadow-sm min-h-[60px]"
                     rows={2}
                     {...form.register("imageUrls")} 
                   />
                 </div>
                 {form.formState.errors.imageUrls && <p className="text-xs text-rose-500">{form.formState.errors.imageUrls.message}</p>}
             </div>
            <div className="grid gap-2">
                 <Label htmlFor="imageHint" className="font-bold text-slate-700">Подсказка для AI (1-2 слова)</Label>
                 <Input id="imageHint" {...form.register("imageHint")} className="bg-white border-slate-200 text-slate-900 rounded-xl focus:ring-primary shadow-sm h-11" />
                 {form.formState.errors.imageHint && <p className="text-xs text-rose-500">{form.formState.errors.imageHint.message}</p>}
             </div>
 
              <SheetFooter className="mt-6 border-t border-slate-100/50 pt-4 gap-2">
                 <SheetClose asChild>
                     <Button type="button" variant="outline" disabled={isUploading} className="rounded-xl border-slate-200">Отмена</Button>
                 </SheetClose>
                 <Button type="submit" disabled={isUploading} className="gradient-ocean text-white font-bold border-0 shadow-md rounded-xl px-5 h-11">
                   {isUploading ? "Сохранение..." : "Сохранить номер"}
                 </Button>
             </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
