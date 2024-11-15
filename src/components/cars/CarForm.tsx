import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCar, fetchCarById, updateCar } from '../../api/api';
import { useToast } from "../../hooks/use-toast";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface CarFormProps {
  isEditing?: boolean;
}

export function CarForm({ isEditing = false }: CarFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  useEffect(() => {
    if (isEditing && id) {
      fetchCarById(id).then(car => {
        setTitle(car.title);
        setDescription(car.description);
        setTags(car.tags.join(', '));
      }).catch(error => {
        toast({
          title: "Error",
          description: "Failed to fetch car details. Please try again.",
          variant: "destructive",
        });
      });
    }
  }, [isEditing, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);
    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      if (isEditing && id) {
        await updateCar(id, formData);
        toast({
          title: "Car Updated",
          description: "Your car has been updated successfully.",
        });
      } else {
        await createCar(formData);
        toast({
          title: "Car Created",
          description: "Your new car has been created successfully.",
        });
      }
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: isEditing ? "Failed to update car. Please try again." : "Failed to create car. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Car' : 'Add New Car'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="images">Images (up to 10)</Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setImages(Array.from(e.target.files || []).slice(0, 10))}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
        <Button type="submit" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </CardFooter>
    </Card>
  );
}