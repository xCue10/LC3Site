import { readJSON, writeJSON } from './data';
import { Activity } from './types';

export function logActivity(type: Activity['type'], description: string) {
  const activities = readJSON<Activity[]>('activity.json', []);
  const newActivity: Activity = {
    id: Math.random().toString(36).substr(2, 9),
    type,
    description,
    timestamp: new Date().toISOString(),
  };
  
  // Keep only the last 500 activities to prevent the file from growing too large
  const updated = [newActivity, ...activities].slice(0, 500);
  writeJSON('activity.json', updated);
}

export function getActivities(): Activity[] {
  return readJSON<Activity[]>('activity.json', []);
}
