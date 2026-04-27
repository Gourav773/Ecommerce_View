"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { customerApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/errors";
import { calcDiscountedPrice, formatMoney } from "@/lib/format";
import { resolveImageUrl } from "@/lib/image";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { useToastStore } from "@/store/toast-store";
import { useWishlistStore } from "@/store/wishlist-store";
import type { ProductDetailsResponse, ProductListItem } from "@/types";

export default function ProductDetailsPage() {
  const params = useParams<{ pid: string }>();
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const addToCart = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const toast = useToastStore((s) => s.push);
  const [data, setData] = useState<ProductDetailsResponse | null>(null);
  const [related, setRelated] = useState<ProductListItem[]>([]);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await customerApi.product(params.pid);
        setData(res);
        const image = res.images?.[0]?.image || res.product.image;
        setMainImage(resolveImageUrl(image));
        const relatedRes = await customerApi.products({
          subcategoryId: String(res.product.Subcategoryid || ""),
          limit: 8,
          page: 1,
        });
        setRelated(relatedRes.items.filter((item) => item.pid !== params.pid));
      } catch (e) {
        setError(getApiErrorMessage(e, "Failed to load product"));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.pid]);

  const finalPrice = useMemo(
    () => calcDiscountedPrice(data?.product.price, data?.product.discount),
    [data?.product.price, data?.product.discount]
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ProductSkeleton />
        <ProductSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return <div className="rounded-xl bg-red-50 p-4 text-red-700">{error || "Product not found"}</div>;
  }

  return (
    <div className="space-y-8 fade-in">
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-md">
            <Image src={mainImage} alt={data.product.pname} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {(data.images.length ? data.images : [{ imgid: 0, image: data.product.image as string }]).slice(0, 8).map((img) => {
              const src = resolveImageUrl(img.image);
              return (
                <button
                  key={img.imgid}
                  className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white"
                  onClick={() => setMainImage(src)}
                >
                  <Image src={src} alt={data.product.pname} fill className="object-cover" sizes="90px" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="surface-card p-5">
          <h1 className="text-2xl font-bold">{data.product.pname}</h1>
          <p className="mt-1 text-sm text-slate-500">{data.product.brand_name}</p>
          <div className="mt-3 flex items-center gap-2">
            <Badge className="bg-slate-100 text-slate-700">{data.rating.avg ? `${data.rating.avg.toFixed(1)}★` : "New"}</Badge>
            <span className="text-sm text-slate-500">{data.rating.count} ratings</span>
          </div>
          <div className="mt-4 flex items-end gap-3">
            <span className="text-3xl font-bold">{formatMoney(finalPrice)}</span>
            {Number(data.product.discount || 0) > 0 ? (
              <span className="text-base text-slate-500 line-through">{formatMoney(data.product.price)}</span>
            ) : null}
          </div>
          <div className="mt-1 text-sm text-[var(--color-success)]">Inclusive of all taxes</div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button
              onClick={async () => {
                await addToCart(data.product as ProductListItem, token);
                toast({ title: "Added to cart", tone: "success" });
              }}
            >
              Add to Cart
            </Button>
            <Button
              variant="secondary"
              onClick={async () => {
                if (!token) return router.push(`/login?next=${encodeURIComponent(`/product/${params.pid}`)}`);
                await addToCart(data.product as ProductListItem, token);
                router.push("/checkout");
              }}
            >
              Buy Now
            </Button>
          </div>
          <Button
            variant="outline"
            className="mt-3 w-full"
            onClick={async () => {
              const next = await toggleWishlist(data.product as ProductListItem, token);
              toast({ title: next ? "Added to wishlist" : "Removed from wishlist", tone: "info" });
            }}
          >
            Toggle Wishlist
          </Button>

          {data.offers.length ? (
            <div className="mt-5 rounded-xl bg-orange-50 p-3">
              <h3 className="mb-2 font-semibold">Available Offers</h3>
              <div className="space-y-2 text-sm text-slate-700">
                {data.offers.map((offer) => (
                  <p key={offer.offerid}>• {offer.offername}</p>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="surface-card p-5">
        <h2 className="text-xl font-bold">Description & Specifications</h2>
        <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
          {Object.entries(data.description || {}).map(([key, value]) => (
            <div key={key} className="rounded-lg border border-slate-100 bg-white px-3 py-2">
              <span className="font-semibold capitalize">{key.replaceAll("_", " ")}:</span>{" "}
              <span>{String(value)}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">Related Products</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.slice(0, 8).map((item) => (
            <ProductCard key={item.pid} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}

