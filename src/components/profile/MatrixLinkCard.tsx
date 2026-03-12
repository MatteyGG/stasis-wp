"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";

type MatrixLinkCardProps = {
  currentMxid: string | null;
  currentDisplayName: string | null;
  fallbackDisplayName: string | null;
  gameID: string | null;
};

export default function MatrixLinkCard({
  currentMxid,
  currentDisplayName,
  fallbackDisplayName,
  gameID,
}: MatrixLinkCardProps) {
  const matrixBaseUrl =
    (process.env.NEXT_PUBLIC_MATRIX_WEB_URL || "https://matrix.stasis-wp.ru").replace(
      /\/$/,
      ""
    );
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mxid, setMxid] = useState<string | null>(currentMxid);
  const [displayName, setDisplayName] = useState(
    currentDisplayName || fallbackDisplayName || ""
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const linked = Boolean(mxid);

  const matrixLogin = (() => {
    if (mxid?.startsWith("@")) {
      const withoutAt = mxid.slice(1);
      const localpart = withoutAt.split(":")[0];
      return localpart || null;
    }
    if (!gameID) return null;
    return `wp_${gameID}`.toLowerCase().replace(/[^a-z0-9._=\\/-]/g, "");
  })();

  const matrixProfileUrl = mxid
    ? `${matrixBaseUrl}/#/user/${encodeURIComponent(mxid)}`
    : null;

  async function copyLogin(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Логин Matrix скопирован");
    } catch {
      toast.error("Не удалось скопировать логин");
    }
  }

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
          {matrixLogin && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-muted-foreground">Логин: </span>
              <span className="font-mono">{matrixLogin}</span>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl h-7 w-7 p-0"
                onClick={() => copyLogin(matrixLogin)}
                title="Скопировать логин Matrix"
                aria-label="Скопировать логин Matrix"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
          <div>
            <span className="text-muted-foreground">Отображаемое имя: </span>
            <span>{displayName || "-"}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Пароль Matrix управляется отдельно от пароля сайта.
          </div>
          {matrixProfileUrl && (
            <div className="pt-2">
              <a
                href={matrixProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-xl border px-3 py-2 text-sm hover:bg-muted"
              >
                Открыть профиль в Matrix
              </a>
            </div>
          )}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl space-y-4">
            <div className="text-lg font-semibold">
              {linked ? "Обновить Matrix" : "Подключить Matrix"}
            </div>
            <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 space-y-1">
              <div>
                Логин для входа:
                <span className="ml-1 font-mono">
                  {matrixLogin || "появится после привязки"}
                </span>
                {matrixLogin && (
                  <Button
                    type="button"
                    variant="outline"
                    className="ml-2 rounded-xl h-7 w-7 p-0"
                    onClick={() => copyLogin(matrixLogin)}
                    title="Скопировать логин Matrix"
                    aria-label="Скопировать логин Matrix"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              <div>
                Пароль для входа в Matrix: тот, который вы задаёте ниже.
              </div>
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
              <div className="flex gap-2">
                <Input
                  id="mx-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Минимум 8 символов"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "Скрыть" : "Показать"}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mx-password-confirm">Подтверждение пароля</Label>
              <div className="flex gap-2">
                <Input
                  id="mx-password-confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Повторите пароль Matrix"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                >
                  {showConfirmPassword ? "Скрыть" : "Показать"}
                </Button>
              </div>
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
