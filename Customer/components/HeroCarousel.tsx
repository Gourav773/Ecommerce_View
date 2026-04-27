// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";

// const slides = [
//   {
//     title: "Summer Deals Are Live",
//     subtitle: "Up to 70% off on electronics, fashion and lifestyle",
//     cta: "Shop Deals",
//     href: "/products?sort=discount_desc",
//   },
//   {
//     title: "Premium Tech Store",
//     subtitle: "Discover latest mobiles, laptops and gaming gear",
//     cta: "Explore Tech",
//     href: "/products?categoryId=1",
//   },
//   {
//     title: "Daily Essentials",
//     subtitle: "Fast delivery and trusted prices for every home",
//     cta: "Browse Products",
//     href: "/products",
//   },
// ];

// export default function HeroCarousel() {
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setIndex((i) => (i + 1) % slides.length);
//     }, 4200);
//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <section className="relative overflow-hidden rounded-3xl accent-gradient p-8 text-white shadow-lg md:p-12">
//       <div className="relative z-10 max-w-xl">
//         <h1 className="text-3xl font-bold leading-tight md:text-5xl">{slides[index].title}</h1>
//         <p className="mt-3 text-base text-slate-100 md:text-lg">{slides[index].subtitle}</p>
//         <Link href={slides[index].href} className="mt-6 inline-block">
//           <Button className="font-semibold">{slides[index].cta}</Button>
//         </Link>
//       </div>
//       <div className="pointer-events-none absolute -right-8 -top-12 h-52 w-52 rounded-full bg-orange-300/25 blur-2xl" />
//       <div className="pointer-events-none absolute -bottom-14 left-8 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
//       <div className="mt-8 flex gap-2">
//         {slides.map((_, i) => (
//           <span
//             key={i}
//             className={`h-2 w-8 rounded-full ${
//               i === index ? "bg-white" : "bg-white/40"
//             }`}
//           />
//         ))}
//       </div>
//     </section>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const slides = [
  {
    title: "Summer Deals Are Live",
    subtitle: "Up to 70% off on electronics, fashion and lifestyle",
    cta: "Shop Deals",
    href: "/products?sort=discount_desc",
    video: "/Video/BANNER1.mp4",
  },
  {
    title: "Premium Tech Store",
    subtitle: "Discover latest mobiles, laptops and gaming gear",
    cta: "Explore Tech",
    href: "/products?categoryId=1",
    video: "/Video/BANNER2.mp4",
  },
  {
    title: "Daily Essentials",
    subtitle: "Fast delivery and trusted prices for every home",
    cta: "Browse Products",
    href: "/products",
    video: "/Video/BANNER3.mp4",
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden rounded-3xl h-[320px] md:h-[420px] shadow-lg">

      {/* 🎥 Dynamic Video (IMPORTANT key) */}
      <video
        key={slides[index].video}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={slides[index].video} type="video/mp4" />
      </video>

      {/* 🔥 Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

      {/* 🔥 Content */}
      <div className="relative z-10 p-8 md:p-12 max-w-xl text-white">
        <h1 className="text-3xl md:text-5xl font-bold transition-all duration-500">
          {slides[index].title}
        </h1>

        <p className="mt-3 text-slate-200 transition-all duration-500">
          {slides[index].subtitle}
        </p>

        <Link href={slides[index].href}>
          <Button className="mt-6 font-semibold">
            {slides[index].cta}
          </Button>
        </Link>
      </div>

      {/* 🔥 Blur effects (same as old) */}
      <div className="pointer-events-none absolute -right-8 -top-12 h-52 w-52 rounded-full bg-orange-300/25 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-14 left-8 h-60 w-60 rounded-full bg-white/10 blur-2xl" />

      {/* 🔥 Indicators */}
      <div className="absolute bottom-4 left-8 flex gap-2 z-10">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-8 rounded-full transition ${
              i === index ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>

    </section>
  );
}