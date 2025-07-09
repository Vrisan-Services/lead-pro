import { DollarSign, Users, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LeadsDataTable } from "@/components/dashboard/LeadsDataTable";
import { mockLeads } from "@/data/mockData";

const COMMISSION_RATE = 0.10; // 10%

export default function DashboardPage() {
  const totalLeads = mockLeads.length;
  const qualifiedLeads = mockLeads.filter(
    (lead) => lead.stage === "Qualified" || lead.stage === "Closed"
  ).length;
  const totalCommission = mockLeads
    .filter((lead) => lead.stage === "Closed")
    .reduce((acc, lead) => acc + lead.dealValue * COMMISSION_RATE, 0);

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
            <p className="text-xs text-muted-foreground">Leads in Qualified or Closed stage</p>
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
            <LeadsDataTable leads={mockLeads} />
        </CardContent>
      </Card>
    </div>
  );
}
