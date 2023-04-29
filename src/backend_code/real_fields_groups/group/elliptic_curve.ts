import { Field, FieldElement } from "../../group_theory/field";
import { Group, GroupElement } from "../../group_theory/group";

class PointPairing<R> {
  public readonly x: R;
  public readonly y: R;
  public infinity: boolean;

  constructor(infinity: boolean, x: R, y: R) {
    this.x = x;
    this.y = y;
    this.infinity = infinity;
  }

  toString() {
    if (this.infinity) {
      return "Inf";
    } else {
      return `(${this.x}, ${this.y})`;
    }
  }
}

/**
 * An elliptic curve point is a point on an elliptic curve. It is represented by
 * a pair of elements in a field R, or a point at infinity.
 */
class EllipticCurvePoint<T extends FieldElement<R>, R> extends GroupElement<
  PointPairing<R>
> {
  constructor(infinity: boolean, x: R, y: R, curve: EllipticCurve<T, R>) {
    super(new PointPairing<R>(infinity, x, y), curve);
  }

  equals = (other: GroupElement<PointPairing<R>>): boolean => {
    return (
      super.getValue().infinity === other.getValue().infinity &&
      super.getValue().x === other.getValue().x &&
      super.getValue().y === other.getValue().y
    );
  };
}

class EllipticCurve<T extends FieldElement<R>, R> extends Group<
  PointPairing<R>
> {
  public readonly a: T;
  public readonly b: T;
  public readonly field: Field<R>;

  /**
   * Constructing an elliptic curve function of the form y^2 = x^3 + ax + b, where
   * a and b must belong to R
   * @param a
   * @param b
   * @param field
   */
  constructor(a: T, b: T, field: Field<R>) {
    super(`EllipticCurve(${field.getName()}) of Y^2 = X^3 + (${a})x + (${b})`);
    this.a = a;
    this.b = b;
    this.field = field;
  }

  add = (
    p: GroupElement<PointPairing<R>>,
    q: GroupElement<PointPairing<R>>
  ): GroupElement<PointPairing<R>> => {
    // TODO: check if everyone's field is consistent
    const f = this.field;
    const x_1 = f.newElement(p.getValue().x);
    const y_1 = f.newElement(p.getValue().y);
    const x_2 = f.newElement(q.getValue().x);
    const y_2 = f.newElement(q.getValue().y);
    let muy: FieldElement<R> = undefined;

    if (f.sub(x_1, x_2).equals(f.addId())) {
      if (y_1.equals(f.addId())) {
        // Infinity point
        return this.id();
      } else {
        // muy = (3x_1^2 + a) / (2y_1)
        const x_1_sq = f.mul(x_1, x_1);
        const numerator = f.add(f.add(x_1_sq, x_1_sq), f.add(x_1_sq, this.b));
        const denominator = f.add(y_1, y_1);
        muy = f.div(numerator, denominator);
      }
    } else {
      // muy = (y_1 - y_2) / (x_1 - x_2)
      muy = f.div(f.sub(y_1, y_2), f.sub(x_1, x_2));
    }
    const x_3 = f.sub(f.sub(f.mul(muy, muy), x_1), x_2);
    const y_3 = f.sub(f.mul(muy, f.sub(x_1, x_3)), y_1);
    return new EllipticCurvePoint(false, x_3.getValue(), y_3.getValue(), this);
  };

  id = (): GroupElement<PointPairing<R>> => {
    return new EllipticCurvePoint(true, undefined, undefined, this);
  };

  neg = (p: GroupElement<PointPairing<R>>): GroupElement<PointPairing<R>> => {
    return new EllipticCurvePoint(
      false,
      p.getValue().x,
      this.field.neg(this.field.newElement(p.getValue().y)).getValue(),
      this
    );
  };

  elementBelongToGroup = (value: EllipticCurvePoint<T, R>): boolean => {
    const f = this.field;
    const x = f.newElement(value.getValue().x);
    const y = f.newElement(value.getValue().y);
    const left = f.mul(y, y);
    const right = f.add(
      f.add(f.mul(f.mul(x, x), x), f.mul(f.mul(this.a, x), x)),
      this.b
    );
    return left.equals(right);
  };
}

export { EllipticCurve, EllipticCurvePoint };
