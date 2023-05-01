import { Field, FieldElement } from "../../group_theory/field";
import { Group, GroupElement } from "../../group_theory/group";

class PointPairing<R> {
  public readonly x: R | undefined;
  public readonly y: R | undefined;
  public infinity: boolean;

  constructor(infinity: boolean, x?: R, y?: R) {
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
class EllipticCurvePoint<
  T extends FieldElement<R>,
  R extends { toString(): string }
> extends GroupElement<PointPairing<R>> {
  constructor(infinity: boolean, curve: EllipticCurve<T, R>, x?: R, y?: R) {
    super(new PointPairing<R>(infinity, x, y), curve);
  }

  equals = (other: GroupElement<PointPairing<R>>): boolean => {
    return (
      this.getValue().infinity === other.getValue().infinity &&
      this.getValue().x === other.getValue().x &&
      this.getValue().y === other.getValue().y &&
      this.getGroup() === other.getGroup()
    );
  };
}

class EllipticCurve<
  T extends FieldElement<R>,
  R extends { toString(): string }
> extends Group<PointPairing<R>> {
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

    if (p.equals(this.id())) return this.newElement(q.getValue());
    if (q.equals(this.id())) return this.newElement(p.getValue());

    const x_1 = f.newElement(p.getValue().x as R);
    const y_1 = f.newElement(p.getValue().y as R);
    const x_2 = f.newElement(q.getValue().x as R);
    const y_2 = f.newElement(q.getValue().y as R);
    let muy = undefined;

    if (x_1.equals(x_2)) {
      if (!y_1.equals(y_2)) {
        // Infinity point
        return this.id();
      } else {
        // muy = (3x_1^2 + a) / (2y_1)
        // When y_1 = 0, this means the curve is singular
        if (y_1.equals(y_1.getField().addId())) return this.id();
        const x_1_sq = f.mul(x_1, x_1);
        const numerator = f.add(f.add(x_1_sq, x_1_sq), f.add(x_1_sq, this.a));
        const denominator = f.add(y_1, y_1);
        muy = f.div(numerator, denominator);
      }
    } else {
      // muy = (y_1 - y_2) / (x_1 - x_2)
      muy = f.div(f.sub(y_1, y_2), f.sub(x_1, x_2));
    }
    const x_3 = f.sub(f.sub(f.mul(muy, muy), x_1), x_2);
    const y_3 = f.sub(f.mul(muy, f.sub(x_1, x_3)), y_1);
    return new EllipticCurvePoint(false, this, x_3.getValue(), y_3.getValue());
  };

  id = (): GroupElement<PointPairing<R>> => {
    return new EllipticCurvePoint(true, this);
  };

  neg = (p: GroupElement<PointPairing<R>>): GroupElement<PointPairing<R>> => {
    if (p.equals(this.id())) return this.id();
    return new EllipticCurvePoint(
      false,
      this,
      p.getValue().x as R,
      this.field.neg(this.field.newElement(p.getValue().y as R)).getValue()
    );
  };

  elementBelongToGroup = (value: EllipticCurvePoint<T, R>): boolean => {
    if (value.equals(this.id())) return true;
    const f = this.field;
    const x = f.newElement(value.getValue().x as R);
    const y = f.newElement(value.getValue().y as R);
    const left = f.mul(y, y);
    const right = f.add(
      f.add(f.mul(f.mul(x, x), x), f.mul(f.mul(this.a, x), x)),
      this.b
    );
    return left.equals(right);
  };

  newElement = (value: PointPairing<R>): GroupElement<PointPairing<R>> => {
    return new EllipticCurvePoint(
      value.infinity,
      this,
      value.x as R,
      value.y as R
    );
  };
}

export { EllipticCurve, EllipticCurvePoint };
