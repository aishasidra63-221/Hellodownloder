import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <header className="space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-extrabold text-foreground">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: June 2025</p>
      </header>

      <div className="bg-card border border-border rounded-2xl p-6">
        <p className="text-sm text-muted-foreground">Privacy policy content coming soon.</p>
      </div>
    </div>
  );
}
