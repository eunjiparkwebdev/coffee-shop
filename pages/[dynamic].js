import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

const Dynamic = () => {
  const router = useRouter();
  console.log("query", router.query);
  return (
    <div>
      <Head>
        <title>{router.query.dynamic}</title>
      </Head>
    </div>
  );
};

export default Dynamic;
