"use client";

import { useEffect, useState } from "react";
import { PhoneCall, Trash2, Calendar, User, MessageSquare, Loader2, Eye, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);

  // States for viewing callback request details
  const [viewRequest, setViewRequest] = useState<CallbackRequest | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast({
      title: "Скопировано",
      description: `Поле «${fieldName}» скопировано в буфер обмена`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

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
      setSelectedIds((prev) => prev.filter((x) => x !== id));
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

  const handleBulkDeleteConfirm = async () => {
    const ids = selectedIds;
    const rowEls = ids.map((id) => document.getElementById(`row-${id}`)).filter(Boolean) as HTMLElement[];

    const performDelete = async () => {
      setRequests((prev) => prev.filter((r) => !ids.includes(r.id)));
      setSelectedIds([]);
      try {
        await Promise.all(
          ids.map((id) =>
            fetch(`/api/callbacks/${id}`, {
              method: "DELETE",
            })
          )
        );
        toast({
          title: "Успешно",
          description: "Выбранные заявки успешно удалены",
        });
      } catch (error) {
        fetchRequests();
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось удалить некоторые заявки",
        });
      }
    };

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
    setBulkDeleteConfirmOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <PhoneCall className="h-7 w-7 text-teal-400" />
            Заявки на обратный звонок
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Просматривайте запросы гостей на обратную связь и звонки
          </p>
        </div>

        {selectedIds.length > 0 && (
          <Button
            onClick={() => setBulkDeleteConfirmOpen(true)}
            className="bg-gradient-to-r from-rose-500 to-red-650 hover:from-rose-400 hover:to-red-500 text-white font-bold border-0 shadow-lg shadow-rose-500/20 rounded-xl px-5 h-11 self-start sm:self-auto"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Удалить выбранные ({selectedIds.length})
          </Button>
        )}
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
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-slate-950/50 text-slate-300 text-xs font-bold uppercase tracking-wider">
                  <th className="p-2 sm:p-4 pl-3 sm:pl-6 sticky left-0 bg-slate-950/90 z-20 border-r border-white/5 shadow-[2px_0_5px_rgba(0,0,0,0.3)] w-8 sm:w-12">
                    <Checkbox
                      checked={
                        requests.length > 0 &&
                        selectedIds.length === requests.length
                      }
                      onCheckedChange={(value) => {
                        if (value) {
                          setSelectedIds(requests.map((r) => r.id));
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                      className="border-white/20 text-white data-[state=checked]:bg-teal-500 data-[state=checked]:text-slate-950"
                    />
                  </th>
                  <th className="p-2 sm:p-4">Дата</th>
                  <th className="p-2 sm:p-4">Имя</th>
                  <th className="p-2 sm:p-4 hidden sm:table-cell">Телефон</th>
                  <th className="p-2 sm:p-4 hidden md:table-cell">Сообщение</th>
                  <th className="p-2 sm:p-4 pr-3 sm:pr-6 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {requests.map((request) => (
                  <tr
                    key={request.id}
                    id={`row-${request.id}`}
                    className="group hover:bg-white/5 transition-colors"
                  >
                    <td className="p-2 sm:p-4 pl-3 sm:pl-6 sticky left-0 bg-slate-900 group-hover:bg-slate-800/95 z-10 border-r border-white/5 shadow-[2px_0_5px_rgba(0,0,0,0.3)] transition-colors">
                      <Checkbox
                        checked={selectedIds.includes(request.id)}
                        onCheckedChange={(value) => {
                          if (value) {
                            setSelectedIds((prev) => [...prev, request.id]);
                          } else {
                            setSelectedIds((prev) =>
                              prev.filter((id) => id !== request.id)
                            );
                          }
                        }}
                        className="border-white/20 text-white data-[state=checked]:bg-teal-500 data-[state=checked]:text-slate-950"
                      />
                    </td>
                    <td className="p-2 sm:p-4 text-slate-400 whitespace-nowrap">
                      <span className="flex items-center gap-1 sm:gap-2 text-xs">
                        <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-teal-400 shrink-0" />
                        <span className="hidden sm:inline">{new Date(request.createdAt).toLocaleString("ru-RU", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}</span>
                        <span className="sm:hidden">{new Date(request.createdAt).toLocaleString("ru-RU", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}</span>
                      </span>
                    </td>
                    <td className="p-2 sm:p-4 font-semibold text-white">
                      <span className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                        <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-sky-400 shrink-0" />
                        <span className="truncate">{request.name}</span>
                      </span>
                    </td>
                    <td className="p-2 sm:p-4 font-mono text-teal-300 hidden sm:table-cell whitespace-nowrap">
                      {request.phone}
                    </td>
                    <td className="p-2 sm:p-4 max-w-xs truncate text-slate-300 hidden md:table-cell">
                      {request.message ? (
                        <span className="flex items-center gap-1 sm:gap-1.5" title={request.message}>
                          <MessageSquare className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">{request.message}</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">—</span>
                      )}
                    </td>
                    <td className="p-2 sm:p-4 pr-3 sm:pr-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setViewRequest(request)}
                          className="text-slate-300 hover:text-teal-400 hover:bg-teal-500/10 rounded-xl transition-all h-8 w-8"
                          title="Просмотреть заявку"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(request.id)}
                          className="text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all h-8 w-8"
                          title="Удалить заявку"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
      <DeleteConfirmDialog
        isOpen={bulkDeleteConfirmOpen}
        onOpenChange={setBulkDeleteConfirmOpen}
        onConfirm={handleBulkDeleteConfirm}
        title="Удалить выбранные заявки?"
        description={`Вы действительно хотите удалить выбранные заявки (${selectedIds.length} шт.)? Это действие необратимо.`}
      />

      <Dialog open={!!viewRequest} onOpenChange={(open) => !open && setViewRequest(null)}>
        <DialogContent className="bg-slate-900 border border-white/10 text-white rounded-2xl max-w-md shadow-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold flex items-center gap-2 text-teal-300">
              <Eye className="h-5 w-5 text-teal-400" />
              Детали заявки
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Нажмите на любое поле ниже, чтобы скопировать его значение в буфер обмена.
            </DialogDescription>
          </DialogHeader>
          {viewRequest && (
            <div className="space-y-4 mt-4">
              <div 
                onClick={() => handleCopy(new Date(viewRequest.createdAt).toLocaleString("ru-RU"), "Дата")}
                className="group/item flex flex-col p-2.5 rounded-xl bg-slate-950/40 border border-white/5 hover:border-teal-500/30 hover:bg-teal-500/5 cursor-pointer transition-all duration-200"
              >
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Дата создания</span>
                <span className="text-sm font-medium mt-0.5 text-white flex justify-between items-center">
                  {new Date(viewRequest.createdAt).toLocaleString("ru-RU")}
                  {copiedField === "Дата" ? (
                    <Check className="h-3.5 w-3.5 text-teal-400 font-bold" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-slate-500 group-hover/item:text-teal-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                  )}
                </span>
              </div>

              <div 
                onClick={() => handleCopy(viewRequest.name, "Имя")}
                className="group/item flex flex-col p-2.5 rounded-xl bg-slate-950/40 border border-white/5 hover:border-teal-500/30 hover:bg-teal-500/5 cursor-pointer transition-all duration-200"
              >
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Имя клиента</span>
                <span className="text-sm font-medium mt-0.5 text-white flex justify-between items-center">
                  {viewRequest.name}
                  {copiedField === "Имя" ? (
                    <Check className="h-3.5 w-3.5 text-teal-400 font-bold" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-slate-500 group-hover/item:text-teal-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                  )}
                </span>
              </div>

              <div 
                onClick={() => handleCopy(viewRequest.phone, "Телефон")}
                className="group/item flex flex-col p-2.5 rounded-xl bg-slate-950/40 border border-white/5 hover:border-teal-500/30 hover:bg-teal-500/5 cursor-pointer transition-all duration-200"
              >
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Номер телефона</span>
                <span className="text-sm font-medium mt-0.5 text-teal-350 font-mono flex justify-between items-center">
                  {viewRequest.phone}
                  {copiedField === "Телефон" ? (
                    <Check className="h-3.5 w-3.5 text-teal-400 font-bold" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-slate-500 group-hover/item:text-teal-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                  )}
                </span>
              </div>

              <div 
                onClick={() => handleCopy(viewRequest.message || "", "Сообщение")}
                className="group/item flex flex-col p-2.5 rounded-xl bg-slate-950/40 border border-white/5 hover:border-teal-500/30 hover:bg-teal-500/5 cursor-pointer transition-all duration-200"
              >
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Сообщение / Комментарий</span>
                <span className="text-sm font-medium mt-0.5 text-white flex justify-between items-start">
                  <span className="break-words max-w-[90%] whitespace-pre-wrap">{viewRequest.message || "—"}</span>
                  {copiedField === "Сообщение" ? (
                    <Check className="h-3.5 w-3.5 text-teal-400 shrink-0 font-bold" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-slate-500 group-hover/item:text-teal-400 opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0" />
                  )}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

