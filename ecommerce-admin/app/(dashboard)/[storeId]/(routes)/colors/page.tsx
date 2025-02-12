import prismadb from "@/lib/prismadb";
import { ColorClient } from "./components/client";
import { format } from "date-fns";
import { ColorsColumn } from "./components/columns";
export default async function ColorsPage({
  params,
}: {
  params: { storeId: string };
}) {
  const sizes = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedColors: ColorsColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 pt-6 p-8">
        <ColorClient data={formatedColors} />
      </div>
    </div>
  );
}
