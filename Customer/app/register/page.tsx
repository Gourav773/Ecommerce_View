"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/lib/errors";
import { useAuthStore } from "@/store/auth-store";

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-md fade-in">
      <form
        className="surface-card space-y-3 p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setError(null);
          try {
            await register({ name, email, mobile, password });
            router.push("/");
          } catch (err) {
            setError(getApiErrorMessage(err, "Registration failed"));
          } finally {
            setLoading(false);
          }
        }}
      >
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-sm text-slate-500">Sign up for faster checkout and offers.</p>
        {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

        <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input placeholder="Mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <Button className="w-full" disabled={loading}>
          {loading ? "Please wait..." : "Create account"}
        </Button>
        <p className="text-sm">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-(--color-secondary) hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

