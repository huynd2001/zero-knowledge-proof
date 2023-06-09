abstract class FieldElement<T extends { toString(): string }> {
  abstract equals: (other: FieldElement<T>) => boolean;
  protected value: T;
  protected field: Field<T>;

  protected constructor(value: T, field: Field<T>) {
    this.value = value;
    this.field = field;
  }

  getValue: () => T = () => {
    return this.value;
  };

  getField: () => Field<T> = () => {
    return this.field;
  };

  toString = () => {
    return this.value.toString();
  };
}

abstract class Field<T extends { toString(): string }> {
  abstract add: (a: FieldElement<T>, b: FieldElement<T>) => FieldElement<T>;
  abstract mul: (a: FieldElement<T>, b: FieldElement<T>) => FieldElement<T>;
  abstract neg: (a: FieldElement<T>) => FieldElement<T>;
  abstract inv: (a: FieldElement<T>) => FieldElement<T>;
  abstract addId: () => FieldElement<T>;
  abstract mulId: () => FieldElement<T>;
  abstract newElement: (value: T) => FieldElement<T>;
  abstract elementBelongToField: (a: FieldElement<T>) => boolean;
  protected name: string;

  protected constructor(name: string) {
    this.name = name;
  }

  getName: () => string = () => {
    return this.name;
  };

  sub = (a: FieldElement<T>, b: FieldElement<T>): FieldElement<T> => {
    return this.add(a, this.neg(b));
  };

  div = (a: FieldElement<T>, b: FieldElement<T>): FieldElement<T> => {
    return this.mul(a, this.inv(b));
  };

  quickMultiply = (a: FieldElement<T>, b: bigint): FieldElement<T> => {
    if (b === 0n) {
      return this.addId();
    } else {
      const half = this.quickMultiply(a, b / 2n);
      if (b % 2n === 0n) {
        return this.add(half, half);
      } else {
        return this.add(this.add(half, half), a);
      }
    }
  };

  quickPower = (a: FieldElement<T>, b: bigint): FieldElement<T> => {
    if (b === 0n) {
      return this.mulId();
    } else {
      const half = this.quickPower(a, b / 2n);
      if (b % 2n === 0n) {
        return this.mul(half, half);
      } else {
        return this.mul(this.mul(half, half), a);
      }
    }
  };

  toString = (): string => {
    return this.getName();
  };
}

export { Field, FieldElement };
