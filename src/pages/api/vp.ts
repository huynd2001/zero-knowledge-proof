import type { NextApiRequest, NextApiResponse } from "next";
import { getVerifierProverProtocolExample } from "@/backend_code/crypto_system/get_visualization";
import {
  checkValidInput,
  convertVPResponseToString,
  isPrime,
} from "@/backend_code/crypto_system/util";
import run from "@/backend_code/examples/addition_elliptic_curve";

interface ResponseData {
  result?: VP_str_Response;
  error?: string;
}

function checkIsNegative(value: bigint, varName: string) {
  if (value < 0n) {
    throw new Error(`Negative input for ${varName} is invalid!`);
  }
}

function checkIsSingular(p: bigint, a: bigint, b: bigint) {
  if ((4n * a ** 3n + 27n * b ** 2n) % p === 0n) {
    throw new Error(`Singular curve is invalid!`);
  }
}

function checkIsPrime(p: bigint) {
  if (!isPrime(p)) {
    throw new Error(`p must be prime!`);
  }
}

function getVPSession(query: { p: string; a: string; b: string }) {
  const p = BigInt(query.p);
  const a = BigInt(query.a);
  const b = BigInt(query.b);
  checkValidInput(p, a, b);
  return getVerifierProverProtocolExample(p, a, b);
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Check if the request method is GET
  if (req.method === "GET") {
    const { p, a, b } = req.query;
    try {
      const result = getVPSession({
        p: p as string,
        a: a as string,
        b: b as string,
      });
      res.status(200).json({
        result: convertVPResponseToString(result),
      });
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ error: error.message ?? "Unknown error" });
    }
  } else {
    res.setHeader("Allow", "GET");
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
