import { ThemeToggle } from "@/components/theme-toggle";
import { FieldDescription } from "@/components/ui/field";
import { LoginForm } from "@/features/auth/forms/login-form";
import { appConfig } from "@/lib/config/app";
import { Icons } from "@/lib/theme/icons";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-svh gap-6 p-6 bg-muted">
      <div className="grid grid-rows-[1fr_auto] w-full flex-1">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="flex items-center gap-2 font-bold">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Icons.logo className="size-4" />
            </div>
            {appConfig.name}
          </div>
          <LoginForm />
          <FieldDescription>v1.0.0 © Joshua Semana</FieldDescription>
        </div>
        <div className="text-center">
          <ThemeToggle align="center" />
        </div>
      </div>
    </div>
  );
}
