import {
  ZModuloP,
  ZModuloPElement,
} from "@/backend_code/real_fields_groups/field/zmodulo";
import {
  EllipticCurve,
  EllipticCurvePoint,
} from "@/backend_code/real_fields_groups/group/elliptic_curve";
import {
  convertECP2BIP,
  getGeneratorOfEllipticCurveGroup,
  getOrderOfEllipticCurveGroup,
  hashString2BigInt,
  hashToBigInt,
  randomBigInt,
} from "@/backend_code/crypto_system/util";

export function getVerifierProverProtocolExample(
  p: bigint,
  a: bigint,
  b: bigint,
  order?: bigint
): VP_Response {
  let ZP = new ZModuloP(p);
  let curve = new EllipticCurve(
    new ZModuloPElement(a, ZP),
    new ZModuloPElement(b, ZP),
    ZP
  );
  const n = order ?? getOrderOfEllipticCurveGroup(p, a, b);
  const [Gx, Gy] = getGeneratorOfEllipticCurveGroup(p, a, b);
  const G = new EllipticCurvePoint(false, curve, Gx, Gy);
  const p_a = randomBigInt(n);
  const A = curve.quickMultiply(G, p_a);

  // The following code is for Schnorr protocol (https://en.wikipedia.org/wiki/Schnorr_signature)
  // Prover would like to prove to Verifer that
  // they know a such that p_a * G = A.
  // The value of G, along with the order of the field and curve's order, is public.
  // Step 1: Prover generate a random value r, then generate rG = R to verifier
  const r = randomBigInt(n);
  const R = curve.quickMultiply(G, r);

  // Step 2: Verifier computes c = H(G, A, R), then send c to Prover
  const c = hashToBigInt(G, A, R, n);

  // Step 3: Prover computes s = r + c * p_a modulo n, then send s to Verifier
  const s = (r + c * p_a) % n;

  // Step 4: Verifier checks if sG = R + cA
  const sG = curve.quickMultiply(G, s);
  const cA = curve.quickMultiply(A, c);
  const R_plus_cA = curve.add(R, cA);
  return {
    p,
    a,
    b,
    n,
    G: convertECP2BIP(G),
    A: convertECP2BIP(A),
    R: convertECP2BIP(R),
    c,
    s,
    sG: convertECP2BIP(sG),
    R_plus_cA: convertECP2BIP(R_plus_cA),
  };
}

export function getProverDigitalSignatureExample(
  p: bigint,
  a: bigint,
  b: bigint,
  message: string,
  order?: bigint
): DS_Response {
  let ZP = new ZModuloP(p);
  let curve = new EllipticCurve(
    new ZModuloPElement(a, ZP),
    new ZModuloPElement(b, ZP),
    ZP
  );
  const n = order ?? getOrderOfEllipticCurveGroup(p, a, b);
  const [Gx, Gy] = getGeneratorOfEllipticCurveGroup(p, a, b);
  const G = new EllipticCurvePoint(false, curve, Gx, Gy);
  const p_a = randomBigInt(n);
  const A = curve.quickMultiply(G, p_a);

  const m = hashString2BigInt(message, n);
  const M = curve.quickMultiply(G, m); // encoded message

  // The following code is a digital signature algorithm
  // based on Schnorr protocol (https://en.wikipedia.org/wiki/Schnorr_signature)
  // Step 1: Prover generate a random value r, then generate rG = R
  const r = randomBigInt(n);
  const R = curve.quickMultiply(G, r);

  // Step 2: Prover computes c = H(p_aM, rM, R)
  const p_aM = curve.quickMultiply(M, p_a);
  const rM = curve.quickMultiply(M, r);
  const c = hashToBigInt(p_aM, rM, R, n);

  // Step 3: Prover computes s = r + c * p_a modulo n
  const s = (r + c * p_a) % n;

  // Step 4: Prover sends (s, p_aM, rM, R) to Verifier as the signature for
  // the message M from string m
  const signature = { s, p_aM, rM, R };

  // Step 5: Verifier computes c = H(p_aM, rM, R)

  // Step 6: Verifier checks if sG = R + cA
  const sG = curve.quickMultiply(G, s);
  const cA = curve.quickMultiply(A, c);
  const R_plus_cA = curve.add(R, cA);

  // Step 7: Verifier checks if sM = rM + c * (p_aM)
  const sM = curve.quickMultiply(M, s);
  const c_p_aM = curve.quickMultiply(p_aM, c);
  const rM_plus_c_p_aM = curve.add(rM, c_p_aM);

  return {
    p,
    a,
    b,
    n,
    G: convertECP2BIP(G),
    A: convertECP2BIP(A),
    M: convertECP2BIP(M),
    c,
    signature: {
      s,
      p_aM: convertECP2BIP(p_aM),
      rM: convertECP2BIP(rM),
      R: convertECP2BIP(R),
    },
    sG: convertECP2BIP(sG),
    R_plus_cA: convertECP2BIP(R_plus_cA),
    sM: convertECP2BIP(sM),
    rM_plus_c_p_aM: convertECP2BIP(rM_plus_c_p_aM),
  };
}
