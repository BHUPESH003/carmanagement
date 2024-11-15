import  { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCarById, deleteCar } from '../../api/api';
import { useToast } from "../../hooks/use-toast"
import { Button } from "../ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

interface Car {
  id: string;
  title: string;
  description: string;
  tags: string[];
  images: string[];
}

export function CarDetail() {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  useEffect(() => {
    const loadCar = async () => {
      try {
        const data = await fetchCarById(id!);
        setCar(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch car details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadCar();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await deleteCar(id!);
        toast({
          title: "Car Deleted",
          description: "The car has been successfully deleted.",
        });
        navigate('/dashboard');
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete car. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex flex-wrap gap-2">
              {[...Array(5)].map((_, index) => (
                <Skeleton key={index} className="h-6 w-16" />
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Skeleton className="h-10 w-24" />
          <div className="space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardFooter>
      </Card>
    );
  }

  if (!car) {
    return <div>Car not found</div>;
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{car.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="aspect-w-16 aspect-h-9 relative">
            {car.images.length > 0 && (
              <img
                src={car.images[0]}
                alt={car.title}
                className="object-cover rounded-lg"
              />
            )}
          </div>
          <p>{car.description}</p>
          <div className="flex flex-wrap gap-2">
            {car.tags.map((tag, index) => (
              <span key={index} className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm">
                {tag}
              </span>
            ))}
          </div>
          {car.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {car.images.slice(1).map((image, index) => (
                <div key={index} className="aspect-w-1 aspect-h-1 relative">
                  <img
                    src={image}
                    alt={`${car.title} - Image ${index + 2}`}
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => navigate('/dashboard')}>Back to List</Button>
        <div className="space-x-2">
          <Button onClick={() => navigate(`/cars/${id}/edit`)}>Edit</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </div>
      </CardFooter>
    </Card>
  );
}