import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { userAtom } from '../../atoms/authAtom'
import { logoutUser } from '../../api/api';
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useToast } from "../../hooks/use-toast"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const setUser = useSetAtom(userAtom);
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "An error occurred while logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="text-2xl font-bold">Car Management</Link>
          <form onSubmit={handleSearch} className="flex-1 mx-4">
            <Input
              type="search"
              placeholder="Search cars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </form>
          <nav>
            <Button variant="ghost" onClick={handleLogout}>Logout</Button>
          </nav>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 py-4 text-center">
          © 2023 Car Management App
        </div>
      </footer>
    </div>
  );
}