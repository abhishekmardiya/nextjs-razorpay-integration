import { type NextRequest, NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  const { orderId, razorpayPaymentId, razorpaySignature } =
    await request.json();

  const isValid = verifyPaymentSignature({
    orderId,
    paymentId: razorpayPaymentId,
    signature: razorpaySignature,
  });

  if (!isValid) {
    return NextResponse.json(
      { message: "payment verification failed", isOk: false },
      { status: 400 },
    );
  }

  // Probably some database calls here to update order or add premium status to user
  return NextResponse.json(
    { message: "payment verified successfully", isOk: true },
    { status: 200 },
  );
}
