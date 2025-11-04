import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const txRef = searchParams.get("tx_ref");

  if (!txRef) {
    return NextResponse.json(
      { error: "Transaction reference is required" },
      { status: 400 }
    );
  }

  try {
    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;

    if (!secretKey) {
      throw new Error("Flutterwave secret key not configured");
    }

    // Verify transaction with Flutterwave
    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${txRef}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to verify transaction");
    }

    // Extract payment status
    const transaction = data.data;
    const status = transaction?.status?.toLowerCase();

    // Return standardized response
    return NextResponse.json({
      status:
        status === "successful"
          ? "successful"
          : status === "failed"
          ? "failed"
          : "pending",
      transactionId: transaction?.id,
      txRef: transaction?.tx_ref,
      amount: transaction?.amount,
      currency: transaction?.currency,
      customerName: transaction?.customer?.name,
      customerEmail: transaction?.customer?.email,
      paymentType: transaction?.payment_type,
      chargedAmount: transaction?.charged_amount,
    });
  } catch (error) {
    console.error("Transaction verification error:", error);
    return NextResponse.json(
      {
        error: "Failed to verify transaction",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
