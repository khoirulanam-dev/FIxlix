import React from "react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (session?.user) {
    const role = (session.user as any).role;
    if (role === "ADMIN") {
      redirect("/admin");
    } else if (role === "TECHNICIAN") {
      redirect("/technician");
    } else {
      redirect("/customer");
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/60">
      <Navbar />
      <main className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-sm rounded-3xl sm:px-10 border border-slate-200/80">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
