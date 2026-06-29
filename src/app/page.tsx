import Script from "next/script";
import { Payment } from "@/component/Payment";

export default function Home() {
  return (
    <div className="flex w-screen min-h-screen items-center justify-center flex-col gap-4 px-4">
      <Script
        type="text/javascript"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />

      <Payment />
    </div>
  );
}
