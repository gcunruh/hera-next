import { Connection } from "@solana/web3.js";

export function openRpc() {
  //120 sec timeout
  const CONNECTION_CONFIG_OPTIONS = {
    confirmTransactionInitialTimeout: 120000,
  };
  return new Connection(
    "https://solana-devnet.g.alchemy.com/v2/7WwfMB3zkSP2RxvTPskmt75A-C0K1jIZ",
    CONNECTION_CONFIG_OPTIONS
  );
}
