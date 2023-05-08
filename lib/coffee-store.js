import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (latitude, longitude, term, limit) => {
  return `https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&term=${term}&sort_by=best_match&limit=${limit}`;
}; //https://cors-anywhere.herokuapp.com/
const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplash.search.getPhotos({
    query: "coffee",
    page: 1,
    perPage: 40,
  });
  const unsplashResults = photos.response.results || [];
  console.log(unsplashResults);

  return unsplashResults.map((result) => result.urls["small"]);
};

export const fetchCoffeeStores = async (
  latitude = "42.302279627896375",
  longitude = "-83.00839712941224",
  limit = 6
) => {
  const photos = await getListOfCoffeeStorePhotos();
  const options = {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
      // "x-requested-with": "xmlhttprequest",
      accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_YELP_API_KEY,
    },
  };

  const response = await fetch(
    getUrlForCoffeeStores(latitude, longitude, "coffee", limit),
    options
  );
  console.log(response);
  const data = await response.json();
  return data.businesses.map((business, idx) => {
    return {
      id: business.id,
      name: business.name,
      address: business.location.address1,
      city: business.location.city,
      zip_code: business.location.zip_code,
      img_url: business.image_url,
      unsplashUrl: photos.length > 0 ? photos[idx] : null,
    };
  });

  //.catch((err)=>console.error(err));
};
