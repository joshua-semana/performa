import { FieldDescription } from "@/components/ui/field";
import { LoginForm } from "@/features/auth/forms/login-form";
import { ChartColumnBig } from "lucide-react";

export default function Page() {
  return (
    <main className="flex flex-col min-h-svh items-center justify-center gap-6 p-6 bg-muted">
      <div className="flex items-center gap-2 font-bold">
        <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <ChartColumnBig className="size-4" />
        </div>
        Performa
      </div>
      <LoginForm />
      <FieldDescription>v1.0.0 © IT Department</FieldDescription>
    </main>
  );
}
