'use client';

import { DollarSign, Users, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LeadsDataTable } from "@/components/dashboard/LeadsDataTable";
import { leadsAPI } from "@/lib/leads";
import { Skeleton } from "@/components/ui/skeleton";

const COMMISSION_RATE = 0.10; // 10%

import type { Lead } from "@/lib/types";

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const response = await leadsAPI.getLeads();
        
        if (response.success) {
          // console.log("Leads fetched successfully:", response.data.data.leads); // Debug log
          setLeads(Array.isArray(response.data.data.leads) ? response.data.data.leads : []);
        } else {
          setError(response.error || "Failed to fetch leads");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-full mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-full mt-2" />
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-accent/20 to-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
              <DollarSign className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-full mt-2" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(
    (lead) => lead.Stage === "Qualified" || lead.Stage === "Closed"
  ).length;
  const totalCommission = leads
    .filter((lead) => lead.Stage === "Closed")
    .reduce((acc, lead) => acc + (lead.Budget || 0) * COMMISSION_RATE, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">All leads you've uploaded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qualifiedLeads}</div>
            <p className="text-xs text-muted-foreground">Leads in Qualified or Closed Stage</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-accent/20 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(totalCommission)}
            </div>
            <p className="text-xs text-muted-foreground">Revenue from closed deals</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Your Leads</CardTitle>
        </CardHeader>
        <CardContent>
            <LeadsDataTable leads={leads} />
        </CardContent>
      </Card>
    </div>
  );
}