"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";

export function PageClient() {
  const router = useRouter();
  const user = useUser({ or: "redirect" });
  const teams = user.useTeams();
  const [teamDisplayName, setTeamDisplayName] = React.useState("");

  React.useEffect(() => {
    if (teams.length > 0 && !user.selectedTeam) {
      user.setSelectedTeam(teams[0]);
    }
  }, [teams, user]);

  if (teams.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-blue-600 dark:text-blue-400">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome to Rowdy Mail!</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Create your team to start managing temporary emails
            </p>
          </div>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (teamDisplayName.trim()) {
                user.createTeam({ displayName: teamDisplayName.trim() });
              }
            }}
          >
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Team Name</Label>
              <Input
                placeholder="Enter your team name (e.g., My Company, Dev Team)"
                value={teamDisplayName}
                onChange={(e) => setTeamDisplayName(e.target.value)}
                className="mt-1"
                required
              />
              <p className="text-xs text-gray-500 mt-1">This will be used to organize your temporary emails</p>
            </div>
            <Button 
              className="w-full h-11 text-base font-medium" 
              disabled={!teamDisplayName.trim()}
            >
              Create Team & Get Started
            </Button>
          </form>
        </div>
      </div>
    );
  } else if (user.selectedTeam) {
    router.push(`/dashboard/${user.selectedTeam.id}`);
  }

  return null;
}
