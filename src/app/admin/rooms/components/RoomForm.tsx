
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  amenities: z.string().transform(val => val.split(',').map(s => s.trim())),
  imageUrl: z.string().url("Неверный URL изображения"),
  imageHint: z.string().optional(),
});

type RoomFormValues = Omit<Room, 'id'>;

interface RoomFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (values: RoomFormValues, id?: string) => void;
  room: Room | null;
}

export default function RoomForm({ isOpen, onOpenChange, onSubmit, room }: RoomFormProps) {
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
        name: '',
        description: '',
        price: 0,
        capacity: 1,
        amenities: [],
        imageUrl: '',
        imageHint: ''
    }
  });

  useEffect(() => {
    if (room) {
      form.reset({
          ...room,
          amenities: room.amenities.join(', ')
      });
    } else {
      form.reset({
        name: '',
        description: '',
        price: 0,
        capacity: 1,
        amenities: [],
        imageUrl: '',
        imageHint: ''
      });
    }
  }, [room, form, isOpen]);

  const handleFormSubmit = form.handleSubmit((data) => {
    const amenitiesArray = Array.isArray(data.amenities) 
      ? data.amenities 
      : String(data.amenities).split(',').map(s => s.trim()).filter(Boolean);
      
    onSubmit({ ...data, amenities: amenitiesArray }, room?.id);
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
                <Label htmlFor="imageUrl">URL изображения</Label>
                <Input id="imageUrl" {...form.register("imageUrl")} />
                {form.formState.errors.imageUrl && <p className="text-sm text-destructive">{form.formState.errors.imageUrl.message}</p>}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="imageHint">Подсказка для AI (1-2 слова)</Label>
                <Input id="imageHint" {...form.register("imageHint")} />
                {form.formState.errors.imageHint && <p className="text-sm text-destructive">{form.formState.errors.imageHint.message}</p>}
            </div>

             <SheetFooter className="mt-4">
                <SheetClose asChild>
                    <Button type="button" variant="outline">Отмена</Button>
                </SheetClose>
                <Button type="submit">Сохранить</Button>
            </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
