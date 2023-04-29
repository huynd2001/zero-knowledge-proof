import { Field, FieldElement } from "../../group_theory/field";

class ZModuloPElement extends FieldElement<number> {
  constructor(value: number, field: ZModuloP) {
    super(value, field);
  }

  equals = (other: FieldElement<number>) => {
    return this.getValue() == other.getValue();
  };
}

class ZModuloP extends Field<number> {
  /**
   * @param p The prime number to use as the modulus
   * @private
   */
  private readonly p: number;
  constructor(p: number) {
    super(`ZModuloP(${p})`);
    this.p = p;
  }

  private static modulo = (a: number, p: number) => {
    return ((a % p) + p) % p;
  };

  add = (
    a: FieldElement<number>,
    b: FieldElement<number>
  ): FieldElement<number> => {
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

  addId = (): FieldElement<number> => {
    return new ZModuloPElement(0, this);
  };

  private static powModulo = (a: number, b: number, p: number) => {
    if (b == 0) {
      return 1;
    } else {
      let c = ZModuloP.powModulo(a, Math.floor(b / 2), p);
      if (b % 2 == 0) {
        return ZModuloP.modulo(c * c, p);
      } else {
        return ZModuloP.modulo(c * c * a, p);
      }
    }
  };

  inv = (a: FieldElement<number>): FieldElement<number> => {
    let a_value = a.getValue();
    return new ZModuloPElement(
      ZModuloP.powModulo(a_value, this.p - 2, this.p),
      this
    );
  };

  mul = (
    a: FieldElement<number>,
    b: FieldElement<number>
  ): FieldElement<number> => {
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

  mulId = (): FieldElement<number> => {
    return new ZModuloPElement(1, this);
  };

  neg = (a: FieldElement<number>): FieldElement<number> => {
    return new ZModuloPElement(ZModuloP.modulo(-a.getValue(), this.p), this);
  };

  newElement = (value: number): FieldElement<number> => {
    return new ZModuloPElement(value, this);
  };

  elementBelongToField = (a: ZModuloPElement): boolean => {
    return a.getValue() >= 0 && a.getValue() < this.p;
  };
}

export { ZModuloP, ZModuloPElement };
