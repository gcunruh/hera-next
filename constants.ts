import { PublicKey, SystemProgram } from "@solana/web3.js";

export const HERA_USDC_MINT = new PublicKey(
  "5kU3fkzBcmpirSbjDY99QqQ3Zq8ABks1JMzZxAVx16Da"
);

export const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());