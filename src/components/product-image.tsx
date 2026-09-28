import Image from "next/image";
import { BikeArt } from "./bike-art";
import type { Category } from "@/lib/types";

/** Product photo when one is set, otherwise the illustrated bike on a tinted backdrop. */
export function ProductImage({
  name,
  category,
  accentColor,
  imageUrl,
  sizes,
  priority,
  className = "",
}: {
  name: string;
  category: Category;
  accentColor: string;
  imageUrl: string | null;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: `radial-gradient(circle at 50% 40%, ${accentColor}40, ${accentColor}14 70%)` }}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes={sizes}
          priority={priority}
          // Admin-entered links can point at any host, so skip the optimizer instead of allowing every domain.
          unoptimized={imageUrl.startsWith("http")}
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-[8%] text-ink">
          <BikeArt category={category} accent={accentColor} className="h-full w-full" />
        </div>
      )}
    </div>
  );
}
