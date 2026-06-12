"use client";

import { useState } from "react";
import { Tag, Trash2, Calendar, Plus, Minus, Save, X, ToggleLeft, ToggleRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";

interface PromoCode {
  id: string;
  code: string;
  discount: number;
  isActive: boolean;
  createdAt: string;
}

interface PromoAdminClientProps {
  initialData: PromoCode[];
}

export default function PromoAdminClient({ initialData }: PromoAdminClientProps) {
  const [promos, setPromos] = useState<PromoCode[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  
  // Form fields
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState<number>(5);
  const [isActive, setIsActive] = useState(true);

  const { toast } = useToast();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [promoIdToDelete, setPromoIdToDelete] = useState<string | null>(null);

  const fetchPromos = async () => {
    try {
      const res = await fetch("/api/admin/promo");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setPromos(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось обновить список промокодов",
      });
    }
  };

  const handleOpenCreate = () => {
    setEditingPromo(null);
    setCode("");
    setDiscount(5);
    setIsActive(true);
    setFormOpen(true);
  };

  const handleOpenEdit = (promo: PromoCode) => {
    setEditingPromo(promo);
    setCode(promo.code);
    setDiscount(promo.discount);
    setIsActive(promo.isActive);
    setFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || discount <= 0 || discount > 100) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Введите корректный код и скидку от 1% до 100%",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingPromo?.id,
          code: code.trim(),
          discount,
          isActive,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      toast({
        title: "Успешно",
        description: editingPromo ? "Промокод изменен" : "Промокод создан",
      });
      setFormOpen(false);
      fetchPromos();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось сохранить промокод",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (promo: PromoCode) => {
    try {
      const res = await fetch("/api/admin/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: promo.id,
          code: promo.code,
          discount: promo.discount,
          isActive: !promo.isActive,
        }),
      });
      if (!res.ok) throw new Error("Failed to toggle");
      
      toast({
        title: "Успешно",
        description: !promo.isActive ? "Промокод активирован" : "Промокод деактивирован",
      });
      fetchPromos();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось обновить статус промокода",
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setPromoIdToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!promoIdToDelete) return;
    const id = promoIdToDelete;
    const rowEl = document.getElementById(`row-${id}`);

    const performDelete = async () => {
      setPromos((prev) => prev.filter((p) => p.id !== id));
      try {
        const res = await fetch(`/api/admin/promo?id=${id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete");

        toast({
          title: "Успешно",
          description: "Промокод успешно удален",
        });
      } catch (error) {
        fetchPromos();
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось удалить промокод",
        });
      }
    };

    if (rowEl) {
      const { thanosSnap } = await import("@/lib/thanos");
      thanosSnap(rowEl, performDelete);
    } else {
      performDelete();
    }
    setDeleteConfirmOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Tag className="h-7 w-7 text-teal-400" />
            Промокоды на бронирование
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Создавайте, удаляйте и управляйте промокодами скидок для гостей отеля
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-gradient-to-r from-teal-400 to-sky-500 hover:from-teal-300 hover:to-sky-400 text-slate-950 font-bold rounded-xl flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Создать промокод
        </Button>
      </div>

      {formOpen && (
        <form onSubmit={handleSave} className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4 max-w-xl animate-scale-in">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            {editingPromo ? "Редактировать промокод" : "Новый промокод"}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Код (Заглавные буквы)</label>
              <Input
                placeholder="ZATOKA2026"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="bg-slate-950/40 border-white/10 text-white rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Скидка (%)</label>
              <div className="flex items-center justify-between bg-slate-950/40 border border-white/10 rounded-xl h-11 px-2.5 w-full max-w-[150px]">
                <button
                  type="button"
                  onClick={() => setDiscount((prev) => Math.max(1, prev - 1))}
                  className="h-8 w-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all active:scale-95"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-base font-extrabold select-none text-white">{discount}</span>
                <button
                  type="button"
                  onClick={() => setDiscount((prev) => Math.min(100, prev + 1))}
                  className="h-8 w-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all active:scale-95"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <Button type="submit" disabled={loading} className="bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold rounded-xl flex items-center gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Сохранить
            </Button>
            <Button type="button" onClick={() => setFormOpen(false)} variant="ghost" className="text-slate-400 hover:text-white rounded-xl">
              <X className="h-4 w-4 mr-2" />
              Отмена
            </Button>
          </div>
        </form>
      )}

      {promos.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-white/10 rounded-3xl bg-slate-900/40 text-center space-y-4">
          <div className="p-4 rounded-full bg-teal-500/10 text-teal-400">
            <Tag className="h-10 w-10" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Промокодов пока нет</h3>
            <p className="text-slate-400 text-sm mt-1">
              Нажмите «Создать промокод», чтобы добавить первый рабочий код
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-white/10 rounded-3xl overflow-hidden glass-card-dark shadow-2xl bg-slate-900/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-slate-950/50 text-slate-300 text-xs font-bold uppercase tracking-wider">
                  <th className="p-4 pl-6">Промокод</th>
                  <th className="p-4">Скидка (%)</th>
                  <th className="p-4">Статус</th>
                  <th className="p-4">Дата создания</th>
                  <th className="p-4 pr-6 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-slate-200">
                {promos.map((promo) => (
                  <tr
                    key={promo.id}
                    id={`row-${promo.id}`}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 pl-6 font-mono text-teal-300 font-bold text-base">
                      {promo.code}
                    </td>
                    <td className="p-4 font-semibold text-white">
                      {promo.discount}%
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(promo)}
                        className="flex items-center gap-1.5 focus:outline-none"
                        title={promo.isActive ? "Деактивировать" : "Активировать"}
                      >
                        {promo.isActive ? (
                          <>
                            <ToggleRight className="h-6 w-6 text-teal-400" />
                            <span className="text-xs text-teal-300 font-semibold">Активен</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="h-6 w-6 text-slate-500" />
                            <span className="text-xs text-slate-500 font-semibold">Неактивен</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-slate-400">
                      <span className="flex items-center gap-2 text-xs">
                        <Calendar className="h-3.5 w-3.5 text-teal-400" />
                        {new Date(promo.createdAt).toLocaleDateString("ru-RU", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(promo)}
                        className="text-slate-400 hover:text-white hover:bg-white/10 rounded-xl"
                      >
                        Изменить
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(promo.id)}
                        className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
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
        title="Удалить промокод?"
        description="Вы уверены, что хотите безвозвратно удалить этот промокод? Гости больше не смогут им воспользоваться."
      />
    </div>
  );
}
