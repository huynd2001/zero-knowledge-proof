import { ZModuloP, ZModuloPElement } from "../real_fields_groups/field/zmodulo";
import {
  EllipticCurve,
  EllipticCurvePoint,
} from "../real_fields_groups/group/elliptic_curve";

const run = () => {
  const Z13field = new ZModuloP(13n);

  const EC_Z13 = new EllipticCurve(
    new ZModuloPElement(3n, Z13field),
    new ZModuloPElement(8n, Z13field),
    Z13field
  );

  const EC_Z13_Points = [
    new EllipticCurvePoint(true, EC_Z13),
    new EllipticCurvePoint(false, EC_Z13, 1n, 5n),
    new EllipticCurvePoint(false, EC_Z13, 1n, 8n),
    new EllipticCurvePoint(false, EC_Z13, 2n, 3n),
    new EllipticCurvePoint(false, EC_Z13, 2n, 10n),
    new EllipticCurvePoint(false, EC_Z13, 9n, 6n),
    new EllipticCurvePoint(false, EC_Z13, 9n, 7n),
    new EllipticCurvePoint(false, EC_Z13, 12n, 2n),
    new EllipticCurvePoint(false, EC_Z13, 12n, 11n),
  ];

  const EC_Z13_P = EC_Z13_Points[2];
  const EC_Z13_Q = EC_Z13_Points[6];

  console.log(
    `P + Q = ${EC_Z13_P} + ${EC_Z13_Q} = ${EC_Z13.add(EC_Z13_P, EC_Z13_Q)}`
  );
};

export default run;
