import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Banner from "./components/banner";
import Card from "./components/card";
import { fetchCoffeeStores } from "@/lib/coffee-store";
import useTrackLocation from "./hooks/use-track-location";
import { useEffect, useState, useContext } from "react";
import { ACTION_TYPES, StoreContext } from "../store/store-context";

//getStaticprops gets pre-rendered
//getStatcProps is essentially getting called on the server. it is not called on client side. Its secure. none of the user will be able to
//see the code or have an access to the code. They wont be able to inspect elements

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();

  return {
    props: {
      coffeeStores: coffeeStores,
    }, //will be passed to the page component as props
  };
}

//below props is referring to props inside of props above
export default function Home(props) {
  console.log("props?=", props);

  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();

  // const [coffeeStores, setCoffeeStores] = useState("");
  const [coffeeStoresError, setCoffeeStoresError] = useState(null);
  const { dispatch, state } = useContext(StoreContext);
  const { coffeeStores, latitude, longitude } = state;

  console.log({ latitude, longitude, locationErrorMsg });

  //we want to fetch new coffee stores only if there is a lat Long data from the user

  useEffect(() => {
    async function setCoffeeStoresByLocation() {
      if (latitude && longitude) {
        try {
          const response = await fetch(
            `api/getCoffeeStoresByLocation?/latitude=${latitude}&longitude=${longitude}&limit=30`
          );
          const coffeeStores = await response.json();
          console.log("fetched coffee stores", { response });
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: { coffeeStores },
          });
          // setCoffeeStores(fetchedCoffeeStores);
          //set coffee stores
        } catch (error) {
          //set error
          console.log({ error });
          setCoffeeStoresError(error.message);
        }
      }
    }
    setCoffeeStoresByLocation();
  }, [latitude, longitude]);

  const handleOnBannerButtonClick = () => {
    console.log("hi banner button");
    handleTrackLocation();
    console.log(isFindingLocation);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Find Your Favorite Coffee Shop!</title>
        <meta
          name="description"
          content="Our coffee shop locator will help you find locations near you"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>{props.buttonText}</h1>
        <Banner
          buttonText={isFindingLocation ? "Locating..." : "View stores nearby"}
          handleClick={handleOnBannerButtonClick}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg} </p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}
        <div className={styles.heroImage}>
          <Image
            priority
            src="/static/hero-image.png"
            alt="hero-image"
            width={700}
            height={400}
          />{" "}
        </div>

        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.id}
                    name={coffeeStore.name}
                    imgUrl={coffeeStore.img_url || coffeeStore.unsplashUrl}
                    href={`/coffee-store/${coffeeStore.id}`}
                    className={styles.card}
                    alt={`picture of ${coffeeStore.name} store`}
                  />
                );
              })}
            </div>
          </div>
        )}

        <div className={styles.sectionWrapper}>
          {props.coffeeStores.length > 0 && (
            <>
              <h2 className={styles.heading2}>Windsor stores</h2>
              <div className={styles.cardLayout}>
                {props.coffeeStores.map((coffeeStore) => {
                  return (
                    <Card
                      key={coffeeStore.id}
                      name={coffeeStore.name}
                      imgUrl={coffeeStore.img_url}
                      href={`/coffee-store/${coffeeStore.id}`}
                      className={styles.card}
                      alt={`picture of ${coffeeStore.name} store`}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
