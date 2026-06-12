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
import type { BlogPost } from "@/lib/types";

const blogPostSchema = z.object({
  slug: z.string().min(1, "Слаг обязателен"),
  date: z.string().min(1, "Дата обязательна"),
  imageUrl: z.string().optional(),
  readTime: z.coerce.number().min(1, "Время чтения должно быть не менее 1 мин"),
  categoryRu: z.string().min(1, "Категория на русском обязательна"),
  categoryUk: z.string().min(1, "Категория на украинском обязательна"),
  categoryEn: z.string().min(1, "Категория на английском обязательна"),
  titleRu: z.string().min(1, "Заголовок на русском обязателен"),
  titleUk: z.string().min(1, "Заголовок на украинском обязателен"),
  titleEn: z.string().min(1, "Заголовок на английском обязателен"),
  excerptRu: z.string().min(1, "Краткое описание на русском обязательно"),
  excerptUk: z.string().min(1, "Краткое описание на украинском обязательно"),
  excerptEn: z.string().min(1, "Краткое описание на английском обязательно"),
  contentRu: z.string().min(1, "Содержимое на русском обязательно"),
  contentUk: z.string().min(1, "Содержимое на украинском обязательно"),
  contentEn: z.string().min(1, "Содержимое на английском обязательно"),
});

type BlogPostFormValues = {
  slug: string;
  date: string;
  imageUrl?: string;
  readTime: number;
  categoryRu: string;
  categoryUk: string;
  categoryEn: string;
  titleRu: string;
  titleUk: string;
  titleEn: string;
  excerptRu: string;
  excerptUk: string;
  excerptEn: string;
  contentRu: string;
  contentUk: string;
  contentEn: string;
};

interface BlogPostFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (values: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>, id?: string) => void;
  post: BlogPost | null;
}

export default function BlogForm({ isOpen, onOpenChange, onSubmit, post }: BlogPostFormProps) {
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      slug: "",
      date: new Date().toISOString().split("T")[0],
      imageUrl: "",
      readTime: 5,
      categoryRu: "",
      categoryUk: "",
      categoryEn: "",
      titleRu: "",
      titleUk: "",
      titleEn: "",
      excerptRu: "",
      excerptUk: "",
      excerptEn: "",
      contentRu: "",
      contentUk: "",
      contentEn: "",
    }
  });

  useEffect(() => {
    if (post) {
      form.reset({
        slug: post.slug,
        date: post.date,
        imageUrl: post.imageUrl,
        readTime: post.readTime,
        categoryRu: post.categoryRu,
        categoryUk: post.categoryUk,
        categoryEn: post.categoryEn,
        titleRu: post.titleRu,
        titleUk: post.titleUk,
        titleEn: post.titleEn,
        excerptRu: post.excerptRu,
        excerptUk: post.excerptUk,
        excerptEn: post.excerptEn,
        contentRu: post.contentRu.join("\n\n"),
        contentUk: post.contentUk.join("\n\n"),
        contentEn: post.contentEn.join("\n\n"),
      });
      setImageFile(null);
    } else {
      form.reset({
        slug: "",
        date: new Date().toISOString().split("T")[0],
        imageUrl: "",
        readTime: 5,
        categoryRu: "",
        categoryUk: "",
        categoryEn: "",
        titleRu: "",
        titleUk: "",
        titleEn: "",
        excerptRu: "",
        excerptUk: "",
        excerptEn: "",
        contentRu: "",
        contentUk: "",
        contentEn: "",
      });
      setImageFile(null);
    }
  }, [post, form, isOpen]);

  const handleFormSubmit = form.handleSubmit(async (data) => {
    setIsUploading(true);
    try {
      let imagePath = data.imageUrl || "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("files", imageFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Ошибка при загрузке изображения");
        }

        const uploadResult = await uploadResponse.json();
        if (uploadResult.paths && uploadResult.paths.length > 0) {
          imagePath = uploadResult.paths[0];
        }
      }

      // Convert double newlines into array of paragraphs
      const parseContent = (text: string) => {
        return text
          .split("\n")
          .map((p) => p.trim())
          .filter(Boolean);
      };

      onSubmit({
        slug: data.slug,
        date: data.date,
        imageUrl: imagePath || (post?.imageUrl || ""),
        readTime: data.readTime,
        categoryRu: data.categoryRu,
        categoryUk: data.categoryUk,
        categoryEn: data.categoryEn,
        titleRu: data.titleRu,
        titleUk: data.titleUk,
        titleEn: data.titleEn,
        excerptRu: data.excerptRu,
        excerptUk: data.excerptUk,
        excerptEn: data.excerptEn,
        contentRu: parseContent(data.contentRu),
        contentUk: parseContent(data.contentUk),
        contentEn: parseContent(data.contentEn),
        views: post?.views || 0,
        likes: post?.likes || 0,
      }, post?.id);

      setImageFile(null);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Ошибка при загрузке изображения",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  });

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[650px] overflow-y-auto bg-slate-950 border-l border-white/10 shadow-2xl text-slate-100">
        <SheetHeader className="pb-4 border-b border-white/10">
          <SheetTitle className="text-2xl font-bold text-white">
            {post ? "Редактировать статью" : "Создать новую статью"}
          </SheetTitle>
          <SheetDescription className="text-slate-400 font-light mt-1">
            {post ? "Внесите изменения в статью." : "Заполните необходимые детали новой статьи блога."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleFormSubmit} className="grid gap-5 py-5 text-slate-200">
          
          {/* Main Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="slug" className="font-semibold text-slate-300">Слаг URL (например, my-post-slug)</Label>
              <Input id="slug" {...form.register("slug")} className="bg-slate-900 border-white/10 text-white rounded-xl focus:ring-teal-500 h-11" />
              {form.formState.errors.slug && <p className="text-xs text-rose-500">{form.formState.errors.slug.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date" className="font-semibold text-slate-300">Дата публикации</Label>
              <Input id="date" type="date" {...form.register("date")} className="bg-slate-900 border-white/10 text-white rounded-xl focus:ring-teal-500 h-11" />
              {form.formState.errors.date && <p className="text-xs text-rose-500">{form.formState.errors.date.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="readTime" className="font-semibold text-slate-300">Время чтения (минут)</Label>
              <Input id="readTime" type="number" {...form.register("readTime")} className="bg-slate-900 border-white/10 text-white rounded-xl focus:ring-teal-500 h-11" />
              {form.formState.errors.readTime && <p className="text-xs text-rose-500">{form.formState.errors.readTime.message}</p>}
            </div>
          </div>

          {/* image */}
          <div className="grid gap-2 bg-slate-900/40 p-4 rounded-2xl border border-white/10">
            <Label htmlFor="image" className="font-semibold text-slate-300">Обложка статьи</Label>
            <Input 
              id="image" 
              type="file" 
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  form.setValue("imageUrl", "");
                }
              }}
              className="bg-slate-900 border-white/10 text-white rounded-xl cursor-pointer file:bg-slate-800 file:border-r file:border-white/10 file:text-slate-300"
            />
            {imageFile && <p className="text-xs text-slate-400">Выбран: {imageFile.name}</p>}
            {post?.imageUrl && !imageFile && <p className="text-xs text-slate-400 truncate">Текущее: {post.imageUrl}</p>}
            <div className="text-xs text-slate-400 mt-2">
              Или укажите прямую ссылку:
              <Input 
                type="text" 
                placeholder="https://..."
                className="mt-1.5 bg-slate-900 border-white/10 text-white rounded-xl h-10"
                {...form.register("imageUrl")} 
              />
            </div>
          </div>

          <hr className="border-white/10" />

          {/* Languages Tabs - Russian */}
          <div className="space-y-4 p-4 bg-slate-900/20 border border-white/5 rounded-2xl">
            <h3 className="font-bold text-teal-300 uppercase tracking-widest text-xs">Русская версия (RU)</h3>
            
            <div className="grid gap-2">
              <Label className="text-xs text-slate-300">Категория</Label>
              <Input {...form.register("categoryRu")} className="bg-slate-900 border-white/10 text-white rounded-xl h-10" />
              {form.formState.errors.categoryRu && <p className="text-xs text-rose-500">{form.formState.errors.categoryRu.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label className="text-xs text-slate-300">Заголовок</Label>
              <Input {...form.register("titleRu")} className="bg-slate-900 border-white/10 text-white rounded-xl h-10" />
              {form.formState.errors.titleRu && <p className="text-xs text-rose-500">{form.formState.errors.titleRu.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label className="text-xs text-slate-300">Краткое описание (для превью)</Label>
              <Textarea {...form.register("excerptRu")} className="bg-slate-900 border-white/10 text-white rounded-xl min-h-[60px]" />
              {form.formState.errors.excerptRu && <p className="text-xs text-rose-500">{form.formState.errors.excerptRu.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label className="text-xs text-slate-300">Содержимое статьи (абзацы разделяйте пустой строкой)</Label>
              <Textarea {...form.register("contentRu")} rows={6} className="bg-slate-900 border-white/10 text-white rounded-xl min-h-[150px]" />
              {form.formState.errors.contentRu && <p className="text-xs text-rose-500">{form.formState.errors.contentRu.message}</p>}
            </div>
          </div>

          {/* Languages Tabs - Ukrainian */}
          <div className="space-y-4 p-4 bg-slate-900/20 border border-white/5 rounded-2xl">
            <h3 className="font-bold text-sky-300 uppercase tracking-widest text-xs">Украинская версия (UK)</h3>
            
            <div className="grid gap-2">
              <Label className="text-xs text-slate-300">Категорія</Label>
              <Input {...form.register("categoryUk")} className="bg-slate-900 border-white/10 text-white rounded-xl h-10" />
              {form.formState.errors.categoryUk && <p className="text-xs text-rose-500">{form.formState.errors.categoryUk.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label className="text-xs text-slate-300">Заголовок</Label>
              <Input {...form.register("titleUk")} className="bg-slate-900 border-white/10 text-white rounded-xl h-10" />
              {form.formState.errors.titleUk && <p className="text-xs text-rose-500">{form.formState.errors.titleUk.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label className="text-xs text-slate-300">Короткий опис (для прев'ю)</Label>
              <Textarea {...form.register("excerptUk")} className="bg-slate-900 border-white/10 text-white rounded-xl min-h-[60px]" />
              {form.formState.errors.excerptUk && <p className="text-xs text-rose-500">{form.formState.errors.excerptUk.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label className="text-xs text-slate-300">Вміст статті (абзаци розділяйте порожнім рядком)</Label>
              <Textarea {...form.register("contentUk")} rows={6} className="bg-slate-900 border-white/10 text-white rounded-xl min-h-[150px]" />
              {form.formState.errors.contentUk && <p className="text-xs text-rose-500">{form.formState.errors.contentUk.message}</p>}
            </div>
          </div>

          {/* Languages Tabs - English */}
          <div className="space-y-4 p-4 bg-slate-900/20 border border-white/5 rounded-2xl">
            <h3 className="font-bold text-amber-300 uppercase tracking-widest text-xs">Английская версия (EN)</h3>
            
            <div className="grid gap-2">
              <Label className="text-xs text-slate-300">Category</Label>
              <Input {...form.register("categoryEn")} className="bg-slate-900 border-white/10 text-white rounded-xl h-10" />
              {form.formState.errors.categoryEn && <p className="text-xs text-rose-500">{form.formState.errors.categoryEn.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label className="text-xs text-slate-300">Title</Label>
              <Input {...form.register("titleEn")} className="bg-slate-900 border-white/10 text-white rounded-xl h-10" />
              {form.formState.errors.titleEn && <p className="text-xs text-rose-500">{form.formState.errors.titleEn.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label className="text-xs text-slate-300">Excerpt (for preview)</Label>
              <Textarea {...form.register("excerptEn")} className="bg-slate-900 border-white/10 text-white rounded-xl min-h-[60px]" />
              {form.formState.errors.excerptEn && <p className="text-xs text-rose-500">{form.formState.errors.excerptEn.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label className="text-xs text-slate-300">Article Content (split paragraphs with blank line)</Label>
              <Textarea {...form.register("contentEn")} rows={6} className="bg-slate-900 border-white/10 text-white rounded-xl min-h-[150px]" />
              {form.formState.errors.contentEn && <p className="text-xs text-rose-500">{form.formState.errors.contentEn.message}</p>}
            </div>
          </div>

          <SheetFooter className="mt-6 border-t border-white/10 pt-4 gap-2">
            <SheetClose asChild>
              <Button type="button" variant="outline" disabled={isUploading} className="rounded-xl border-white/10 text-slate-300 hover:bg-white/5 h-11">
                Отмена
              </Button>
            </SheetClose>
            <Button type="submit" disabled={isUploading} className="bg-gradient-to-r from-teal-400 to-sky-500 hover:from-teal-300 hover:to-sky-400 text-slate-950 font-bold border-0 shadow-lg shadow-teal-500/20 rounded-xl px-5 h-11">
              {isUploading ? "Сохранение..." : "Сохранить статью"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
