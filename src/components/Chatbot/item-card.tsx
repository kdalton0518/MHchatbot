import { ProductItem } from "@/types/chat";
import Image from "next/image";

interface ItemCardProps {
  item: ProductItem;
}

export default function ItemCard({ item }: ItemCardProps) {
  const displayableKeys: (keyof ProductItem)[] = [
    "supplier",
    "product",
    "price",
    "rating",
    "certification",
    "shipping",
    "complianceGrade",
    "location",
    "capacity",
    "certifications",
  ];

  return (
    <div className="min-w-[400px] bg-secondary shadow-md rounded-lg flex flex-col relative overflow-hidden">
      <Image
        src={item.image}
        alt={item.product || item.supplier}
        width={400}
        height={400}
        className="w-[400px] h-[400px] object-cover"
      />
      <div className="absolute bottom-0 left-0 w-full bg-white bg-opacity-70 text-black p-4">
        {displayableKeys.map(
          (key) =>
            item[key] && (
              <p key={key} className="text-sm">
                <span className="font-semibold">
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </span>{" "}
                {item[key]}
              </p>
            ),
        )}
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-blue-500 underline text-sm"
        >
          View More
        </a>
      </div>
    </div>
  );
}
