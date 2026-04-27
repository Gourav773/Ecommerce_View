import { Suspense } from "react";
import ProductListingClient from "./ProductListingClient";

export default function ProductListingPage() {
  return (
    <Suspense fallback={null}>
      <ProductListingClient />
    </Suspense>
  );
}
