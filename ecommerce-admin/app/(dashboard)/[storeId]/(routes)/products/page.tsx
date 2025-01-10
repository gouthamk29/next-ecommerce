import prismadb from "@/lib/prismadb";
import { ProductClient } from "./components/client";
import { Billboard } from "@prisma/client";
import { format } from "date-fns";
import { ProductColumn } from "./components/columns";
import { formatter } from "@/lib/utils";
export default async function ProductPage({
  params,
}: {
  params: { storeId: string };
}) {
  const product = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedProducts: ProductColumn[] = product.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    category: item.category.name,
    size: item.size.name,
    color: item.color.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 pt-6 p-8">
        <ProductClient data={formatedProducts} />
      </div>
    </div>
  );
}
