import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Flutterwave webhook handler
// This endpoint is called by Flutterwave when a payment is completed
export async function POST(request: NextRequest) {
  try {
    // Get the webhook signature from headers
    const signature = request.headers.get("verif-hash");
    const secretHash = process.env.FLUTTERWAVE_SECRET_KEY || "";

    // Verify webhook authenticity
    if (!signature || signature !== secretHash) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = await request.json();

    console.log("Flutterwave webhook received:", {
      event: body.event,
      txRef: body.data?.tx_ref,
      status: body.data?.status,
    });

    // Handle different webhook events
    if (body.event === "charge.completed") {
      const paymentData = body.data;

      // Only process successful payments
      if (paymentData.status === "successful") {
        // Extract donation details
        const donationInfo = {
          transactionId: paymentData.id,
          txRef: paymentData.tx_ref,
          amount: paymentData.amount,
          currency: paymentData.currency,
          projectId: paymentData.meta?.project_id,
          projectName: paymentData.meta?.project_name,
          donorEmail: paymentData.customer.email,
          donorName: paymentData.customer.name,
          donorPhone: paymentData.customer.phone_number,
          paymentType: paymentData.payment_type,
          createdAt: paymentData.created_at,
        };

        console.log("Successful donation:", donationInfo);

        // TODO: Save to Firestore
        // TODO: Queue for crypto conversion
        // TODO: Send confirmation email to donor

        // For now, just log it
        // You'll implement the actual saving in the next step

        return NextResponse.json({
          success: true,
          message: "Webhook processed successfully",
        });
      }
    }

    // Return success for all webhook calls
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook processing error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Webhook processing failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
