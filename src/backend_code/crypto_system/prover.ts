import {
  EllipticCurve,
  EllipticCurvePoint,
} from "../real_fields_groups/group/elliptic_curve";
import { ZModuloPElement } from "../real_fields_groups/field/zmodulo";
import { ECCAlgorithm } from "./crypto";

// The prover needs to prove that they know the
// private key corresponding to the public key without
// revealing the private key to the verifier
class Prover {
  private readonly privateKey: number;
  public readonly publicKey: EllipticCurvePoint<ZModuloPElement, number>;
  public readonly curve: EllipticCurve<ZModuloPElement, number>;
  public readonly generator: EllipticCurvePoint<ZModuloPElement, number>;
  public readonly order: number;

  private r: number;

  constructor(keyAlgorithm: ECCAlgorithm) {
    [this.privateKey, this.publicKey] =
      keyAlgorithm.generatePublicPrivateKeyPair();
    this.curve = keyAlgorithm.curve;
    this.generator = keyAlgorithm.generator;
    this.order = keyAlgorithm.order;
  }

  // The prover needs to prove that they know the
  // private key corresponding to the public key without
  // revealing the private key to the verifier
  generatePointAndStoreR = () => {
    const r = Math.floor(Math.random() * this.order);
    this.r = r;
    return this.curve.quickMultiply(this.generator, r);
  };

  generateProof = (c: number) => {
    return (this.r + c * this.privateKey) % this.order;
  };
}
