import { ECCAlgorithm } from "./crypto";
import {
  EllipticCurve,
  EllipticCurvePoint,
} from "../real_fields_groups/group/elliptic_curve";
import { ZModuloPElement } from "../real_fields_groups/field/zmodulo";
import { Md5 } from "ts-md5";

class Verifier {
  public readonly algorithm: ECCAlgorithm;
  public readonly generator: EllipticCurvePoint<ZModuloPElement, number>;
  public readonly curve: EllipticCurve<ZModuloPElement, number>;
  private c: number;

  constructor(algorithm: ECCAlgorithm) {
    this.algorithm = algorithm;
    this.generator = algorithm.generator;
    this.curve = algorithm.curve;
  }

  generateHash = (
    B: EllipticCurvePoint<ZModuloPElement, number>,
    A: EllipticCurvePoint<ZModuloPElement, number>
  ) => {
    const G = this.generator;
    const hashArrays: Int32Array = new Md5()
      .appendStr(G.toString())
      .appendStr(B.toString())
      .appendStr(A.toString())
      .end(true) as Int32Array;
    // Assume the hash function is "random" enough
    const c = hashArrays.reduce((acc, cur) => acc + cur, 0);
    this.c = c;
    return c;
  };

  verify = (
    m: number,
    B: EllipticCurvePoint<ZModuloPElement, number>,
    A: EllipticCurvePoint<ZModuloPElement, number>
  ) => {
    const c = this.c;
    const G = this.generator;
    const curve = this.curve;
    const left = curve.quickMultiply(G, m);
    const right = curve.add(curve.quickMultiply(B, c), A);
    return left.equals(right);
  };
}
