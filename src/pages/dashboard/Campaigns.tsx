
import PageHeader from "@/components/dashboard/PageHeader";

export default function Campaigns() {
  return (
    <div className="container p-6">
      <PageHeader title="Campaigns" />
      <div className="rounded-lg border bg-card p-8 shadow-sm">
        <p className="text-muted-foreground">Manage your campaigns here.</p>
      </div>
    </div>
  );
}
