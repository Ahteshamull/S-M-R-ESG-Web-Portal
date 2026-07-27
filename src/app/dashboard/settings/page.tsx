"use client";

import { User, Bell, Shield, Globe } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
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
        <div className="md:col-span-1 space-y-1">
          <button className="w-full text-left px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-medium text-sm flex items-center">
            <User className="w-4 h-4 mr-2" /> Profile
          </button>
          <button className="w-full text-left px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted font-medium text-sm flex items-center transition-colors">
            <Bell className="w-4 h-4 mr-2" /> Notifications
          </button>
          <button className="w-full text-left px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted font-medium text-sm flex items-center transition-colors">
            <Shield className="w-4 h-4 mr-2" /> Security
          </button>
          <button className="w-full text-left px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted font-medium text-sm flex items-center transition-colors">
            <Globe className="w-4 h-4 mr-2" /> Preferences
          </button>
        </div>

        <div className="md:col-span-3">
          <form onSubmit={handleSave} className="glass-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-6">Profile Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-2xl font-bold">
                  JS
                </div>
                <div>
                  <button type="button" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">Change Avatar</button>
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
                <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
