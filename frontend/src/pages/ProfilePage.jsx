import React from 'react';
import { Button } from '@/components/ui/Button';

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-[70vh]">
      <h1 className="text-3xl font-bold text-text-primary mb-8">My Profile</h1>
      
      <div className="bg-surface border border-border rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-text-primary">User Information</h2>
        <div className="space-y-3 text-text-secondary">
          <p><span className="font-medium text-text-primary">Name:</span> John Doe</p>
          <p><span className="font-medium text-text-primary">Email:</span> john.doe@example.com</p>
        </div>
        <p className="mt-4 text-sm text-text-muted italic">Note: This will connect to backend authentication.</p>
        <div className="mt-6">
          <Button variant="secondary">Logout</Button>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-text-primary">My Bookings</h2>
        <div className="py-8 text-center text-text-muted bg-surface-elevated rounded-lg border border-border border-dashed">
          <p>No bookings found.</p>
        </div>
      </div>
    </div>
  );
}
