"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const customer = useAuthStore((s) => s.customer);
  const logout = useAuthStore((s) => s.logout);

  if (!customer) {
    return (
      <div className="surface-card p-8 text-center">
        <p className="text-sm text-slate-500">Please login to see profile.</p>
        <Link href="/login" className="mt-3 inline-block text-sm font-semibold text-(--color-secondary)">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl fade-in">
      <div className="surface-card space-y-4 p-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <div className="grid gap-3 text-sm">
          <div><span className="font-semibold">Name:</span> {customer.name}</div>
          <div><span className="font-semibold">Email:</span> {customer.email}</div>
          <div><span className="font-semibold">Mobile:</span> {customer.mobile}</div>
          <div><span className="font-semibold">Status:</span> {customer.status}</div>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            logout();
            window.location.href = "/";
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}

