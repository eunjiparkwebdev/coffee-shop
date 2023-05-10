import { useContext, useState } from "react";
import { StoreContext } from "@/store/store-context";

const useTrackCountry = () => {
  const { state } = useContext(StoreContext);
  const { country } = state;
  const [currentCountry, setCurrentCountry] = useState("CA");
  if (country === true) {
    setCurrentCountry("US");
  } else {
    setCurrentCountry("CA");
  }

  return {
    currentCountry,
  };
};

export default useTrackCountry;
