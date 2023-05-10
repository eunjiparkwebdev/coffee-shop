import "@/styles/globals.css";
// import Font Awesome CSS
import "@fortawesome/fontawesome-svg-core/styles.css";
import StoreProvider from "@/store/store-context";

import { config } from "@fortawesome/fontawesome-svg-core";
import { FetchCoffeeStores } from "@/lib/coffee-store";
config.autoAddCss = false;

export default function myApp({ Component, pageProps }) {
  return (
    <StoreProvider>
      <Component {...pageProps} />
    </StoreProvider>
  );
}
