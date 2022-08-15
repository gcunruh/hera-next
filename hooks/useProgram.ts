import { useWallet } from "@solana/wallet-adapter-react";
import { Idl, Program, AnchorProvider } from "@project-serum/anchor";
import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { openRpc } from "../programs/openRpc";
import idl from "../programs/idl.json";

export type Maybe<T> = T | null;

export default function useProgram() {
  const wallet: any = useWallet();
  const [program, setProgram] = useState<Maybe<Program<Idl>>>(null);

  useEffect(() => {
    if (!wallet) {
      return;
    }

    const programId = new PublicKey(
      "EhVhhvQEhyRELEKSsivfSo1YFxKa4btgspR9WGjcP6Ei"
    );
    const connection = openRpc();
    const opts: { preflightCommitment: "processed" } = {
      preflightCommitment: "processed",
    };
    const provider = new AnchorProvider(connection, wallet, opts);
    const programInner = new Program(idl as Idl, programId, provider);
    setProgram(programInner);
  }, [wallet]);

  return program;
}
