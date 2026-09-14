"use client";

import React from "react";
import { AlertTriangle, Clock, CheckCircle } from "lucide-react";

export type TabType = 'audits' | 'legal' | 'committees' | 'reports' | 'suppliers';

export function getStatusBadge(status: string) {
  switch (status) {
    case 'Overdue':
    case 'Expired':
      return (
        <span className="px-2.5 py-1 bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 rounded-full text-xs font-medium flex items-center w-fit">
          <AlertTriangle className="w-3 h-3 mr-1" /> {status}
        </span>
      );
    case 'In Progress':
    case 'Expiring Soon':
      return (
        <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 rounded-full text-xs font-medium flex items-center w-fit">
          <Clock className="w-3 h-3 mr-1" /> {status}
        </span>
      );
    case 'Closed':
    case 'Valid':
    case 'Active':
      return (
        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 rounded-full text-xs font-medium flex items-center w-fit">
          <CheckCircle className="w-3 h-3 mr-1" /> {status}
        </span>
      );
    default:
      return (
        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 rounded-full text-xs font-medium w-fit">
          {status}
        </span>
      );
  }
}

export function getSeverityBadge(severity: string) {
  switch (severity) {
    case 'Critical':
      return <span className="text-red-600 dark:text-red-400 font-bold text-xs">CRITICAL</span>;
    case 'High':
      return <span className="text-orange-600 dark:text-orange-400 font-semibold text-xs">HIGH</span>;
    case 'Medium':
      return <span className="text-yellow-600 dark:text-yellow-400 font-medium text-xs">MEDIUM</span>;
    case 'Low':
      return <span className="text-blue-600 dark:text-blue-400 font-medium text-xs">LOW</span>;
    default:
      return <span>{severity}</span>;
  }
}
