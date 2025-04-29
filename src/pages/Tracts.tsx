import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { TractsLayout } from "@/components/tracts/TractsLayout";
import { CreateTractForm } from "@/components/tracts/CreateTractForm";

export default function Tracts() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tracts</h1>
            <p className="text-muted-foreground">Manage your locations and community</p>
          </div>
          <CreateTractForm />
        </div>
        
        <TractsLayout />
      </div>
    </AppLayout>
  );
}
