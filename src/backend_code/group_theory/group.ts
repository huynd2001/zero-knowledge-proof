abstract class GroupElement<T extends { toString(): string }> {
  abstract equals: (other: GroupElement<T>) => boolean;
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

  toString = (): string => {
    return this.value.toString();
  };
}

abstract class Group<T extends { toString(): string }> {
  abstract add: (a: GroupElement<T>, b: GroupElement<T>) => GroupElement<T>;
  abstract neg: (a: GroupElement<T>) => GroupElement<T>;
  abstract id: () => GroupElement<T>;
  abstract elementBelongToGroup: (value: GroupElement<T>) => boolean;
  protected name: string;

  protected constructor(name: string) {
    this.name = name;
  }

  getName: () => string = () => {
    return this.name;
  };

  quickMultiply = (a: GroupElement<T>, b: bigint): GroupElement<T> => {
    if (b === 0n) {
      return this.id();
    } else {
      const half = this.quickMultiply(a, b / 2n);
      if (b % 2n === 0n) {
        return this.add(half, half);
      } else {
        return this.add(this.add(half, half), a);
      }
    }
  };

  sub = (a: GroupElement<T>, b: GroupElement<T>): GroupElement<T> => {
    return this.add(a, this.neg(b));
  };

  toString = (): string => {
    return this.getName();
  };
}

export { Group, GroupElement };
