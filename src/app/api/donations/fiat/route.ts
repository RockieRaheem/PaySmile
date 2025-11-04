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
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:9002"
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
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:9002"
        }/logo.png`,
      },
      meta: {
        project_id: projectId,
        project_name: projectName,
        payment_type: "donation",
      },
    };

    console.log("Initializing Flutterwave payment with payload:", {
      txRef,
      amount,
      currency,
      paymentMethod,
    });

    // Use Flutterwave Direct API call (most reliable)
    const flutterwaveUrl = "https://api.flutterwave.com/v3/payments";

    const directResponse = await fetch(flutterwaveUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const directData = await directResponse.json();
    console.log("Direct API response:", directData);

    if (directData.status === "success" && directData.data?.link) {
      return NextResponse.json({
        success: true,
        paymentUrl: directData.data.link,
        transactionRef: txRef,
        message: "Payment initialized successfully",
      });
    }

    throw new Error(directData.message || "Failed to create payment link");
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
      id: (transactionId || txRef) as string,
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
