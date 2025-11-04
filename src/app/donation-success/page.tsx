"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, XCircle, ArrowLeft } from "lucide-react";

function DonationSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading"
  );
  const [donationData, setDonationData] = useState<any>(null);

  const projectId = searchParams.get("project");
  const txRef = searchParams.get("ref");
  const transactionId = searchParams.get("transaction_id");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!transactionId && !txRef) {
        setStatus("failed");
        return;
      }

      try {
        const response = await fetch(
          `/api/donations/fiat?transaction_id=${transactionId || ""}&tx_ref=${
            txRef || ""
          }`
        );
        const data = await response.json();

        if (data.success && data.status === "successful") {
          setStatus("success");
          setDonationData(data.data);
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Payment verification failed:", error);
        setStatus("failed");
      }
    };

    verifyPayment();
  }, [transactionId, txRef]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <h2 className="text-xl font-semibold">Verifying Payment...</h2>
              <p className="text-muted-foreground">
                Please wait while we confirm your donation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-center text-2xl">
              Donation Successful! 🎉
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
              <p className="text-sm text-green-900 dark:text-green-100 text-center">
                Thank you for your generous donation! Your contribution will be
                converted to cryptocurrency and sent to the project shortly.
              </p>
            </div>

            {donationData && (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">
                    {donationData.amount} {donationData.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className="font-mono text-xs">
                    {donationData.transactionId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{donationData.customerEmail}</span>
                </div>
              </div>
            )}

            <div className="pt-4 space-y-2">
              <p className="text-sm text-muted-foreground text-center">
                📧 A receipt has been sent to your email.
              </p>
              <p className="text-sm text-muted-foreground text-center">
                🔗 Your donation will be recorded on the blockchain for
                transparency.
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push("/dashboard")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button
                className="flex-1"
                onClick={() => router.push(`/projects`)}
              >
                View Projects
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Failed status
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-destructive" />
          </div>
          <CardTitle className="text-center text-2xl">Payment Failed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
            <p className="text-sm text-center">
              We couldn&apos;t verify your payment. This could be because:
            </p>
            <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
              <li>The payment was not completed</li>
              <li>The payment was declined</li>
              <li>There was a network issue</li>
            </ul>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            If you were charged, please contact support with your transaction
            reference.
          </p>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button className="flex-1" onClick={() => router.push(`/projects`)}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DonationSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <DonationSuccessContent />
    </Suspense>
  );
}
