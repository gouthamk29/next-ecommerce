import prismadb from "@/lib/prismadb";
import { SizeClient } from "./components/client";
import { Billboard } from "@prisma/client";
import { format } from "date-fns";
import { SizesColumn } from "./components/columns";
export default async function SizesPage({
  params,
}: {
  params: { storeId: string };
}) {
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedSizes: SizesColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 pt-6 p-8">
        <SizeClient data={formatedSizes} />
      </div>
    </div>
  );
}
