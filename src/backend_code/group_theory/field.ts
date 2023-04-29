abstract class FieldElement<T> {
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

  abstract equals: (other: FieldElement<T>) => boolean;

  toString = () => {
    return this.value.toString();
  };
}

abstract class Field<T> {
  protected name: string;

  protected constructor(name: string) {
    this.name = name;
  }

  getName: () => string = () => {
    return this.name;
  };

  abstract add: (a: FieldElement<T>, b: FieldElement<T>) => FieldElement<T>;

  abstract mul: (a: FieldElement<T>, b: FieldElement<T>) => FieldElement<T>;

  abstract neg: (a: FieldElement<T>) => FieldElement<T>;

  abstract inv: (a: FieldElement<T>) => FieldElement<T>;

  sub = (a: FieldElement<T>, b: FieldElement<T>): FieldElement<T> => {
    return this.add(a, this.neg(b));
  };

  div = (a: FieldElement<T>, b: FieldElement<T>): FieldElement<T> => {
    return this.mul(a, this.inv(b));
  };

  quickMultiply = (a: FieldElement<T>, b: number): FieldElement<T> => {
    if (b === 0) {
      return this.addId();
    } else {
      const half = this.quickMultiply(a, Math.floor(b / 2));
      if (b % 2 === 0) {
        return this.add(half, half);
      } else {
        return this.add(this.add(half, half), a);
      }
    }
  };

  quickPower = (a: FieldElement<T>, b: number): FieldElement<T> => {
    if (b === 0) {
      return this.mulId();
    } else {
      const half = this.quickPower(a, Math.floor(b / 2));
      if (b % 2 === 0) {
        return this.mul(half, half);
      } else {
        return this.mul(this.mul(half, half), a);
      }
    }
  };

  abstract addId: () => FieldElement<T>;

  abstract mulId: () => FieldElement<T>;

  abstract newElement: (value: T) => FieldElement<T>;

  toString = (): string => {
    return this.getName();
  };

  abstract elementBelongToField: (a: FieldElement<T>) => boolean;
}

export { Field, FieldElement };
