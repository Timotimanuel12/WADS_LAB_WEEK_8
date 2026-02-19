"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, BrainCircuit, CheckCircle, Clock, Plus, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const mockTasks = [
    { id: 1, title: "Calculus Final Exam Prep", subject: "Math 202", due: "Friday, 10:00 AM", priority: "HIGH" },
    { id: 2, title: "History Essay Draft", subject: "History 101", due: "Tomorrow, 11:59 PM", priority: "MEDIUM" },
    { id: 3, title: "Read Chapter 4-5", subject: "Physics", due: "Next Monday", priority: "LOW" },
  ];

  // Helper to color-code shadcn badges based on priority
  const getBadgeVariant = (priority: string) => {
    switch (priority) {
      case "HIGH": return "destructive"; // Red in shadcn
      case "MEDIUM": return "default";   // Black/Primary in shadcn
      case "LOW": return "secondary";    // Gray in shadcn
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* --- Top Navigation Bar --- */}
      <nav className="border-b bg-white px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">F</div>
          <h1 className="text-xl font-bold text-gray-900">FocusFlow</h1>
        </div>
        
        <Button 
          variant="ghost" 
          className="text-gray-500 hover:text-red-600"
          onClick={() => router.push('/')} // Mock logout routing back to login
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </nav>

      {/* --- Main Dashboard Content --- */}
      <main className="flex-1 p-8 max-w-6xl mx-auto w-full space-y-8">
        
        {/* Header Area */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back, Alex! 👋</h2>
            <p className="text-muted-foreground mt-1">You have 2 high-priority tasks pending.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-2" /> Add New Task
          </Button>
        </div>

        {/* --- Stats Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Focus Score</CardTitle>
              <Zap className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">84%</div>
              <p className="text-xs text-muted-foreground">+2% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks AI Prioritized</CardTitle>
              <BrainCircuit className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">12</div>
              <p className="text-xs text-muted-foreground">3 saved hours of planning</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">3</div>
              <p className="text-xs text-muted-foreground">2 tasks remaining</p>
            </CardContent>
          </Card>
        </div>

        {/* --- Task List Section --- */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center border-b pb-4">
            <div>
              <CardTitle className="text-xl">Your Smart Schedule</CardTitle>
              <CardDescription>Tasks sorted dynamically by AI priority.</CardDescription>
            </div>
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
              <BrainCircuit className="w-3 h-3 mr-1" /> AI Active
            </Badge>
          </CardHeader>
          
          <CardContent className="pt-6 space-y-4">
            {mockTasks.map((task) => (
              <div 
                key={task.id} 
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {/* Using Shadcn Badge for Priority */}
                    <Badge variant={getBadgeVariant(task.priority) as any}>
                      {task.priority} PRIORITY
                    </Badge>
                    <span className="text-xs font-medium text-muted-foreground">{task.subject}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    Due: {task.due}
                  </div>
                </div>

                <Button variant="secondary" size="sm">
                  Start Focus
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

      </main>
    </div>
  );
}