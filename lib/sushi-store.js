import { createApi } from "unsplash-js";

export const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

export const getUrlForSushiStores = (latitude, longitude, term, limit) => {
  return `https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&term=${term}&sort_by=best_match&limit=${limit}`;
};
export const getListOfSushiStorePhotos = async () => {
  const photos = await unsplash.search.getPhotos({
    query: "sushi",
    perPage: 40,
  });
  const unsplashResults = photos.response?.results || [];
  return unsplashResults.map((result) => result.urls["small"]);
};

export const FetchSushiStores = async (
  latitude = "42.302279627896375",
  longitude = "-83.00839712941224",
  limit = 20
) => {
  const photos = await getListOfSushiStorePhotos();
  const options = {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
      accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_YELP_API_KEY,
    },
  };

  const response = await fetch(
    getUrlForSushiStores(latitude, longitude, "sushi", limit),
    options
  );
  const data = await response.json();

  return (
    data.businesses &&
    data.businesses.map((business, idx) => {
      return {
        id: business.id,
        name: business.name,
        address: business.location.address1,
        country: business.location.country,
        city: business.location.city,
        zip_code: business.location.zip_code,
        img_url: business.image_url,
        unsplashUrl: photos.length > 0 ? photos[idx] : null,
      };
    })
  );

  //.catch((err)=>console.error(err));
};
