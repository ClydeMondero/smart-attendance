import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function KpiCard({
  title,
  value,
  icon: Icon,
  note,
  trend,
}: {
  title: string;
  value: string;
  icon: any;
  note?: string;
  trend?: "up" | "down";
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          <div className="p-2 rounded-lg border">
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          {trend === "up" && <ArrowUpRight className="h-4 w-4" />}
          {trend === "down" && <ArrowDownRight className="h-4 w-4" />}
          {note
            ? note
            : trend
            ? trend === "up"
              ? "Up from yesterday"
              : "Down from yesterday"
            : ""}
        </div>
      </CardContent>
    </Card>
  );
}
