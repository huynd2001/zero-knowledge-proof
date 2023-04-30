import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "../client_code/createEmotionCache";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../client_code/theme";
import NavBar from "@/components/NavBar";

const clientSideEmotionCache = createEmotionCache();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NavBar />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}
