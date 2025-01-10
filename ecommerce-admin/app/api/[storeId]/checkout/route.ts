import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    console.log("test Working");
    const { productIds } = await req.json();

    if (!productIds || productIds.length === 0) {
      return new NextResponse("Product ids are required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    const order = await prismadb.order.create({
      data: {
        storeId: params.storeId,
        isPaid: false,
        orderItems: {
          create: productIds.map((productId: string) => ({
            product: {
              connect: {
                id: productId,
              },
            },
          })),
        },
      },
    });

    // await new Promise((res) => setTimeout((res) => res, 10 * 1000));
    const mockAddress = "21/45 smt bld, 21 bell street LA ";
    const mockPhone = "+122 990 230 677";
    const updatedOrder = await prismadb.order.update({
      where: {
        id: order.id,
      },
      data: {
        isPaid: true,
        address: mockAddress,
        phone: mockPhone,
      },
      include: {
        orderItems: true,
      },
    });

    console.log("Order successfully updated:", updatedOrder);
    return new NextResponse(JSON.stringify(updatedOrder), { status: 200 });
  } catch (error) {
    console.error("Error processing order:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  console.log("working");
  return NextResponse.json({ Working: "true" });
}
