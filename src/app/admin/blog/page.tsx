"use client";

import * as React from "react";
import type { BlogPost } from "@/lib/types";
import {
  useGetBlogPostsQuery,
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
} from "@/lib/api";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import BlogForm from "./components/BlogForm";
import { useToast } from "@/hooks/use-toast";

export default function BlogAdminPage() {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState<BlogPost | null>(null);
  const { toast } = useToast();

  // RTK Query hooks
  const { data: posts = [], isLoading, error } = useGetBlogPostsQuery();
  const [createPost, { isLoading: isCreating }] = useCreateBlogPostMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdateBlogPostMutation();
  const [deletePost] = useDeleteBlogPostMutation();

  const handleAddNew = () => {
    setSelectedPost(null);
    setSheetOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setSheetOpen(true);
  };

  const handleDelete = async (postId: string) => {
    try {
      await deletePost(postId).unwrap();
      toast({
        title: "Успешно",
        description: "Статья удалена",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось удалить статью",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (values: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>, id?: string) => {
    try {
      if (id) {
        // Update
        await updatePost({ id, data: values }).unwrap();
        toast({
          title: "Успешно",
          description: "Статья обновлена",
        });
      } else {
        // Create
        await createPost(values).unwrap();
        toast({
          title: "Успешно",
          description: "Статья создана",
        });
      }
      setSheetOpen(false);
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error?.data?.error || error?.message || "Не удалось сохранить статью",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-300">Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-destructive">
          Ошибка загрузки данных: {error instanceof Error ? error.message : 'Неизвестная ошибка'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between text-white bg-slate-950 mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Управление блогом</h1>
        <Button onClick={handleAddNew} disabled={isCreating || isUpdating} className="bg-gradient-to-r from-teal-400 to-sky-500 hover:from-teal-300 hover:to-sky-400 text-slate-950 font-bold border-0 shadow-lg shadow-teal-500/20 rounded-xl px-5 h-11">
          <PlusCircle className="mr-2 h-4 w-4" />
          Добавить статью
        </Button>
      </div>
      <DataTable 
        columns={columns({ onEdit: handleEdit, onDelete: handleDelete })} 
        data={posts} 
      />
      <BlogForm
        isOpen={sheetOpen}
        onOpenChange={setSheetOpen}
        onSubmit={handleFormSubmit}
        post={selectedPost}
      />
    </>
  );
}
