import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Shield, Target, Award, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock achievements data
const ACHIEVEMENTS = [
  {
    id: "inventory-master",
    title: "Inventory Master",
    description: "Maintain a well-organized inventory with at least 50 items",
    icon: <Shield className="h-5 w-5" />,
    progress: 84,
    completed: true,
    points: 20,
  },
  {
    id: "community-leader",
    title: "Community Leader",
    description: "Create and manage an active tract with 100+ members",
    icon: <Star className="h-5 w-5" />,
    progress: 64,
    completed: false,
    points: 25,
  },
  {
    id: "knowledge-seeker",
    title: "Knowledge Seeker",
    description: "Bookmark and complete 10 resource guides",
    icon: <Target className="h-5 w-5" />,
    progress: 40,
    completed: false,
    points: 15,
  },
  {
    id: "first-responder",
    title: "First Responder",
    description: "Complete all medical preparedness resources",
    icon: <Zap className="h-5 w-5" />,
    progress: 90,
    completed: true,
    points: 30,
  },
];

// Mock level thresholds
const LEVEL_THRESHOLDS = [
  { level: 1, points: 0 },
  { level: 2, points: 50 },
  { level: 3, points: 100 },
  { level: 4, points: 200 },
  { level: 5, points: 350 },
];

export function PreparednessScore() {
  const [currentPoints] = useState(75); // Mock current points
  const currentLevel = LEVEL_THRESHOLDS.findIndex(threshold => currentPoints < threshold.points) || LEVEL_THRESHOLDS.length;
  const prevThreshold = LEVEL_THRESHOLDS[currentLevel - 1]?.points || 0;
  const nextThreshold = LEVEL_THRESHOLDS[currentLevel]?.points || prevThreshold;
  const levelProgress = ((currentPoints - prevThreshold) / (nextThreshold - prevThreshold)) * 100;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">View Your Preparedness Score</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Preparedness Score</DialogTitle>
          <DialogDescription>
            Track your progress and unlock achievements
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Level Progress */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <h3 className="text-2xl font-bold">Level {currentLevel}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {currentPoints} / {nextThreshold} points to next level
            </p>
            <Progress value={levelProgress} className="h-2" />
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 text-center p-4 rounded-lg bg-muted/50">
              <Award className="h-5 w-5 mx-auto text-frontera-600" />
              <p className="text-2xl font-bold">{currentPoints}</p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
            <div className="space-y-1 text-center p-4 rounded-lg bg-muted/50">
              <Trophy className="h-5 w-5 mx-auto text-yellow-500" />
              <p className="text-2xl font-bold">
                {ACHIEVEMENTS.filter(a => a.completed).length}
              </p>
              <p className="text-sm text-muted-foreground">Achievements</p>
            </div>
          </div>

          {/* Achievements List */}
          <Accordion type="single" collapsible className="w-full">
            {ACHIEVEMENTS.map((achievement) => (
              <AccordionItem key={achievement.id} value={achievement.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      achievement.completed ? "bg-frontera-500/10 text-frontera-600" : "bg-muted text-muted-foreground"
                    )}>
                      {achievement.icon}
                    </div>
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{achievement.title}</span>
                        {achievement.completed && (
                          <Badge variant="secondary" className="text-[10px]">
                            +{achievement.points} pts
                          </Badge>
                        )}
                      </div>
                      <Progress 
                        value={achievement.progress} 
                        className="h-1 w-24"
                      />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-12 pt-2">
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="text-xs text-muted-foreground">
                        Progress: {achievement.progress}%
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
} 