import { Suspense } from "react";
import { VerifyClient } from "@/components/auth/verify-client";

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
        <VerifyClient />
      </Suspense>
    </div>
  );
}
