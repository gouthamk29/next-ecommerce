import prismadb from "@/lib/prismadb";
import { Category } from "@prisma/client";
import { format } from "date-fns";
import { CategoryColumn } from "./components/columns";
import { CategoryClient } from "./components/client";
export default async function CategoriesPage({
  params,
}: {
  params: { storeId: string };
}) {
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 pt-6 p-8">
        <CategoryClient data={formatedCategories} />
      </div>
    </div>
  );
}
