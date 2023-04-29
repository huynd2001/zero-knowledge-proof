import { Field, FieldElement } from "../../group_theory/field";

class ZModuloPElement extends FieldElement<bigint> {
  constructor(value: bigint, field: ZModuloP) {
    super(value, field);
  }

  equals = (other: FieldElement<bigint>) => {
    return this.getValue() === other.getValue();
  };
}

class ZModuloP extends Field<bigint> {
  /**
   * @param p The prime number to use as the modulus
   * @private
   */
  private readonly p: bigint;

  constructor(p: bigint) {
    super(`ZModuloP(${p})`);
    this.p = p;
  }

  private static modulo = (a: bigint, p: bigint) => {
    return ((a % p) + p) % p;
  };

  private static powModulo = (a: bigint, b: bigint, p: bigint) => {
    if (b == 0n) {
      return 1n;
    } else {
      let c: bigint = ZModuloP.powModulo(a, b / 2n, p);
      if (b % 2n === 0n) {
        return ZModuloP.modulo(c * c, p);
      } else {
        return ZModuloP.modulo(c * c * a, p);
      }
    }
  };

  add = (
    a: FieldElement<bigint>,
    b: FieldElement<bigint>
  ): FieldElement<bigint> => {
    if (a.getField() !== b.getField()) {
      throw new Error("Fields must be the same to add");
    }
    if (a.getField() !== this) {
      throw new Error("Fields must be the same to add");
    }

    return new ZModuloPElement(
      ZModuloP.modulo(a.getValue() + b.getValue(), this.p),
      this
    );
  };

  addId = (): FieldElement<bigint> => {
    return new ZModuloPElement(0n, this);
  };

  inv = (a: FieldElement<bigint>): FieldElement<bigint> => {
    let a_value = a.getValue();
    return new ZModuloPElement(
      ZModuloP.powModulo(a_value, this.p - 2n, this.p),
      this
    );
  };

  mul = (
    a: FieldElement<bigint>,
    b: FieldElement<bigint>
  ): FieldElement<bigint> => {
    if (a.getField() !== b.getField()) {
      throw new Error("Fields must be the same to add");
    }
    if (a.getField() !== this) {
      throw new Error("Fields must be the same to add");
    }

    return new ZModuloPElement(
      ZModuloP.modulo(a.getValue() * b.getValue(), this.p),
      this
    );
  };

  mulId = (): FieldElement<bigint> => {
    return new ZModuloPElement(1n, this);
  };

  neg = (a: FieldElement<bigint>): FieldElement<bigint> => {
    return new ZModuloPElement(ZModuloP.modulo(-a.getValue(), this.p), this);
  };

  newElement = (value: bigint): FieldElement<bigint> => {
    return new ZModuloPElement(value, this);
  };

  elementBelongToField = (a: ZModuloPElement): boolean => {
    return a.getValue() >= 0 && a.getValue() < this.p;
  };
}

export { ZModuloP, ZModuloPElement };
