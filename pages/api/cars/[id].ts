import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import Car from "../../../models/Car";
import { authMiddleware } from "../../../lib/authMiddleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  await dbConnect();

  if (req.method === "GET") {
    try {
      const car = await Car.findOne({
        _id: id,
        user: (req as any).user.userId,
      });
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }
      res.status(200).json(car);
    } catch (error) {
      res.status(400).json({ message: "Error fetching car", error });
    }
  } else if (req.method === "PUT") {
    try {
      const car = await Car.findOneAndUpdate(
        { _id: id, user: (req as any).user.userId },
        req.body,
        { new: true }
      );
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }
      res.status(200).json(car);
    } catch (error) {
      res.status(400).json({ message: "Error updating car", error });
    }
  } else if (req.method === "DELETE") {
    try {
      const car = await Car.findOneAndDelete({
        _id: id,
        user: (req as any).user.userId,
      });
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }
      res.status(200).json({ message: "Car deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Error deleting car", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

export default authMiddleware(handler);
