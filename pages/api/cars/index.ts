import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import Car from "../../../models/Car";
import { authMiddleware } from "../../../lib/authMiddleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const cars = await Car.find({ user: (req as any).user.userId });
      res.status(200).json(cars);
    } catch (error) {
      res.status(400).json({ message: "Error fetching cars", error });
    }
  } else if (req.method === "POST") {
    try {
      const car = await Car.create({
        ...req.body,
        user: (req as any).user.userId,
      });
      res.status(201).json(car);
    } catch (error) {
      res.status(400).json({ message: "Error creating car", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

export default authMiddleware(handler);
