
import PageHeader from "@/components/dashboard/PageHeader";

export default function Settings() {
  return (
    <div className="container p-6">
      <PageHeader title="Settings" />
      <div className="rounded-lg border bg-card p-8 shadow-sm">
        <p className="text-muted-foreground">Configure your settings here.</p>
      </div>
    </div>
  );
}
