import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/AuthContext";
import Image from "next/image";

export default function CarDetail() {
  const [car, setCar] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchCar();
    }
  }, [id]);

  const fetchCar = async () => {
    try {
      const res = await fetch(`/api/cars/${id}`);
      const data = await res.json();
      setCar(data);
    } catch (error) {
      // Handle error
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`/api/cars/${id}`, { method: "DELETE" });
      router.push("/");
    } catch (error) {
      // Handle error
      console.log(error);
    }
  };

  if (!car) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{car.title}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative w-full h-96">
              <Image
                src={car.images[0]}
                alt={car.title}
                layout="fill"
                objectFit="cover"
                className="rounded-lg shadow-md"
              />
            </div>
            <div>
              <p className="text-gray-700 mb-4">{car.description}</p>
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Tags:</h2>
                <div className="flex flex-wrap gap-2">
                  {car.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => router.push(`/edit-car/${id}`)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
