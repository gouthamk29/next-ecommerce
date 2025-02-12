import prismadb from "@/lib/prismadb";
import { BillBoardClient } from "./components/client";
import { Billboard } from "@prisma/client";
import { format } from "date-fns";
import { BillboardColumn } from "./components/columns";
export default async function BillBoards({
  params,
}: {
  params: { storeId: string };
}) {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 pt-6 p-8">
        <BillBoardClient data={formatedBillboards} />
      </div>
    </div>
  );
}
