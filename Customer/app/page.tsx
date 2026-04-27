"use client";

import { useEffect, useMemo, useState } from "react";
import { customerApi } from "@/lib/api";
import type { Category, ProductListItem } from "@/types";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import SectionHeader from "@/components/SectionHeader";
import ProductSkeleton from "@/components/ProductSkeleton";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickView, setQuickView] = useState<ProductListItem | null>(null);

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const [categoryRes, productRes] = await Promise.all([
          customerApi.categories(),
          customerApi.products({ page: 1, limit: 24 }),
        ]);
        setCategories(categoryRes);
        setProducts(productRes.items);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const trending = useMemo(
    () =>
      [...products]
        .sort((a, b) => Number(b.discount || 0) - Number(a.discount || 0))
        .slice(0, 10),
    [products]
  );
  const bestSellers = useMemo(() => products.slice(0, 8), [products]);

  return (
    <div className="space-y-8 fade-in">
      <HeroCarousel />

      <section>
        <SectionHeader title="Shop by Category" subtitle="Curated picks for every shopper" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
            : categories.map((item) => <CategoryCard key={item.Pcategoryid} item={item} />)}
        </div>
      </section>

      <section>
        <SectionHeader title="Featured Products" subtitle="Hand-picked products with premium value" href="/products" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
            : products.slice(0, 8).map((item) => (
                <ProductCard key={item.pid} item={item} onQuickView={setQuickView} />
              ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Trending Deals" subtitle="High-discount products moving fast" />
        <div className="flex gap-4 overflow-x-auto pb-3">
          {trending.map((item) => (
            <div key={item.pid} className="min-w-[250px] max-w-[250px]">
              <ProductCard item={item} onQuickView={setQuickView} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Best Sellers" subtitle="Most loved picks by customers" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((item) => (
            <ProductCard key={item.pid} item={item} onQuickView={setQuickView} />
          ))}
        </div>
      </section>

      <Modal
        open={Boolean(quickView)}
        onClose={() => setQuickView(null)}
        title={quickView?.pname || "Product"}
      >
        {quickView ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">{quickView.brand_name || quickView.Categoryname}</p>
            <p className="text-sm text-slate-500">Price: {quickView.price}</p>
            <Button onClick={() => (window.location.href = `/product/${quickView.pid}`)}>
              Open Details
            </Button>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
