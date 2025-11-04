import { NextRequest, NextResponse } from "next/server";
import Flutterwave from "flutterwave-node-v3";

// Initialize Flutterwave
const flw = new Flutterwave(
  process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || "",
  process.env.FLUTTERWAVE_SECRET_KEY || ""
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      amount,
      currency,
      projectId,
      projectName,
      donorEmail,
      donorName,
      donorPhone,
      paymentMethod, // "card" or "mobilemoney"
    } = body;

    // Validation
    if (!amount || !currency || !projectId || !donorEmail || !donorName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (amount < 100) {
      return NextResponse.json(
        { error: "Minimum donation is 100 " + currency },
        { status: 400 }
      );
    }

    // Generate unique transaction reference
    const txRef = `PAYSMILE-${projectId}-${Date.now()}`;

    // Prepare payment payload
    const payload = {
      tx_ref: txRef,
      amount: amount,
      currency: currency,
      redirect_url: `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/donation-success?project=${projectId}&ref=${txRef}`,
      payment_options:
        paymentMethod === "mobilemoney"
          ? "mobilemoneyuganda,mobilemoneyghana,mobilemoneyrwanda,mobilemoneyzambia,mobilemoneyfranco"
          : "card",
      customer: {
        email: donorEmail,
        name: donorName,
        phonenumber: donorPhone || "",
      },
      customizations: {
        title: `Donate to ${projectName}`,
        description: `PaySmile Charitable Donation - Project #${projectId}`,
        logo: `${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }/logo.png`,
      },
      meta: {
        project_id: projectId,
        project_name: projectName,
        payment_type: "donation",
      },
    };

    // Create payment link
    const response = await flw.Charge.card(payload);

    console.log("Flutterwave payment initiated:", {
      txRef,
      projectId,
      amount,
      currency,
    });

    // Return payment URL to redirect user
    return NextResponse.json({
      success: true,
      paymentUrl: response.meta.authorization.redirect,
      transactionRef: txRef,
      message: "Payment initialized successfully",
    });
  } catch (error: any) {
    console.error("Flutterwave API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to initialize payment",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// GET endpoint to verify payment status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get("transaction_id");
    const txRef = searchParams.get("tx_ref");

    if (!transactionId && !txRef) {
      return NextResponse.json(
        { error: "Missing transaction_id or tx_ref" },
        { status: 400 }
      );
    }

    // Verify transaction
    const response = await flw.Transaction.verify({
      id: transactionId || txRef,
    });

    if (
      response.data.status === "successful" &&
      response.data.amount >= response.data.amount &&
      response.data.currency === response.data.currency
    ) {
      return NextResponse.json({
        success: true,
        status: "successful",
        data: {
          transactionId: response.data.id,
          txRef: response.data.tx_ref,
          amount: response.data.amount,
          currency: response.data.currency,
          paymentType: response.data.payment_type,
          projectId: response.data.meta?.project_id,
          customerEmail: response.data.customer.email,
          customerName: response.data.customer.name,
        },
      });
    }

    return NextResponse.json({
      success: false,
      status: response.data.status,
      message: "Payment not successful",
    });
  } catch (error: any) {
    console.error("Flutterwave verification error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to verify payment",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
