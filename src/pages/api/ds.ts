import type { NextApiRequest, NextApiResponse } from "next";
import { getProverDigitalSignatureExample } from "@/backend_code/crypto_system/get_visualization";
import {
  checkValidInput,
  convertDSResponseToString,
  isPrime,
} from "@/backend_code/crypto_system/util";

interface ResponseData {
  result?: DS_str_Response;
  error?: string;
}

function getDsSession(query: {
  p: string;
  a: string;
  b: string;
  message: string;
}) {
  const p = BigInt(query.p);
  const a = BigInt(query.a);
  const b = BigInt(query.b);
  const message = query.message;
  checkValidInput(p, a, b);
  return getProverDigitalSignatureExample(p, a, b, message);
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Check if the request method is GET
  if (req.method === "GET") {
    const { p, a, b, message } = req.query;
    try {
      const result = getDsSession({
        p: p as string,
        a: a as string,
        b: b as string,
        message: message as string,
      });
      res.status(200).json({
        result: convertDSResponseToString(result),
      });
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ error: error.message ?? "Error" });
    }
  } else {
    res.setHeader("Allow", "GET");
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
