import { FieldElement } from "./field";

abstract class GroupElement<T> {
  protected value: T;
  protected field: Group<T>;

  protected constructor(value: T, field: Group<T>) {
    this.value = value;
    this.field = field;
  }

  getValue: () => T = () => {
    return this.value;
  };

  getGroup: () => Group<T> = () => {
    return this.field;
  };

  abstract equals: (other: GroupElement<T>) => boolean;

  toString = (): string => {
    return this.value.toString();
  };
}

abstract class Group<T> {
  protected name: string;

  protected constructor(name: string) {
    this.name = name;
  }

  getName: () => string = () => {
    return this.name;
  };

  abstract add: (a: GroupElement<T>, b: GroupElement<T>) => GroupElement<T>;

  abstract neg: (a: GroupElement<T>) => GroupElement<T>;

  quickMultiply = (a: GroupElement<T>, b: number): GroupElement<T> => {
    if (b === 0) {
      return this.id();
    } else {
      const half = this.quickMultiply(a, Math.floor(b / 2));
      if (b % 2 === 0) {
        return this.add(half, half);
      } else {
        return this.add(this.add(half, half), a);
      }
    }
  };

  sub = (a: GroupElement<T>, b: GroupElement<T>): GroupElement<T> => {
    return this.add(a, this.neg(b));
  };

  abstract id: () => GroupElement<T>;

  toString = (): string => {
    return this.getName();
  };

  abstract elementBelongToGroup: (value: GroupElement<T>) => boolean;
}

export { Group, GroupElement };
