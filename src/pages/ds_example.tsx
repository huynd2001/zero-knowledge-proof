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
  message: string;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    p: "",
    a: "",
    b: "",
    message: "",
  });

  const [dsSession, setDsSession] = useState<DSExample | undefined>(undefined);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isWaiting, setIsWaiting] = useState<number>(0);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const ds_example = async () => {
    const { p, a, b, message } = formData;
    const response = await fetch(
      `/api/ds?p=${p}&a=${a}&b=${b}&message=${message}`
    );
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    setDsSession(data.result);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsWaiting((i) => i + 1);
    setError(undefined);
    setDsSession(undefined);

    ds_example()
      .then(() => console.log("done"))
      .catch((e) => {
        console.log(e);
        setError(e.toString());
      })
      .finally(() => setIsWaiting((i) => i - 1));
  };

  const displaySteps = () => {
    if (error) {
      return (
        <Typography variant="body1" gutterBottom>
          {`Error: ${error}`}
        </Typography>
      );
    }
    if (isWaiting)
      return (
        <Typography variant="body1" gutterBottom>
          {`Peggy and Victor is verifying very hard...`}
        </Typography>
      );
    if (!dsSession) return null;

    const { p, a, b, n, c } = dsSession;

    const G = p2s(dsSession.G);
    const A = p2s(dsSession.A);
    const M = p2s(dsSession.M);
    const sG = p2s(dsSession.sG);
    const R_plus_cA = p2s(dsSession.R_plus_cA);
    const sM = p2s(dsSession.sM);
    const rM_plus_c_p_aM = p2s(dsSession.rM_plus_c_p_aM);

    const signature = dsSession.signature;
    const s = signature.s;
    const p_aM = p2s(signature.p_aM);
    const rM = p2s(signature.rM);
    const R = p2s(signature.R);

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
          {`Peggy needs to send the message that was encoded as M = ${M}, and needs` +
            `to prove to Victor that she sends the message.`}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {`Step 1: Peggy chooses a random value r and computes the point R = rG = ${R}.`}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {`Step 2: Peggy computes the value c = H(p_aM, rM, R) = ${c}.`}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {`Step 3: Peggy computes the value s = r + c * p_a = ${s}.`}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {`Step 4: Peggy generates the digital signature (s, p_aM, rM, R) = (${s}, ${p_aM}, ${rM}, ${R}), sending this with the message to Victor.`}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {`Step 5: Victor receives the message and signature, recalculate c = H(p_aM, rM, R) = ${c}.`}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {`Step 6: Victor checks if sG = R + cA:\n`}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {`sG = ${s} * ${G} = ${sG}`}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {`R + cA = ${R} + ${c} * ${A} = ${R_plus_cA}`}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {`Step 7: Victor checks if sM = rM + c * p_a * M:\n`}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {`sM = ${s} * ${M} = ${sM}`}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {`rM + c * (p_a * M) = ${rM} + ${c} * ${p_aM} = ${rM_plus_c_p_aM}`}
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
              <Box mb={2}>
                <TextField
                  required
                  fullWidth
                  label="Message from Peggy"
                  name="message"
                  value={formData.message}
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
