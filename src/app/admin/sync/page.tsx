"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Check, AlertCircle, ExternalLink, Calendar, ShieldCheck, ArrowRightLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Room {
  id: string;
  name: string;
}

interface FeedConfig {
  id: string;
  roomId: string;
  roomName: string;
  sourceName: string;
  url: string;
  lastSyncedAt?: string;
  status?: "SUCCESS" | "ERROR";
  errorMessage?: string;
}

export default function CalendarSyncAdminPage() {
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [feeds, setFeeds] = useState<FeedConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://zatoka-hotel.com";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, feedsRes] = await Promise.all([
          fetch("/api/rooms").then((r) => r.json()),
          fetch("/api/admin/calendar-sync").then((r) => r.json()),
        ]);

        const loadedRooms: Room[] = Array.isArray(roomsRes) ? roomsRes : [];
        setRooms(loadedRooms);

        let loadedFeeds: FeedConfig[] = feedsRes.feeds || [];

        // Ensure every room has a feed config item
        const mergedFeeds = loadedRooms.map((room) => {
          const existing = loadedFeeds.find((f) => f.roomId === room.id);
          return (
            existing || {
              id: `feed-${room.id}`,
              roomId: room.id,
              roomName: room.name,
              sourceName: "Booking.com",
              url: "",
            }
          );
        });

        setFeeds(mergedFeeds);
      } catch (err) {
        console.error("Error loading sync data:", err);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить данные настроек синхронизации",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleUrlChange = (roomId: string, newUrl: string) => {
    setFeeds((prev) =>
      prev.map((f) => (f.roomId === roomId ? { ...f, url: newUrl } : f))
    );
  };

  const handleSaveFeeds = async () => {
    try {
      const res = await fetch("/api/admin/calendar-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_feeds", feeds }),
      });
      if (res.ok) {
        toast({
          title: "Успешно!",
          description: "Ссылки синхронизации сохранены",
        });
      } else {
        toast({
          title: "Ошибка",
          description: "Ошибка при сохранении настроек",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Ошибка",
        description: "Сбой подключения при сохранении",
        variant: "destructive",
      });
    }
  };

  const handleSyncNow = async () => {
    try {
      setSyncing(true);
      toast({
        title: "Запуск...",
        description: "Выполняется синхронизация с Booking.com",
      });
      
      // First save current feed URLs
      await fetch("/api/admin/calendar-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_feeds", feeds }),
      });

      // Then trigger sync
      const res = await fetch("/api/admin/calendar-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync_now", feeds }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.feeds) setFeeds(data.feeds);
        toast({
          title: "Синхронизация завершена!",
          description: `Добавлено новых броней: ${data.totalImported || 0}`,
        });
      } else {
        toast({
          title: "Ошибка",
          description: data.error || "Ошибка во время синхронизации",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Ошибка",
        description: "Ошибка при выполнении запроса синхронизации",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({
      title: "Скопировано",
      description: "Ссылка скопирована в буфер обмена",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Синхронизация с Booking.com (iCal)
            </h1>
          </div>
          <p className="text-slate-400 text-sm">
            Двусторонняя авто-синхронизация календарей бронирования для защиты от овербукинга.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSyncNow}
            disabled={syncing || loading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-2 shadow-lg shadow-emerald-950/50"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Синхронизация..." : "Синхронизировать сейчас"}
          </Button>
        </div>
      </div>

      {/* Guide Steps Card */}
      <Card className="bg-slate-950 border-slate-800 text-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
            Инструкция по настройке за 3 шага
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4 text-xs leading-relaxed text-slate-300">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="font-bold text-white text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">1</span>
              Экспорт в Booking.com
            </div>
            <p>
              Скопируйте **«Ссылка для Booking.com»** ниже и вставьте её в экстранете Booking.com: 
              <br />
              <span className="text-slate-400 font-mono text-[11px] block mt-1">Тарифы и номера ➔ Календарь ➔ Синхронизация календарей</span>
            </p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="font-bold text-white text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">2</span>
              Импорт из Booking.com
            </div>
            <p>
              В экстранете Booking.com скопируйте ссылку **«Экспорт календаря»** для соответствующего номера и вставьте её в поле ниже.
            </p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="font-bold text-white text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">3</span>
              Автоматическая защита
            </div>
            <p>
              Нажмите **«Сохранить и Синхронизировать»**. Теперь новые бронирования будут автоматически закрывать даты на обоих сайтах.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Room Sync List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-teal-400" />
          Категории номеров ({rooms.length})
        </h2>

        {loading ? (
          <div className="p-8 text-center text-slate-500 animate-pulse">Загрузка номеров...</div>
        ) : rooms.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Категории номеров не найдены.</div>
        ) : (
          rooms.map((room) => {
            const feed = feeds.find((f) => f.roomId === room.id);
            const exportUrl = `${baseUrl}/api/calendar/ical?roomId=${room.id}`;

            return (
              <Card key={room.id} className="bg-slate-900 border-slate-800 text-slate-200">
                <CardHeader className="pb-3 border-b border-slate-800/60">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold text-white">
                      {room.name}
                    </CardTitle>
                    {feed?.lastSyncedAt && (
                      <div className="flex items-center gap-2 text-xs">
                        {feed.status === "SUCCESS" ? (
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                            Синхронизировано ({new Date(feed.lastSyncedAt).toLocaleTimeString()})
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-rose-500/10 text-rose-400 border-rose-500/30">
                            Ошибка ({feed.errorMessage || "Недоступно"})
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-4 space-y-4 text-sm">
                  {/* Step A: Export link */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                      <span>📤 Ссылка для вставки В Booking.com (Экспорт календаря с вашего сайта):</span>
                    </label>
                    <div className="flex gap-2">
                      <Input
                        readOnly
                        value={exportUrl}
                        className="bg-slate-950 border-slate-800 font-mono text-xs text-emerald-400 select-all"
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => copyToClipboard(exportUrl, room.id)}
                        className="gap-1.5 shrink-0 bg-slate-800 hover:bg-slate-700 text-white"
                      >
                        {copiedId === room.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" /> Скопировано
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Скопировать
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Step B: Import link */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400">
                      📥 Ссылка из Booking.com (Импорт календаря Booking.com в вашу систему):
                    </label>
                    <Input
                      placeholder="https://admin.booking.com/hotel/hotel2/ical/...."
                      value={feed?.url || ""}
                      onChange={(e) => handleUrlChange(room.id, e.target.value)}
                      className="bg-slate-950 border-slate-800 font-mono text-xs text-white placeholder:text-slate-600"
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Save Button Bar */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
        <Button
          onClick={handleSaveFeeds}
          variant="outline"
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          Сохранить настройки
        </Button>
        <Button
          onClick={handleSyncNow}
          disabled={syncing}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
          Сохранить и Синхронизировать
        </Button>
      </div>
    </div>
  );
}
