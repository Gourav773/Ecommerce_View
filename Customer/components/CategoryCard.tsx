// import Link from "next/link";
// import { Card } from "@/components/ui/card";
// import type { Category } from "@/types";

// export default function CategoryCard({ item }: { item: Category }) {
//   return (
//     <Link href={`/products?categoryId=${item.Pcategoryid}`}>
//       <Card className="group p-4 transition hover:-translate-y-1 hover:shadow-lg">
//         <div className="mb-3 rounded-xl bg-slate-100 p-4 text-center text-2xl">🛍️</div>
//         <div className="text-sm font-semibold text-slate-700 group-hover:text-[var(--color-secondary)]">
//           {item.Categoryname}
//         </div>
//       </Card>
//     </Link>
//   );
// }import Link from "next/link";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import type { Category } from "@/types";

const getCategoryKey = (name: string) => {
  const n = name.toLowerCase();

  if (n.includes("book")) return "books";
  if (n.includes("construction")) return "construction";
  if (n.includes("furniture")) return "furniture";
  if (n.includes("grocery") || n.includes("grosry")) return "grocery";
  if (n.includes("vegetable")) return "vegetables";
  if (n.includes("medicine")) return "medicine";
  if (n.includes("toy")) return "toys";
  if (n.includes("jewel")) return "jewelry";
  if (n.includes("gym")) return "gym";

  return "default";
};

const categoryImages: Record<string, string> = {
  books: "/images/categories/books.jpg",
  construction: "/images/categories/construction.jpg",
  furniture: "/images/categories/furniture.jpg",
  grocery: "/images/categories/grocery.jpg",
  vegetables: "/images/categories/vegetables.jpg",
  medicine: "/images/categories/medicine.jpg",
  toys: "/images/categories/toys.jpg",
  jewelry: "/images/categories/jewelry.jpg",
  default: "/images/categories/default.jpg",
  gym:"/images/categories/gym.jpg"
};

export default function CategoryCard({ item }: { item: Category }) {
  const key = getCategoryKey(item.Categoryname);
  const image = categoryImages[key];

  return (
    <Link href={`/products?categoryId=${item.Pcategoryid}`}>
      <Card className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">

        <div className="relative h-32 w-full overflow-hidden">
          <Image
            src={image}
            alt={item.Categoryname}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover transition duration-300 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition" />
        </div>

        <div className="p-4 text-center">
          <h3 className="text-sm font-semibold text-slate-700 group-hover:text-blue-600">
            {item.Categoryname}
          </h3>
        </div>

      </Card>
    </Link>
  );
}