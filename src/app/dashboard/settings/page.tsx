"use client";

import { useState } from "react";
import { User, Shield, Globe } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account preferences and portal settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Menu */}
        <div className="md:col-span-1 space-y-1">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-3 py-2 rounded-lg font-medium text-sm flex items-center transition-colors ${
              activeTab === "profile" 
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" 
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <User className="w-4 h-4 mr-2" /> Profile
          </button>
          
          <button 
            onClick={() => setActiveTab("security")}
            className={`w-full text-left px-3 py-2 rounded-lg font-medium text-sm flex items-center transition-colors ${
              activeTab === "security" 
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" 
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Shield className="w-4 h-4 mr-2" /> Security
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          
          {/* PROFILE SETTINGS */}
          {activeTab === "profile" && (
            <form onSubmit={handleSave} className="glass-card rounded-xl border border-border p-6 animate-in fade-in zoom-in-95 duration-200">
              <h3 className="text-lg font-semibold mb-6">Profile Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center text-2xl font-bold border border-emerald-200 dark:border-emerald-800">
                    JS
                  </div>
                  <div>
                    <button type="button" className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">Change Avatar</button>
                    <p className="text-xs text-muted-foreground mt-1">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">First Name</label>
                    <input type="text" defaultValue="John" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Last Name</label>
                    <input type="text" defaultValue="Smith" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Email Address</label>
                  <input type="email" defaultValue="john.smith@apexapparels.com" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Role / Title</label>
                  <input type="text" defaultValue="Sustainability Manager" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                  <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm">
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* SECURITY SETTINGS */}
          {activeTab === "security" && (
            <form onSubmit={handleSave} className="glass-card rounded-xl border border-border p-6 animate-in fade-in zoom-in-95 duration-200">
              <h3 className="text-lg font-semibold mb-6">Security Settings</h3>
              
              <div className="space-y-5">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground border-b border-border pb-2">Change Password</h4>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Confirm New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h4 className="text-sm font-medium text-muted-foreground border-b border-border pb-2">Two-Factor Authentication (2FA)</h4>
                  
                  <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg border border-border">
                    <div>
                      <p className="text-sm font-medium">Authenticator App</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Use an app like Google Authenticator to secure your account.</p>
                    </div>
                    <button type="button" className="px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                  <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm">
                    Update Security
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
