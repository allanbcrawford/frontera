import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import ResourcesList from "@/components/resources/ResourcesList";
import { AddResourceForm } from "@/components/resources/AddResourceForm";
import { ResourceView } from "@/components/resources/ResourceView";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Database } from "@/lib/database.types";

type Resource = Database['public']['Tables']['resources']['Row'];

export default function Resources() {
  const { user } = useAuth();
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const handleResourceSelect = (resource: Resource) => {
    setSelectedResource(resource);
  };

  const handleBookmarkToggle = (id: string, currentValue: boolean) => {
    if (selectedResource && selectedResource.id === id) {
      setSelectedResource({
        ...selectedResource,
        bookmarked: !currentValue
      });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Resources</h1>
            <p className="text-muted-foreground">Access and manage your preparedness resources</p>
          </div>
          <AddResourceForm />
        </div>
        
        <div className="flex gap-6 h-[calc(100vh-12rem)]">
          {/* Resources List - 1/3 width */}
          <Card className="w-1/3 h-full">
            <ResourcesList 
              onResourceSelect={handleResourceSelect}
              selectedResourceId={selectedResource?.id || null}
            />
          </Card>

          {/* Resource View - 2/3 width */}
          <Card className="flex-1 h-full">
            <ResourceView 
              resource={selectedResource}
              onBookmarkToggle={handleBookmarkToggle}
            />
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
