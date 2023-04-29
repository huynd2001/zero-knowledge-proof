import { ZModuloP, ZModuloPElement } from "../real_fields_groups/field/zmodulo";
import {
  EllipticCurve,
  EllipticCurvePoint,
} from "../real_fields_groups/group/elliptic_curve";

const run = () => {
  const Z13field = new ZModuloP(13);

  const EC_Z13 = new EllipticCurve(
    new ZModuloPElement(3, Z13field),
    new ZModuloPElement(8, Z13field),
    Z13field
  );

  const EC_Z13_Points = [
    new EllipticCurvePoint(true, undefined, undefined, EC_Z13),
    new EllipticCurvePoint(false, 1, 5, EC_Z13),
    new EllipticCurvePoint(false, 1, 8, EC_Z13),
    new EllipticCurvePoint(false, 2, 3, EC_Z13),
    new EllipticCurvePoint(false, 2, 10, EC_Z13),
    new EllipticCurvePoint(false, 9, 6, EC_Z13),
    new EllipticCurvePoint(false, 9, 7, EC_Z13),
    new EllipticCurvePoint(false, 12, 2, EC_Z13),
    new EllipticCurvePoint(false, 12, 11, EC_Z13),
  ];

  const EC_Z13_P = EC_Z13_Points[2];
  const EC_Z13_Q = EC_Z13_Points[6];

  console.log(
    `P + Q = ${EC_Z13_P} + ${EC_Z13_Q} = ${EC_Z13.add(EC_Z13_P, EC_Z13_Q)}`
  );
};

export default run;
