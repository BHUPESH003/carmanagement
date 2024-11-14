"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, LogOut } from "lucide-react";

interface Car {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  images: string[];
}

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await fetch("/api/cars");
      const data = await res.json();
      if (Array.isArray(data)) {
        setCars(data);
      } else {
        console.error("Fetched data is not an array:", data);
        setCars([]);
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      setCars([]);
    }
  };

  const filteredCars = cars.filter(
    (car) =>
      car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card text-card-foreground shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Car Management</h1>
          <div className="flex items-center space-x-4">
            <Link legacyBehavior href="/create-car">
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Add Car
              </Button>
            </Link>
            <Button variant="destructive" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center mb-6">
            <Search className="h-5 w-5 text-muted-foreground mr-2" />
            <Input
              type="text"
              placeholder="Search cars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCars.map((car) => (
              <Card key={car._id} className="overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 relative">
                  <Image
                    src={car.images[0] || "/placeholder.svg"}
                    alt={car.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-200 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link legacyBehavior href={`/cars/${car._id}`}>
                      <a className="hover:underline">{car.title}</a>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {car.description.slice(0, 100)}...
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {car.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
