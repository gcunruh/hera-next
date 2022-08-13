import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();
  const { publicKey } = useWallet();

  useEffect(() => {
      publicKey ? router.push("/") : null;
  }, []);

  return <div>Hello world!</div>;
};

export default Home;
