"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { customerApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/errors";
import type { Category, ProductListItem, Subcategory } from "@/types";

export default function ProductListingPage() {
  const searchParams = useSearchParams();
  const [q, setQ] = useState(() => searchParams.get("q") || "");
  const [categoryId, setCategoryId] = useState(() => searchParams.get("categoryId") || "");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState(() => searchParams.get("sort") || "latest");
  const [page, setPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [items, setItems] = useState<ProductListItem[]>([]);

  const limit = 12;

  useEffect(() => {
    customerApi.categories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!categoryId) return;
    customerApi.subcategories(categoryId).then(setSubcategories).catch(() => setSubcategories([]));
  }, [categoryId]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const res = await customerApi.products({
          q: q || undefined,
          categoryId: categoryId || undefined,
          subcategoryId: subcategoryId || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          page,
          limit,
        });
        const sorted = [...res.items];
        if (sort === "price_asc") sorted.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
        if (sort === "price_desc") sorted.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
        if (sort === "discount_desc") sorted.sort((a, b) => Number(b.discount || 0) - Number(a.discount || 0));
        setItems(sorted);
        setTotal(res.total);
      } catch (e) {
        setError(getApiErrorMessage(e, "Failed to load products"));
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [q, categoryId, subcategoryId, minPrice, maxPrice, sort, page]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total]);

  const filterPane = (
    <aside className="surface-card h-fit space-y-3 p-4">
      <h2 className="text-base font-bold">Filters</h2>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Search</label>
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Category</label>
        <Select value={categoryId} onChange={(e) => {
          setCategoryId(e.target.value);
          setSubcategoryId("");
          if (!e.target.value) setSubcategories([]);
        }}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.Pcategoryid} value={String(c.Pcategoryid)}>
              {c.Categoryname}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Subcategory</label>
        <Select value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)}>
          <option value="">All subcategories</option>
          {subcategories.map((sc) => (
            <option key={sc.Subcategoryid} value={String(sc.Subcategoryid)}>
              {sc.Subcategoryname}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min ₹" />
        <Input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max ₹" />
      </div>
      <Button variant="outline" onClick={() => {
        setQ("");
        setCategoryId("");
        setSubcategoryId("");
        setMinPrice("");
        setMaxPrice("");
        setPage(1);
      }}>
        Reset filters
      </Button>
    </aside>
  );

  return (
    <div className="fade-in">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Product Listing</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="md:hidden" onClick={() => setMobileFilterOpen((v) => !v)}>
            Filters
          </Button>
          <Select value={sort} onChange={(e) => setSort(e.target.value)} className="w-[180px]">
            <option value="latest">Latest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="discount_desc">Best Discount</option>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[280px_1fr]">
        <div className={`${mobileFilterOpen ? "block" : "hidden"} md:block`}>{filterPane}</div>
        <section>
          <div className="mb-3 text-sm text-slate-500">Showing {items.length} of {total} products</div>
          {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <ProductCard key={item.pid} item={item} />
              ))}
            </div>
          )}
          <div className="mt-6 flex items-center justify-center gap-2">
            <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
              Prev
            </Button>
            <span className="text-sm font-semibold">Page {page} / {totalPages}</span>
            <Button variant="outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
              Next
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
