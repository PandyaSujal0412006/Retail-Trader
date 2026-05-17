"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Shield, ArrowLeft, Loader2, Send } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import Link from "next/link";

type PlanType = "plus" | "pro";

const PLANS = {
  plus: {
    name: "Plus Plan",
    price: 10,
    features: [
      "Up to 10 Trade Imports",
      "Basic Equity Curve Analytics",
      "Standard Support"
    ],
  },
  pro: {
    name: "Pro Plan",
    price: 300,
    features: [
      "Unlimited Trade Imports",
      "Advanced Equity Curve Analytics",
      "Broker Auto-Sync (Coming Soon)",
      "Priority Email Support"
    ],
  }
};

export default function PricingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      alert("Please enter a valid Transaction ID.");
      return;
    }
    if (!selectedPlan) return;
    
    setIsProcessing(true);

    try {
      await addDoc(collection(db, "paymentRequests"), {
        userId: user.uid,
        email: user.email,
        transactionId: transactionId.trim(),
        amount: PLANS[selectedPlan].price,
        plan: selectedPlan,
        status: "pending",
        createdAt: new Date().toISOString()
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Failed to submit payment request. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0B1120] grid-bg flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-4 p-8 bg-[#0F172A] border border-[#1e2d4a] rounded-xl max-w-md w-full">
          <Check className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-2xl font-bold text-white">Request Submitted!</h3>
          <p className="text-slate-400">
            We will verify your payment and upgrade your account to the <strong className="text-emerald-400">{PLANS[selectedPlan!].name}</strong> within 24 hours.
          </p>
          <Button variant="outline" className="mt-4 w-full text-slate-300 border-slate-700 bg-transparent hover:bg-slate-800" onClick={() => router.push("/")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] grid-bg flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between border-b border-[#1e2d4a]">
        <Link href="/" className="flex items-center text-sm text-slate-400 hover:text-emerald-400 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-10">
        {!selectedPlan ? (
          <>
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-500/10 mb-4">
                <Shield className="w-8 h-8 text-emerald-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Choose Your Plan
              </h1>
              <p className="text-slate-400 max-w-lg mx-auto">
                Select a plan that fits your trading volume.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
              <Card className="border-[#1e2d4a] bg-[#0F172A] hover:border-emerald-500/50 transition-colors cursor-pointer" onClick={() => setSelectedPlan("plus")}>
                <CardHeader className="text-center">
                  <CardTitle className="text-xl text-slate-100">Plus Plan</CardTitle>
                  <div className="flex items-end justify-center gap-1 mt-2">
                    <span className="text-4xl font-bold text-white">₹10</span>
                  </div>
                  <CardDescription className="text-slate-400 mt-2">Perfect for casual traders.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {PLANS.plus.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-slate-300">
                        <Check className="w-4 h-4 text-emerald-500 mr-3 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white">Select Plus</Button>
                </CardContent>
              </Card>

              <Card className="border-emerald-500/30 bg-[#0F172A] shadow-xl shadow-emerald-500/10 hover:border-emerald-500 transition-colors cursor-pointer relative overflow-hidden" onClick={() => setSelectedPlan("pro")}>
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                  Recommended
                </div>
                <CardHeader className="text-center">
                  <CardTitle className="text-xl text-emerald-400">Pro Plan</CardTitle>
                  <div className="flex items-end justify-center gap-1 mt-2">
                    <span className="text-4xl font-bold text-emerald-400">₹300</span>
                    <span className="text-slate-500 mb-1">/ year</span>
                  </div>
                  <CardDescription className="text-slate-400 mt-2">For active and professional traders.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {PLANS.pro.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-slate-300">
                        <Check className="w-4 h-4 text-emerald-500 mr-3 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Select Pro</Button>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="w-full max-w-md animate-fade-in">
            <button onClick={() => setSelectedPlan(null)} className="text-sm text-slate-400 hover:text-white mb-6 flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" /> Change Plan
            </button>
            <Card className="border-emerald-500/30 bg-[#0F172A] shadow-2xl shadow-emerald-500/10">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl text-slate-100">{PLANS[selectedPlan].name}</CardTitle>
                <div className="flex items-end justify-center gap-1 mt-4">
                  <span className="text-4xl font-bold text-emerald-400">₹{PLANS[selectedPlan].price}</span>
                </div>
              </CardHeader>
              <CardContent className="mt-6 space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-slate-200">Scan to Pay via GPay / UPI</p>
                  <div className="bg-white p-2 rounded-xl inline-block mx-auto border-4 border-slate-800">
                    <img 
                      src="/QR.jpeg" 
                      alt="UPI QR Code" 
                      className="w-40 h-40 object-cover"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Please pay exactly <strong>₹{PLANS[selectedPlan].price}</strong> using BHIM, GPay, PhonePe, or Paytm.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="txnid" className="text-slate-300">UPI Transaction ID / Reference No.</Label>
                    <Input 
                      id="txnid" 
                      placeholder="e.g. 123456789012" 
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      required
                      className="font-mono"
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-11" 
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                    ) : (
                      <><Send className="w-4 h-4 mr-2" /> Submit Payment</>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
