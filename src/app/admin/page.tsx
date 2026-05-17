"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, XCircle, ShieldAlert, ArrowLeft, Users, CreditCard, Activity } from "lucide-react";
import Link from "next/link";

interface PaymentRequest {
  id: string;
  userId: string;
  email: string;
  transactionId: string;
  amount: number;
  plan: "plus" | "pro";
  status: string;
  createdAt: string;
}

export default function AdminPage() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Dashboard State
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [fetching, setFetching] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Extra Stats
  const [stats, setStats] = useState({ totalRevenue: 0, pendingCount: 0, approvedCount: 0 });

  // 1. Check local storage for admin session on mount
  useEffect(() => {
    const adminSession = localStorage.getItem("admin_session");
    if (adminSession === "true") {
      setIsAdminLoggedIn(true);
      fetchRequests();
    }
    setAuthChecking(false);
  }, []);

  // 2. Handle Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (email === "sujal.pandya0412006@gmail.com" && password === "Sujal@04") {
      localStorage.setItem("admin_session", "true");
      setIsAdminLoggedIn(true);
      fetchRequests();
    } else {
      setLoginError("Invalid admin credentials.");
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("admin_session");
    setIsAdminLoggedIn(false);
    setRequests([]);
  };

  // 3. Fetch Dashboard Data
  const fetchRequests = async () => {
    setFetching(true);
    try {
      // Fetch Pending
      const qPending = query(collection(db, "paymentRequests"), where("status", "==", "pending"));
      const snapPending = await getDocs(qPending);
      const pendingData: PaymentRequest[] = [];
      snapPending.forEach((doc) => {
        pendingData.push({ id: doc.id, ...doc.data() } as PaymentRequest);
      });
      pendingData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      // Fetch Approved (for stats)
      const qApproved = query(collection(db, "paymentRequests"), where("status", "==", "approved"));
      const snapApproved = await getDocs(qApproved);
      let revenue = 0;
      snapApproved.forEach((doc) => {
        revenue += doc.data().amount || 0;
      });

      setRequests(pendingData);
      setStats({
        totalRevenue: revenue,
        pendingCount: pendingData.length,
        approvedCount: snapApproved.size
      });
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    } finally {
      setFetching(false);
    }
  };

  // 4. Approve Payment
  const handleApprove = async (request: PaymentRequest) => {
    setProcessingId(request.id);
    try {
      const isPro = request.plan === "pro";
      // Upgrade user
      await updateDoc(doc(db, "users", request.userId), {
        tier: request.plan,
        isPro: isPro
      });

      // Mark request as approved
      await updateDoc(doc(db, "paymentRequests", request.id), {
        status: "approved",
      });

      // Update UI state
      setRequests((prev) => prev.filter((r) => r.id !== request.id));
      setStats((prev) => ({
        ...prev,
        pendingCount: prev.pendingCount - 1,
        approvedCount: prev.approvedCount + 1,
        totalRevenue: prev.totalRevenue + request.amount
      }));
      alert(`Successfully upgraded ${request.email} to ${request.plan}!`);
    } catch (err) {
      console.error("Error approving request:", err);
      alert("Failed to approve request.");
    } finally {
      setProcessingId(null);
    }
  };

  // 5. Reject Payment
  const handleReject = async (request: PaymentRequest) => {
    if (!confirm(`Are you sure you want to reject payment for ${request.email}?`)) return;
    
    setProcessingId(request.id);
    try {
      await updateDoc(doc(db, "paymentRequests", request.id), {
        status: "rejected",
      });
      setRequests((prev) => prev.filter((r) => r.id !== request.id));
      setStats((prev) => ({ ...prev, pendingCount: prev.pendingCount - 1 }));
    } catch (err) {
      console.error("Error rejecting request:", err);
      alert("Failed to reject request.");
    } finally {
      setProcessingId(null);
    }
  };

  // LOADING SCREEN
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  // LOGIN SCREEN
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1120] p-4">
        <div className="absolute top-6 left-6">
          <Link href="/" className="flex items-center text-sm text-slate-400 hover:text-emerald-400">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to App
          </Link>
        </div>
        <Card className="w-full max-w-md border-indigo-500/30 bg-[#0F172A] shadow-2xl shadow-indigo-500/10">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4 border border-indigo-500/20">
              <ShieldAlert className="w-6 h-6 text-indigo-400" />
            </div>
            <CardTitle className="text-2xl text-slate-100">Admin Portal</CardTitle>
            <CardDescription className="text-slate-400">Authorized personnel only.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center">
                  {loginError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="admin_email">Email</Label>
                <Input 
                  id="admin_email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tradevault.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin_password">Password</Label>
                <Input 
                  id="admin_password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-4">
                Access Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ADMIN DASHBOARD SCREEN
  return (
    <div className="min-h-screen bg-[#0B1120] p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1e2d4a] pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
              <ShieldAlert className="w-8 h-8 text-indigo-500 mr-3" />
              TradeVault Command Center
            </h1>
            <p className="text-slate-400 mt-2">Manage users, approve payments, and view platform analytics.</p>
          </div>
          <Button variant="outline" className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10" onClick={handleAdminLogout}>
            Exit Admin Mode
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-emerald-500/20 bg-[#0F172A]">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-emerald-500/10 rounded-lg">
                <CreditCard className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium">Total Revenue</p>
                <h3 className="text-2xl font-bold text-slate-100">₹{stats.totalRevenue.toLocaleString("en-IN")}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-indigo-500/20 bg-[#0F172A]">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-indigo-500/10 rounded-lg">
                <Users className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium">Approved Upgrades</p>
                <h3 className="text-2xl font-bold text-slate-100">{stats.approvedCount} Users</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-500/20 bg-[#0F172A]">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <Activity className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium">Pending Approvals</p>
                <h3 className="text-2xl font-bold text-slate-100">{stats.pendingCount} Requests</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests Table */}
        <Card className="border-slate-800 bg-[#0F172A]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-slate-100">Verification Queue</CardTitle>
              <CardDescription className="text-slate-400 mt-1">Review user payments and upgrade their accounts.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchRequests} disabled={fetching} className="text-slate-300 border-slate-700">
              {fetching ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Refresh Data
            </Button>
          </CardHeader>
          <CardContent className="mt-4">
            {fetching && requests.length === 0 ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/50">
                <CheckCircle className="w-12 h-12 text-emerald-500/50 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-slate-300">All caught up!</h3>
                <p className="text-slate-500 mt-1">There are no pending payment requests.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-800">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-900/80 border-b border-slate-800">
                    <tr>
                      <th className="px-5 py-4 font-medium">Request Date</th>
                      <th className="px-5 py-4 font-medium">User Email</th>
                      <th className="px-5 py-4 font-medium">Transaction ID</th>
                      <th className="px-5 py-4 font-medium">Requested Plan</th>
                      <th className="px-5 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {requests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-4 text-slate-400">
                          {new Date(req.createdAt).toLocaleString()}
                        </td>
                        <td className="px-5 py-4 text-slate-200 font-medium">
                          {req.email}
                        </td>
                        <td className="px-5 py-4 font-mono">
                          <span className="bg-slate-900 px-2 py-1 rounded text-emerald-400 border border-emerald-500/20">{req.transactionId}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${req.plan === 'pro' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                            {req.plan || "PRO"} (₹{req.amount})
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right space-x-3 whitespace-nowrap">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors shadow-lg shadow-emerald-500/5"
                            onClick={() => handleApprove(req)}
                            disabled={processingId === req.id}
                          >
                            {processingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-1.5" />}
                            Verify & Upgrade
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                            onClick={() => handleReject(req)}
                            disabled={processingId === req.id}
                          >
                            <XCircle className="w-4 h-4 mr-1.5" />
                            Reject
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
