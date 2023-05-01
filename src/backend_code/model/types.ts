type BigIntPoint =
  | {
      x: bigint;
      y: bigint;
    }
  | "identity";

type StrPoint =
  | {
      x: string;
      y: string;
    }
  | "identity";

type VP_Response = {
  p: bigint;
  a: bigint;
  b: bigint;
  G: BigIntPoint;
  A: BigIntPoint;
  R: BigIntPoint;
  c: bigint;
  s: bigint;
  sG: BigIntPoint;
  R_plus_cA: BigIntPoint;
  n: bigint;
};

type DS_Response = {
  p: bigint;
  a: bigint;
  b: bigint;
  G: BigIntPoint;
  A: BigIntPoint;
  M: BigIntPoint;
  c: bigint;
  signature: { s: bigint; p_aM: BigIntPoint; rM: BigIntPoint; R: BigIntPoint };
  sG: BigIntPoint;
  R_plus_cA: BigIntPoint;
  sM: BigIntPoint;
  R_plus_c_p_aM: BigIntPoint;
  n: bigint;
};

type VP_str_Response = {
  p: string;
  a: string;
  b: string;
  G: StrPoint;
  A: StrPoint;
  R: StrPoint;
  c: string;
  s: string;
  sG: StrPoint;
  R_plus_cA: StrPoint;
  n: string;
};

type DS_str_Response = {
  p: string;
  a: string;
  b: string;
  G: StrPoint;
  A: StrPoint;
  M: StrPoint;
  c: string;
  signature: { s: string; p_aM: StrPoint; rM: StrPoint; R: StrPoint };
  sG: StrPoint;
  R_plus_cA: StrPoint;
  sM: StrPoint;
  R_plus_c_p_aM: StrPoint;
  n: string;
};
