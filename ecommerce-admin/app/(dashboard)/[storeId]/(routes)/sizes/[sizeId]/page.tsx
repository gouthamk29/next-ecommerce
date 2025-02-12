import prismadb from "@/lib/prismadb";
import { SizeForm } from "./components/size-form";

const BillBoardPage = async ({ params }: { params: { sizeId: string } }) => {
  const sizes = await prismadb.size.findUnique({
    where: {
      id: params.sizeId,
    },
  });
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4  p-8">
        <SizeForm initialData={sizes} />
      </div>
    </div>
  );
};
export default BillBoardPage;
