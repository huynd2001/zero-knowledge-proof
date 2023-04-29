import {
  EllipticCurve,
  EllipticCurvePoint,
} from "../real_fields_groups/group/elliptic_curve";
import { ZModuloP, ZModuloPElement } from "../real_fields_groups/field/zmodulo";
import {
  getGeneratorOfEllipticCurveGroup,
  getOrderOfEllipticCurveGroup,
  randomBigInt,
} from "@/backend_code/crypto_system/util";

class ECCAlgorithm {
  public readonly primeModulo: bigint;
  public readonly field: ZModuloP;
  public readonly curve: EllipticCurve<ZModuloPElement, bigint>;
  public readonly generator: EllipticCurvePoint<ZModuloPElement, bigint>;
  public readonly order: bigint;

  constructor(primeModulo: bigint, a: bigint, b: bigint) {
    this.primeModulo = primeModulo;
    this.field = new ZModuloP(primeModulo);
    this.curve = new EllipticCurve(
      new ZModuloPElement(a, this.field),
      new ZModuloPElement(b, this.field),
      this.field
    );
    const [x, y] = getGeneratorOfEllipticCurveGroup(primeModulo, a, b);
    this.generator = new EllipticCurvePoint(false, this.curve, x, y);
    this.order = getOrderOfEllipticCurveGroup(primeModulo, a, b);
  }

  generatePublicPrivateKeyPair = (): [
    bigint,
    EllipticCurvePoint<ZModuloPElement, bigint>
  ] => {
    const privateKey = randomBigInt(this.order);
    const publicKey = this.curve.quickMultiply(this.generator, privateKey);
    return [privateKey, publicKey];
  };
}

export { ECCAlgorithm };
