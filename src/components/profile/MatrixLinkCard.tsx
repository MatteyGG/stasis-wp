"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type MatrixLinkCardProps = {
  currentMxid: string | null;
  currentDisplayName: string | null;
  fallbackDisplayName: string | null;
};

export default function MatrixLinkCard({
  currentMxid,
  currentDisplayName,
  fallbackDisplayName,
}: MatrixLinkCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mxid, setMxid] = useState<string | null>(currentMxid);
  const [displayName, setDisplayName] = useState(
    currentDisplayName || fallbackDisplayName || ""
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const linked = Boolean(mxid);

  async function submit() {
    if (!displayName.trim()) {
      toast.error("Введите отображаемое имя Matrix");
      return;
    }
    if (password.length < 8) {
      toast.error("Пароль Matrix должен быть не короче 8 символов");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Пароли Matrix не совпадают");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/user/matrix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim(),
          password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || "Не удалось подключить Matrix");
        return;
      }

      setMxid(data.mxid || null);
      setPassword("");
      setConfirmPassword("");
      setIsOpen(false);
      toast.success(data.message || "Matrix подключен");
    } catch {
      toast.error("Ошибка сети при подключении Matrix");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-xl border p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-medium">Matrix</div>
          <div className="text-sm text-muted-foreground">
            {linked ? "Подключен" : "Не подключен"}
          </div>
        </div>
        <Button
          className="rounded-xl"
          variant={linked ? "outline" : "default"}
          onClick={() => setIsOpen(true)}
        >
          {linked ? "Изменить Matrix" : "Подключить Matrix"}
        </Button>
      </div>

      {mxid && (
        <div className="text-sm space-y-1">
          <div>
            <span className="text-muted-foreground">MXID: </span>
            <span className="font-mono">{mxid}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Display name: </span>
            <span>{displayName || "-"}</span>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl space-y-4">
            <div className="text-lg font-semibold">
              {linked ? "Обновить Matrix" : "Подключить Matrix"}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mx-display-name">Отображаемое имя Matrix</Label>
              <Input
                id="mx-display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Например: matteygg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mx-password">Пароль Matrix</Label>
              <Input
                id="mx-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Минимум 8 символов"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mx-password-confirm">Подтверждение пароля</Label>
              <Input
                id="mx-password-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Повторите пароль Matrix"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Отмена
              </Button>
              <Button
                className="rounded-xl"
                onClick={submit}
                disabled={isLoading}
              >
                {isLoading ? "Сохраняем..." : "Сохранить"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
