import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { p2s } from "@/client_code/util";

interface FormData {
  p: string;
  a: string;
  b: string;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    p: "",
    a: "",
    b: "",
  });

  const [vpSession, setVpSession] = useState<VPExample | undefined>(undefined);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const vp_example = async () => {
    const { p, a, b } = formData;
    const response = await fetch(`/api/vp?p=${p}&a=${a}&b=${b}`);
    const data = await response.json();
    console.log(data.result);
    setVpSession(data.result);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    vp_example()
      .then(() => console.log("done"))
      .catch((e) => console.log(e));
  };

  const displaySteps = () => {
    if (!vpSession) return null;

    const { p, a, b, n, c, s } = vpSession;

    // @ts-ignore
    const G = p2s(vpSession.G);
    const A = p2s(vpSession.A);
    const R = p2s(vpSession.R);
    const sG = p2s(vpSession.sG);
    const R_plus_cA = p2s(vpSession.R_plus_cA);

    return (
      <>
        <Typography variant="body1" gutterBottom>
          {`Victor (Verifier) and Peggy (Prover) agree on the ` +
            `elliptic curve: E(F_${p}) : y^2 = x^3 + ${a}x + ${b} ` +
            `where the group has order n = ${n}. ` +
            `Peggy and Victor also agrees on the generator point G = ${G}. ` +
            `Peggy then needs to prove that she knows the discrete logarithm of the point A = ${A}, or the value p_a such that p_aG = A.`}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {`Step 1: Peggy chooses a random value r, and computes R = rG = ${R}, sending R to Victor`}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {`Step 2: Victor computes c = H(G, A, R) = H(${G}, ${A}, ${R}) = ${c}, sending c to Peggy`}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {`Step 3: Peggy computes s = r + c * p_a = ${s}, sending s to Victor`}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {`Step 4: Victor checks if sG = R + cA:\n`}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {`sG = ${s} * ${G} = ${sG}`}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {`R + cA = ${R} + ${c} * ${A} = ${R_plus_cA}`}
        </Typography>
      </>
    );
  };

  return (
    <Box pt={4}>
      <Container>
        <Grid
          container
          spacing={isSmallScreen ? 2 : 4}
          direction={isSmallScreen ? "column" : "row"}
        >
          <Grid item xs={12} md={6}>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {`Elliptic Curve: y^2 = x^3 + ${formData.a}x + ${formData.b} (mod ${formData.p})`}
                </Typography>
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  required
                  label="Prime Finite Field (F_p)"
                  name="p"
                  value={formData.p}
                  onChange={handleChange}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  required
                  fullWidth
                  label="a"
                  name="a"
                  value={formData.a}
                  onChange={handleChange}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  required
                  fullWidth
                  label="b"
                  name="b"
                  value={formData.b}
                  onChange={handleChange}
                />
              </Box>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </form>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" component="h2" gutterBottom>
              Step by Step Transformation
            </Typography>
            {displaySteps()}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
