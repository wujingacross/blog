import { AppProps } from "next/app";
import "styles/globals.css";
import "styles/main.css";
console.log("_app.tsx");

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
