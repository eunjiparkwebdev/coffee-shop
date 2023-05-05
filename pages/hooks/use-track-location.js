import { useContext, useState } from "react";
import { ACTION_TYPES, StoreContext } from "@/store/store-context";

const useTrackLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState("");
  // // const [latLong, setLatLong] = useState("");
  // const [latitude, setLatitude] = useState("");
  // const [longitude, setLongitude] = useState("");
  const [isFindingLocation, setIsFindingLocation] = useState(false);
  const { dispatch } = useContext(StoreContext);
  const success = (position) => {
    console.log("success");
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // setLatLong(`${latitude},${longitude}`);
    setLocationErrorMsg("");
    setIsFindingLocation(false);

    //this dispatch function is from useReducer dispatch from _app.js
    dispatch({
      type: ACTION_TYPES.SET_LATITUDE,
      payload: { latitude: latitude },
    });
    dispatch({
      type: ACTION_TYPES.SET_LONGITUDE,
      payload: { longitude: longitude },
    });
  };

  const error = () => {
    setIsFindingLocation(false);
    setLocationErrorMsg("Unable to retrieve your location");
  };

  const handleTrackLocation = () => {
    setIsFindingLocation(true);
    if (!navigator.geolocation) {
      setLocationErrorMsg("Geolocation is not supported by your browser");
      setIsFindingLocation(false);
    } else {
      // status.textContent = "Locating…";
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };
  return {
    // latitude,
    // longitude,
    handleTrackLocation,
    locationErrorMsg,
    isFindingLocation,
  };
};

export default useTrackLocation;
