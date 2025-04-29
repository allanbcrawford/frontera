import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useToast } from "./use-toast";

interface AvatarUploadProps {
  currentUser: {
    id: string;
    email?: string;
    avatar_url?: string;
  };
  firstName?: string;
  onUploadComplete?: (url: string) => void;
  size?: "sm" | "md" | "lg";
  showUploadButton?: boolean;
  className?: string;
}

export function AvatarUpload({
  currentUser,
  firstName,
  onUploadComplete,
  size = "md",
  showUploadButton = true,
  className,
}: AvatarUploadProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-20 w-20",
    lg: "h-24 w-24",
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser.id}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update user profile with new avatar URL
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', currentUser.id);

      if (updateError) throw updateError;

      // Call the callback with the new URL
      onUploadComplete?.(publicUrl);

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <div
        className={cn("relative", className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Avatar className={cn(
          sizeClasses[size],
          "border-2 border-white shadow-md transition-transform",
          isHovered && "scale-[1.02]"
        )}>
          <AvatarImage
            src={currentUser.avatar_url}
            alt={firstName || currentUser.email}
          />
          <AvatarFallback className="text-lg">
            {firstName?.[0]?.toUpperCase() || currentUser.email?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {showUploadButton && isHovered && (
          <div className="absolute inset-0 flex items-end justify-center bg-black/40 rounded-full cursor-pointer transition-opacity"
               onClick={() => fileInputRef.current?.click()}>
            <div className="text-white text-xs mb-2">
              {isUploading ? "Uploading..." : "Edit"}
            </div>
          </div>
        )}

        {showUploadButton && (
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            disabled={isUploading}
          />
        )}
      </div>

      {showUploadButton && (
        <Button
          size="icon"
          variant="secondary"
          className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Camera className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
} 