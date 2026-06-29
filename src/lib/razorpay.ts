import "server-only";

import crypto from "node:crypto";

export const verifyPaymentSignature = ({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean => {
  const keySecret = process.env.RAZORPAY_SECRET as string;

  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return expectedSignature === signature;
};
