"use client";

import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { BillboardColumn, columns } from "./columns";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface BillBoardClientProps {
  data: BillboardColumn[];
}

export const BillBoardClient: React.FC<BillBoardClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`BillBoards (${data.length})`}
          description="Manage billboard for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="label" />
      <Heading title="API" description="Api calls for billboards" />
      <Separator />
      <ApiList entityName="billboards" entityIdName="billboardId" />
    </>
  );
};
