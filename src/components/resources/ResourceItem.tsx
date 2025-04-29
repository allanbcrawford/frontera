
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookmarkIcon, BookOpen, Star, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResourceItemProps {
  resource: {
    id: string;
    title: string;
    type: string;
    description: string;
    author: string;
    dateAdded: string;
    category: string;
    rating: number;
    bookmarked: boolean;
  };
}

export function ResourceItem({ resource }: ResourceItemProps) {
  // Format the date added
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  const getRatingStars = (rating: number) => {
    // Round to nearest half
    const roundedRating = Math.round(rating * 2) / 2;
    
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-3 w-3",
              star <= roundedRating
                ? "text-frontera-500 fill-frontera-500"
                : star - 0.5 === roundedRating
                ? "text-frontera-500 fill-frontera-500/50"
                : "text-muted-foreground/20"
            )}
          />
        ))}
        <span className="ml-1 text-xs text-muted-foreground">
          {rating}
        </span>
      </div>
    );
  };
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-subtle">
      <CardContent className="p-0">
        <div className="flex items-start p-4">
          <div className="mr-4 mt-1">
            <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
              <h3 className="font-medium text-base">{resource.title}</h3>
              
              <div className="flex items-center space-x-2">
                <Badge variant={resource.type === 'Guide' ? 'default' : 'secondary'} className="text-xs">
                  {resource.type}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8", 
                    resource.bookmarked ? "text-frontera-500" : "text-muted-foreground"
                  )}
                >
                  <BookmarkIcon className={cn("h-4 w-4", resource.bookmarked && "fill-frontera-500")} />
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {resource.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <div>
                By <span className="font-medium">{resource.author}</span>
              </div>
              
              <div>
                Added {formatDate(resource.dateAdded)}
              </div>
              
              <div className="flex items-center">
                <Badge variant="outline" className="text-xs mr-2">
                  {resource.category}
                </Badge>
                {getRatingStars(resource.rating)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t px-4 py-2 bg-card/50 text-right">
          <Button variant="ghost" size="sm" className="text-frontera-500 gap-1">
            <span>View Resource</span>
            <ArrowUpRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
