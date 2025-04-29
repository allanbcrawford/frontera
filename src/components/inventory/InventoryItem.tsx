
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";

interface InventoryItemProps {
  item: {
    id: string;
    name: string;
    category: string;
    quantity: number;
    expiryDate: string | null;
    location: string;
  };
}

export function InventoryItem({ item }: InventoryItemProps) {
  // Check if item is expiring soon (within 3 months)
  const isExpiringSoon = () => {
    if (!item.expiryDate) return false;
    
    const expiryDate = new Date(item.expiryDate);
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);
    
    return expiryDate <= threeMonthsFromNow && expiryDate > today;
  };
  
  // Format the expiry date
  const formatExpiryDate = () => {
    if (!item.expiryDate) return "No expiry";
    
    const date = new Date(item.expiryDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-subtle">
      <CardContent className="p-0">
        <div className="flex items-center border-l-4 border-frontera-500 p-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-base truncate">{item.name}</h3>
              <Badge variant="outline" className="hidden sm:inline-flex">
                {item.category}
              </Badge>
              {isExpiringSoon() && (
                <Badge variant="destructive" className="hidden sm:inline-flex">
                  Expiring Soon
                </Badge>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Qty: <strong>{item.quantity}</strong></span>
                <span className="hidden sm:inline-block">•</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span>Location: <strong>{item.location}</strong></span>
                <span className="hidden sm:inline-block">•</span>
              </div>
              
              <div>
                <span>Expires: <strong>{formatExpiryDate()}</strong></span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
