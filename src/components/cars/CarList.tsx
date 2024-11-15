import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchCars, searchCars } from '../../api/api';
import { useToast } from "../../hooks/use-toast";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

interface Car {
  _id: string;
  title: string;
  description: string;
  tags: string[];
}

export function CarList() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const location = useLocation();
  console.log(cars)

  useEffect(() => {
    const loadCars = async () => {
      setLoading(true);
      try {
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('q');
        let data;
        if (query) {
          data = await searchCars(query);
        } else {
          data = await fetchCars();
        }
        setCars(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch cars. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, [location.search]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Cars</h1>
        <Button asChild>
          <Link to="/cars/new">Add New Car</Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <Card key={car._id}>
            <CardHeader>
              <CardTitle>{car.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{car.description.substring(0, 100)}...</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {car.tags.map((tag, index) => (
                  <span key={index} className="text-xs bg-secondary text-secondary-foreground rounded-full px-2 py-1">
                    {tag}
                  </span>
                ))}
              </div>
              <Button asChild className="mt-4">
                <Link to={`/cars/${car._id}`}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}