"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomSelect } from "@/components/ui/custom-select";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface TechnicianSearchFilterProps {
  initialQuery?: string;
  initialCategory?: string;
  categories: CategoryOption[];
}

export function TechnicianSearchFilter({
  initialQuery = "",
  initialCategory = "",
  categories,
}: TechnicianSearchFilterProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category.trim()) params.set("category", category.trim());
    router.push(`/teknisi${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama teknisi, keahlian, atau area..."
            className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200/90 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="w-full md:w-64">
          <CustomSelect
            value={category}
            onChange={setCategory}
            placeholder="Semua Kategori"
            options={[
              { value: "", label: "Semua Kategori" },
              ...categories.map((c) => ({
                value: c.slug,
                label: c.name,
              })),
            ]}
          />
        </div>

        <Button
          type="submit"
          className="w-full md:w-auto h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 rounded-xl shadow-sm shrink-0"
        >
          Terapkan Filter
        </Button>
      </form>
    </div>
  );
}

