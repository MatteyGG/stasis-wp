"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { changePassword, type ActionState } from "@/app/actions/user-actions";
import { CheckCircle, XCircle, AlertCircle, Eye, EyeOff } from "lucide-react";

const initialState: ActionState = {
  error: null,
  success: null,
};

// Функция проверки сложности пароля
const checkPasswordStrength = (password: string) => {
  const requirements = {
    hasMinLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const strength = Object.values(requirements).filter(Boolean).length;
  return { requirements, strength };
};

export default function ChangePasswordPage() {
  const router = useRouter();
  const [state, setState] = useState<ActionState>(initialState);
  const [isPending, setIsPending] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    requirements: {
      hasMinLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecialChar: false,
    },
    strength: 0,
  });
  
  // Состояния для отображения паролей
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Обновляем проверку сложности пароля при изменении
  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(newPassword));
  }, [newPassword]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const result = await changePassword(initialState, formData);
    
    setState(result);
    setIsPending(false);

    if (result.success) {
      // Уведомляем браузер об изменении пароля
      if (typeof window !== 'undefined' && 'PasswordCredential' in window) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const cred = new (window as any).PasswordCredential({
            id: 'password-updated',
            name: 'Password Updated',
            password: formData.get('newPassword') as string,
          });
          navigator.credentials.store(cred);
        } catch (error) {
          console.log('Browser credential API not supported: ' + error);
        }
      }
      
      setTimeout(() => router.push("/profile"), 2000);
    }
  };

  // Проверка, совпадают ли пароли
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Смена пароля</CardTitle>
          <CardDescription>
            Обновите ваш пароль. После сохранения вам потребуется войти с новым паролем.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state.success && (
            <div className="bg-green-100 text-green-800 p-3 rounded-md mb-4 flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              {state.success}
            </div>
          )}
          {state.error && (
            <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4 flex items-center">
              <XCircle className="mr-2 h-5 w-5" />
              {state.error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Текущий пароль</Label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  name="currentPassword"
                  required
                  disabled={isPending}
                  autoComplete="current-password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">Новый пароль</Label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  required
                  minLength={8}
                  disabled={isPending}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {/* Индикатор сложности пароля */}
              {newPassword.length > 0 && (
                <div className="mt-2 space-y-2">
                  <div className="text-sm font-medium">Сложность пароля:</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        passwordStrength.strength < 2 ? 'bg-red-500' :
                        passwordStrength.strength < 4 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <div className={`flex items-center ${passwordStrength.requirements.hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordStrength.requirements.hasMinLength ? <CheckCircle className="mr-1 h-4 w-4" /> : <AlertCircle className="mr-1 h-4 w-4" />}
                      Не менее 8 символов
                    </div>
                    <div className={`flex items-center ${passwordStrength.requirements.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordStrength.requirements.hasUpperCase ? <CheckCircle className="mr-1 h-4 w-4" /> : <AlertCircle className="mr-1 h-4 w-4" />}
                      Заглавные буквы (A-Z)
                    </div>
                    <div className={`flex items-center ${passwordStrength.requirements.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordStrength.requirements.hasLowerCase ? <CheckCircle className="mr-1 h-4 w-4" /> : <AlertCircle className="mr-1 h-4 w-4" />}
                      Строчные буквы (a-z)
                    </div>
                    <div className={`flex items-center ${passwordStrength.requirements.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordStrength.requirements.hasNumber ? <CheckCircle className="mr-1 h-4 w-4" /> : <AlertCircle className="mr-1 h-4 w-4" />}
                      Цифры (0-9)
                    </div>
                    <div className={`flex items-center ${passwordStrength.requirements.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordStrength.requirements.hasSpecialChar ? <CheckCircle className="mr-1 h-4 w-4" /> : <AlertCircle className="mr-1 h-4 w-4" />}
                      Спецсимволы (!@#$% и т.д.)
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтвердите новый пароль</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  minLength={8}
                  disabled={isPending}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {/* Проверка совпадения паролей */}
              {confirmPassword.length > 0 && (
                <div className={`text-sm flex items-center ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                  {passwordsMatch ? <CheckCircle className="mr-1 h-4 w-4" /> : <XCircle className="mr-1 h-4 w-4" />}
                  {passwordsMatch ? 'Пароли совпадают' : 'Пароли не совпадают'}
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isPending || !passwordsMatch || passwordStrength.strength < 3}
              >
                {isPending ? "Обновление..." : "Обновить пароль"}
              </Button>
              <Link href="/profile" className="flex-1">
                <Button variant="outline" className="w-full" disabled={isPending}>
                  Назад
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}