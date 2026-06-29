"use client";

import { useState } from "react";

export const Payment = () => {
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createOrder = async () => {
    if (amount <= 0) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/createOrder", {
        method: "POST",
        body: JSON.stringify({ amount: amount * 100 }),
      });
      const data = await res.json();

      const paymentData = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
        order_id: data.id,
        handler: async (response: any) => {
          // verify payment
          const res = await fetch("/api/verifyOrder", {
            method: "POST",
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          const data = await res.json();
          console.log(data);

          if (data.isOk) {
            // do whatever page transition you want here as payment was successful
            alert("Payment successful");
          } else {
            // Unlikely to run — Razorpay handles payment failures in its checkout UI before calling this handler
            alert("Payment failed");
          }
        },
      };

      const payment = new (window as any).Razorpay(paymentData);
      payment.open();
    } finally {
      setIsLoading(false);
    }
  };

  const isPayDisabled = amount <= 0 || isLoading;

  return (
    <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          Make a Payment
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Enter an amount and pay securely via Razorpay
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label
            htmlFor="amount"
            className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Amount (INR)
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400">
              ₹
            </span>
            <input
              id="amount"
              type="number"
              min="1"
              placeholder="0"
              className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-3 pr-4 pl-8 text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              value={amount === 0 ? "" : amount}
              onChange={(e) => {
                setAmount(Number(e.target.value));
              }}
            />
          </div>
        </div>

        <button
          type="button"
          disabled={isPayDisabled}
          className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          onClick={createOrder}
        >
          {isLoading ? "Opening checkout..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
};
