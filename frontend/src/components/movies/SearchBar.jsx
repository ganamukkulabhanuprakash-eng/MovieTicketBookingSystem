import React from 'react';
import { Search } from 'lucide-react';
import Input from '@/components/ui/Input';

export default function SearchBar({ value, onChange, placeholder = "Search for movies..." }) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-text-muted" />
      </div>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 w-full bg-surface border-border focus:border-primary focus:ring-1 focus:ring-primary text-text-primary rounded-lg py-2"
      />
    </div>
  );
}
