"use client";

import { useEffect, useState } from "react";
import { PhoneCall, Trash2, Calendar, User, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";

interface CallbackRequest {
  id: string;
  name: string;
  phone: string;
  message: string | null;
  createdAt: string;
}

interface CallbacksAdminClientProps {
  initialData: CallbackRequest[];
}

export default function CallbacksAdminClient({ initialData }: CallbacksAdminClientProps) {
  const [requests, setRequests] = useState<CallbackRequest[]>(initialData);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [requestIdToDelete, setRequestIdToDelete] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/callbacks");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось загрузить список заявок",
      });
    }
  };

  const handleDelete = (id: string) => {
    setRequestIdToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!requestIdToDelete) return;
    const id = requestIdToDelete;
    const rowEl = document.getElementById(`row-${id}`);

    const performDelete = async () => {
      setRequests((prev) => prev.filter((r) => r.id !== id));
      try {
        const res = await fetch(`/api/callbacks/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete");

        toast({
          title: "Успешно",
          description: "Заявка успешно удалена",
        });
      } catch (error) {
        fetchRequests();
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось удалить заявку",
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <PhoneCall className="h-7 w-7 text-teal-400" />
            Заявки на обратный звонок
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Просматривайте запросы гостей на обратную связь и звонки
          </p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-white/10 rounded-3xl bg-slate-900/40 text-center space-y-4">
          <div className="p-4 rounded-full bg-teal-500/10 text-teal-400">
            <PhoneCall className="h-10 w-10" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Заявок пока нет</h3>
            <p className="text-slate-400 text-sm mt-1">
              Все новые запросы от пользователей будут отображаться здесь
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-white/10 rounded-3xl overflow-hidden glass-card-dark shadow-2xl bg-slate-900/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-slate-950/50 text-slate-300 text-xs font-bold uppercase tracking-wider">
                  <th className="p-4 pl-6">Дата</th>
                  <th className="p-4">Имя</th>
                  <th className="p-4">Телефон</th>
                  <th className="p-4">Сообщение</th>
                  <th className="p-4 pr-6 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-slate-200">
                {requests.map((request) => (
                  <tr
                    key={request.id}
                    id={`row-${request.id}`}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 pl-6 text-slate-400">
                      <span className="flex items-center gap-2 text-xs">
                        <Calendar className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                        {new Date(request.createdAt).toLocaleString("ru-RU", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-white">
                      <span className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                        {request.name}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-teal-300">
                      {request.phone}
                    </td>
                    <td className="p-4 max-w-xs truncate text-slate-300">
                      {request.message ? (
                        <span className="flex items-center gap-1.5" title={request.message}>
                          <MessageSquare className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                          {request.message}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">—</span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(request.id)}
                        className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                        title="Удалить заявку"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <DeleteConfirmDialog
        isOpen={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleDeleteConfirm}
        title="Удалить заявку?"
        description="Вы уверены, что хотите удалить эту заявку на обратный звонок? Это действие необратимо."
      />
    </div>
  );
}
