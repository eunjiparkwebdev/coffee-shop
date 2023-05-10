import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import Head from "next/head";
import styles from "../../styles/coffee-store.module.css";
import Image from "next/image";
import cls from "classnames";
import { FetchCoffeeStores } from "@/lib/coffee-store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { StoreContext } from "@/store/store-context";
import { isEmpty, fetcher } from "@/utils";
import useSWR from "swr";

//these functions will execute only if user clicks on each card which has a dynamic route
export async function getStaticProps(staticProps) {
  //these console.log will only run in the command line on serverside.
  const params = staticProps.params;
  const coffeeStores = await FetchCoffeeStores();
  const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
    return coffeeStore.id.toString() === params.id; //dynamic id
  });

  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  };
}

export async function getStaticPaths() {
  const coffeeStores = await FetchCoffeeStores();

  const paths = coffeeStores.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.id.toString(),
      },
    };
  });
  return {
    //path is an array returning objects with id
    paths,
    //if the route is not the path other than the paths, please render 404 page
    //this will look at getStaticProps as a way to pre-render the content
    // fallback: false,

    //fallback : true is importanct if a lot of static pages. If user tries to access a route that is not in
    //the paths, if fallback is set to true, nextJS will show a state to a user. Nextjs will download the page
    //on the go. That page is not pre-rendered. it gets downloaded on the fly
    fallback: true,
  };
}

//below props is whatever that was clicked in index.js(home page)
const CoffeeStore = (initialProps) => {
  const router = useRouter();

  const id = router.query.id;
  const [coffeeStore, setCoffeeStore] = useState(
    initialProps.coffeeStore || {}
  );

  const [votingCount, setVotingCount] = useState(0);
  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher, {
    refreshInterval: 1000,
  });

  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
          return coffeeStore.id.toString() === id; //dynamic id
        });
        setCoffeeStore(findCoffeeStoreById);
        handleCreateCoffeeStore(findCoffeeStoreById);
      }
    } else {
      // SSG
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [id, initialProps.coffeeStore, coffeeStores]);

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);
      setVotingCount(data[0].voting);
    }
  }, [data]);

  if (error) {
    return <div>Something went wrong retrieving coffee store page</div>;
  }

  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const { id, name, address, city, zip_code, voting, img_url } =
        coffeeStore;
      //this fetch is get method
      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          voting,
          address: address || "",
          city: city || "",
          zip_code: zip_code || "",
          voting: 0,
          img_url,
        }),
      });

      const dbCoffeeStore = response.json();
    } catch (err) {
      console.error("error creating coffee store", err);
    }
  };

  const {
    name = "",
    address = "",
    city = "",
    zip_code = "",
    img_url = "",
    unsplashUrl = "",
  } = coffeeStore;

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const handleUpVoteButton = async () => {
    try {
      //this fetch is get method
      const response = await fetch("/api/favouriteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const dbCoffeeStore = response.json();
      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        let count = votingCount + 1;
        setVotingCount(count);
      }
    } catch (err) {
      console.error("error upvoting coffee store", err);
    }
  };

  if (error) {
    return <div>Something went wrong retrieving coffee store page.</div>;
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <FontAwesomeIcon
                icon={faArrowLeft}
                style={{ fontSize: 16, marginRight: 7 }}
              />
              Back to home
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              img_url ||
              unsplashUrl ||
              "https://images.unsplash.com/photo-1541167760496-1628856ab772?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1637&q=80"
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          ></Image>
        </div>
        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/location.svg"
              width="24"
              height="24"
              alt="icon"
            ></Image>
            <p className={styles.text}>{address}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/nearme.svg"
              width="24"
              height="24"
              alt="icon"
            ></Image>
            <p className={styles.text}>
              {city}, {zip_code}
            </p>
          </div>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/grade.svg"
              width="24"
              height="24"
              alt="icon"
            ></Image>
            <p className={styles.text}>{votingCount}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpVoteButton}>
            Up Vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
