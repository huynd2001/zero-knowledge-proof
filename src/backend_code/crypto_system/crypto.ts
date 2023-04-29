import {
  EllipticCurve,
  EllipticCurvePoint,
} from "../real_fields_groups/group/elliptic_curve";
import { ZModuloP, ZModuloPElement } from "../real_fields_groups/field/zmodulo";

class ECCAlgorithm {
  public readonly primeModulo: number;
  public readonly field: ZModuloP;
  public readonly curve: EllipticCurve<ZModuloPElement, number>;
  public readonly generator: EllipticCurvePoint<ZModuloPElement, number>;
  public readonly order: number;

  constructor(primeModulo: number, a: number, b: number) {
    this.primeModulo = primeModulo;
    this.field = new ZModuloP(primeModulo);
    this.curve = new EllipticCurve(
      new ZModuloPElement(a, this.field),
      new ZModuloPElement(b, this.field),
      this.field
    );
    const [x, y] = getGeneratorOfEllipticCurveGroup(primeModulo, a, b);
    this.generator = new EllipticCurvePoint(false, x, y, this.curve);
    this.order = getOrderOfEllipticCurveGroup(primeModulo, a, b);
  }

  generatePublicPrivateKeyPair = (): [
    number,
    EllipticCurvePoint<ZModuloPElement, number>
  ] => {
    const privateKey = Math.floor(Math.random() * this.order);
    const publicKey = this.curve.quickMultiply(this.generator, privateKey);
    return [privateKey, publicKey];
  };
}

export { ECCAlgorithm };
