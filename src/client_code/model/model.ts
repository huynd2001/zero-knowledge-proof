type Point =
  | {
      x: string;
      y: string;
    }
  | "identity";

type VPExample = {
  p: string;
  a: string;
  b: string;
  G: Point;
  A: Point;
  R: Point;
  c: string;
  s: string;
  sG: Point;
  R_plus_cA: Point;
  n: string;
};

type DSExample = {
  p: string;
  a: string;
  b: string;
  G: Point;
  A: Point;
  M: Point;
  c: string;
  signature: { s: string; p_aM: Point; rM: Point; R: Point };
  sG: Point;
  R_plus_cA: Point;
  sM: Point;
  R_plus_c_p_aM: Point;
  n: string;
};
