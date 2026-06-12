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
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";

interface BlogAdminClientProps {
  initialData: BlogPost[];
}

export default function BlogAdminClient({ initialData }: BlogAdminClientProps) {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState<BlogPost | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [postIdToDelete, setPostIdToDelete] = React.useState<string | null>(null);
  const [deletingIds, setDeletingIds] = React.useState<string[]>([]);
  const { toast } = useToast();

  // RTK Query hooks with initial data
  const { data: posts = initialData, isLoading, error } = useGetBlogPostsQuery();
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

  const handleDelete = (postId: string) => {
    setPostIdToDelete(postId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!postIdToDelete) return;
    const postId = postIdToDelete;
    const rowEl = document.getElementById(`row-${postId}`);
    
    const performDelete = async () => {
      setDeletingIds((prev) => [...prev, postId]);
      try {
        await deletePost(postId).unwrap();
        toast({
          title: "Успешно",
          description: "Статья удалена",
        });
      } catch (error) {
        setDeletingIds((prev) => prev.filter((id) => id !== postId));
        toast({
          title: "Ошибка",
          description: error instanceof Error ? error.message : "Не удалось удалить статью",
          variant: "destructive",
        });
      }
    };

    if (rowEl) {
      const { thanosSnap } = await import("@/lib/thanos");
      thanosSnap(rowEl, performDelete);
    } else {
      performDelete();
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    const performDelete = async () => {
      setDeletingIds((prev) => [...prev, ...ids]);
      try {
        await Promise.all(ids.map((id) => deletePost(id).unwrap()));
        toast({
          title: "Успешно",
          description: "Выбранные статьи удалены",
        });
      } catch (error) {
        setDeletingIds((prev) => prev.filter((id) => !ids.includes(id)));
        toast({
          title: "Ошибка",
          description: error instanceof Error ? error.message : "Не удалось удалить некоторые статьи",
          variant: "destructive",
        });
      }
    };

    const rowEls = ids.map((id) => document.getElementById(`row-${id}`)).filter(Boolean) as HTMLElement[];
    if (rowEls.length > 0) {
      const { thanosSnap } = await import("@/lib/thanos");
      let snappedCount = 0;
      rowEls.forEach((el) => {
        thanosSnap(el, () => {
          snappedCount++;
          if (snappedCount === rowEls.length) {
            performDelete();
          }
        });
      });
    } else {
      performDelete();
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

  const visiblePosts = React.useMemo(() => {
    return posts.filter((post) => !deletingIds.includes(post.id));
  }, [posts, deletingIds]);

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-300">Загрузка...</p>
      </div>
    );
  }

  if (error && posts.length === 0) {
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
        data={visiblePosts} 
        onDeleteSelected={handleBulkDelete}
      />
      <BlogForm
        isOpen={sheetOpen}
        onOpenChange={setSheetOpen}
        onSubmit={handleFormSubmit}
        post={selectedPost}
      />
      <DeleteConfirmDialog
        isOpen={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleDeleteConfirm}
        title="Удалить статью?"
        description="Вы уверены, что хотите удалить эту статью? Она будет удалена безвозвратно."
      />
    </>
  );
}
