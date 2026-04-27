"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/lib/errors";
import { useAuthStore } from "@/store/auth-store";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const requestOtp = useAuthStore((s) => s.requestOtp);
  const resetPassword = useAuthStore((s) => s.resetPasswordWithOtp);

  const [step, setStep] = useState<1 | 2>(1);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [info, setInfo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto max-w-md fade-in">
      <div className="surface-card space-y-3 p-6">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        {info ? <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{info}</p> : null}

        {step === 1 ? (
          <form
            className="space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError(null);
              try {
                await requestOtp(mobile, "reset");
                setInfo("OTP sent to your mobile.");
                setStep(2);
              } catch (err) {
                setError(getApiErrorMessage(err, "Failed to send OTP"));
              } finally {
                setLoading(false);
              }
            }}
          >
            <Input placeholder="Mobile number" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
            <Button className="w-full" disabled={loading}>{loading ? "Sending..." : "Send OTP"}</Button>
          </form>
        ) : (
          <form
            className="space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError(null);
              try {
                await resetPassword(mobile, otp, newPassword);
                setInfo("Password reset successful.");
                router.push("/login");
              } catch (err) {
                setError(getApiErrorMessage(err, "Failed to reset password"));
              } finally {
                setLoading(false);
              }
            }}
          >
            <Input placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            <Input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <Button className="w-full" disabled={loading}>{loading ? "Resetting..." : "Reset Password"}</Button>
          </form>
        )}
        <Link href="/login" className="text-sm font-semibold text-[var(--color-secondary)] hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
}

