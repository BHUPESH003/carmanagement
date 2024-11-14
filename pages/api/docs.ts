import { NextApiRequest, NextApiResponse } from "next";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-react";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Car Management API",
      version: "1.0.0",
      description: "API documentation for the Car Management application",
    },
  },
  apis: ["./pages/api/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
}
