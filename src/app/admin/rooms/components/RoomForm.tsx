
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

      // Загружаем основное изображение, если есть файл
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

      // Загружаем дополнительные изображения, если есть файлы
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

      // Если нет основного изображения (ни файла, ни URL), используем первое дополнительное
      if (!mainImagePath && additionalImagePaths.length > 0) {
        mainImagePath = additionalImagePaths[0];
        additionalImagePaths.shift();
      }

      // При редактировании, если не загружали новое изображение, используем существующее
      if (room && !mainImagePath && !mainImageFile) {
        mainImagePath = room.imageUrl;
      }

      // При редактировании, если не загружали новые дополнительные изображения, объединяем существующие с новыми URL
      if (room && additionalImageFiles.length === 0 && data.imageUrls) {
        // Если указали URL, используем их вместе с существующими
        const existingUrls = room.imageUrls || [];
        const urlArray = String(data.imageUrls).split(',').map(s => s.trim()).filter(Boolean);
        additionalImagePaths = [...existingUrls, ...urlArray];
      } else if (room && additionalImageFiles.length === 0 && !data.imageUrls) {
        // Если ничего не указали, оставляем существующие
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

      // Сброс файлов после успешной отправки
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
      <SheetContent className="sm:max-w-[525px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{room ? "Редактировать номер" : "Создать новый номер"}</SheetTitle>
          <SheetDescription>
            {room ? "Внесите изменения в информацию о номере." : "Заполните детали нового номера."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
           <div className="grid gap-2">
                <Label htmlFor="name">Название</Label>
                <Input id="name" {...form.register("name")} />
                {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea id="description" {...form.register("description")} />
                {form.formState.errors.description && <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="price">Цена (грн)</Label>
                    <Input id="price" type="number" {...form.register("price")} />
                    {form.formState.errors.price && <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="capacity">Вместимость</Label>
                    <Input id="capacity" type="number" {...form.register("capacity")} />
                    {form.formState.errors.capacity && <p className="text-sm text-destructive">{form.formState.errors.capacity.message}</p>}
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="amenities">Удобства (через запятую)</Label>
                <Input id="amenities" {...form.register("amenities")} />
                {form.formState.errors.amenities && <p className="text-sm text-destructive">{form.formState.errors.amenities.message}</p>}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="mainImage">Основное изображение</Label>
                <Input 
                  id="mainImage" 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setMainImageFile(file);
                      // Также можно указать URL для обратной совместимости
                      form.setValue("imageUrl", "");
                    }
                  }}
                />
                {mainImageFile && (
                  <p className="text-sm text-muted-foreground">
                    Выбран: {mainImageFile.name}
                  </p>
                )}
                {room?.imageUrl && !mainImageFile && (
                  <p className="text-sm text-muted-foreground">
                    Текущее изображение: {room.imageUrl}
                  </p>
                )}
                <div className="text-xs text-muted-foreground">
                  Можно также указать URL:{" "}
                  <Input 
                    type="text" 
                    placeholder="URL изображения (опционально)"
                    className="mt-1"
                    {...form.register("imageUrl")} 
                  />
                </div>
                {form.formState.errors.imageUrl && <p className="text-sm text-destructive">{form.formState.errors.imageUrl.message}</p>}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="additionalImages">Дополнительные изображения</Label>
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
                />
                {additionalImageFiles.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Выбрано файлов: {additionalImageFiles.length}
                    <ul className="list-disc list-inside mt-1">
                      {additionalImageFiles.map((file, idx) => (
                        <li key={idx}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {room?.imageUrls && room.imageUrls.length > 0 && additionalImageFiles.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    Текущие дополнительные изображения: {room.imageUrls.length}
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  Можно также указать URL через запятую:{" "}
                  <Textarea 
                    placeholder="URL изображений через запятую (опционально)"
                    className="mt-1"
                    rows={2}
                    {...form.register("imageUrls")} 
                  />
                </div>
                {form.formState.errors.imageUrls && <p className="text-sm text-destructive">{form.formState.errors.imageUrls.message}</p>}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="imageHint">Подсказка для AI (1-2 слова)</Label>
                <Input id="imageHint" {...form.register("imageHint")} />
                {form.formState.errors.imageHint && <p className="text-sm text-destructive">{form.formState.errors.imageHint.message}</p>}
            </div>

             <SheetFooter className="mt-4">
                <SheetClose asChild>
                    <Button type="button" variant="outline" disabled={isUploading}>Отмена</Button>
                </SheetClose>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? "Загрузка..." : "Сохранить"}
                </Button>
            </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
