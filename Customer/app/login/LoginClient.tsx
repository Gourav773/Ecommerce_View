"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/lib/errors";
import { useAuthStore } from "@/store/auth-store";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const login = useAuthStore((s) => s.login);
  const requestOtp = useAuthStore((s) => s.requestOtp);
  const loginWithOtp = useAuthStore((s) => s.loginWithOtp);

  const [mode, setMode] = useState<"password" | "otp">("password");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [debugOtp, setDebugOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-md fade-in">
      <div className="surface-card p-6">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="mt-1 text-sm text-slate-500">Welcome back to ShopSphere.</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant={mode === "password" ? "primary" : "outline"} onClick={() => setMode("password")}>
            Password
          </Button>
          <Button variant={mode === "otp" ? "primary" : "outline"} onClick={() => setMode("otp")}>
            OTP Login
          </Button>
        </div>

        {error ? <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        {debugOtp ? <p className="mt-3 rounded-xl bg-yellow-50 p-3 text-sm text-yellow-800">OTP: {debugOtp}</p> : null}

        {mode === "password" ? (
          <form
            className="mt-4 space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError(null);
              try {
                await login(identifier, password);
                router.push(next);
              } catch (err) {
                setError(getApiErrorMessage(err, "Login failed"));
              } finally {
                setLoading(false);
              }
            }}
          >
            <Input placeholder="Email or mobile" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button className="w-full" disabled={loading}>
              {loading ? "Please wait..." : "Login"}
            </Button>
          </form>
        ) : (
          <form
            className="mt-4 space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError(null);
              try {
                if (!otpSent) {
                  const res = await requestOtp(mobile, "login");
                  setDebugOtp(res.otp || "");
                  setOtpSent(true);
                } else {
                  await loginWithOtp(mobile, otp);
                  router.push(next);
                }
              } catch (err) {
                setError(getApiErrorMessage(err, "OTP flow failed"));
              } finally {
                setLoading(false);
              }
            }}
          >
            <Input placeholder="Mobile number" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
            {otpSent ? <Input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required /> : null}
            <Button className="w-full" disabled={loading}>
              {loading ? "Please wait..." : otpSent ? "Verify OTP" : "Send OTP"}
            </Button>
          </form>
        )}

        <div className="mt-4 flex justify-between text-sm">
          <Link href="/forgot-password" className="text-(--color-secondary) hover:underline">
            Forgot password?
          </Link>
          <Link href="/register" className="text-(--color-secondary) hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
