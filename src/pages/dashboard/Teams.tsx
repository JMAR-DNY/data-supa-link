
import PageHeader from "@/components/dashboard/PageHeader";

export default function Teams() {
  return (
    <div className="container p-6">
      <PageHeader title="Teams" />
      <div className="rounded-lg border bg-card p-8 shadow-sm">
        <p className="text-muted-foreground">Manage your teams here.</p>
      </div>
    </div>
  );
}
