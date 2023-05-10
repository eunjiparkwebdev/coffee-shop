import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Banner from "@/components/banner";
import Card from "@/components/card";
import { FetchCoffeeStores } from "@/lib/coffee-store";
import useTrackLocation from "../hooks/use-track-location";
import { useEffect, useState, useContext } from "react";
import { ACTION_TYPES, StoreContext } from "../store/store-context";

//getStaticprops gets pre-rendered
//getStatcProps is essentially getting called on the server. it is not called on client side. Its secure. none of the user will be able to
//see the code or have an access to the code. They wont be able to inspect elements

export async function getStaticProps(context) {
  if (
    !process.env.NEXT_PUBLIC_YELP_API_KEY &&
    !process.env.AIRTABLE_API_KEY &&
    !process.env.AIRTABLE_TABLENAME &&
    !process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
  ) {
    return {
      redirect: {
        destination: "/problem",
        permanent: false,
      },
    };
  }

  const coffeeStores = await FetchCoffeeStores();

  return {
    props: {
      coffeeStores: coffeeStores,
    }, //will be passed to the page component as props
  };
}

//below props is referring to props inside of props above
export default function Home(props) {
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();

  // const [coffeeStores, setCoffeeStores] = useState("");
  const [coffeeStoresError, setCoffeeStoresError] = useState(null);
  const { dispatch, state } = useContext(StoreContext);
  const { coffeeStores, latitude, longitude, country } = state;

  useEffect(() => {
    async function setCoffeeStoresByLocation() {
      if (latitude && longitude) {
        try {
          const response = await fetch(
            `api/getCoffeeStoreByLocation/?latitude=${latitude}&longitude=${longitude}&limit=35`
          );
          const coffeeStores = await response.json();
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
  }, [dispatch, latitude, longitude]);

  const handleOnBannerButtonClick = () => {
    handleTrackLocation();
  };

  const handleCheckbox = () => {
    dispatch({
      type: ACTION_TYPES.SET_COUNTRY,
      payload: !country,
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Find Your Favorite Sushi Place!</title>
        <meta
          name="description"
          content="Our sushi restaurant locator will help you find locations near you"
        />
        <link rel="icon" href="/static/favicon.png" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>{props.buttonText}</h1>
        <div className={styles.buttonCover}>
          <div className={`${styles.button} ${styles.r} ${styles.button6}`}>
            <input
              type="checkbox"
              className={styles.checkbox}
              onChange={handleCheckbox}
              value={country}
            />
            <div className={styles.knobs}></div>
            <div className={styles.layer}></div>
          </div>
        </div>
        <Banner
          buttonText={isFindingLocation ? "Locating..." : "Sushi Near Me"}
          handleClick={handleOnBannerButtonClick}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg} </p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}
        <div className={styles.heroImage}>
          <Image
            priority
            src="/static/Sushi.svg"
            alt="hero-image"
            width={400}
            height={300}
          />{" "}
        </div>

        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Restaurants near me</h2>
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
