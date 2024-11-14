import { NextApiRequest, NextApiResponse } from "next";

declare module "next" {
  interface NextApiRequest extends NextApiRequest {
    user?: {
      userId: string;
    };
  }
}

export { NextApiRequest, NextApiResponse };
