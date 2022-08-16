import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  createAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createTransferInstruction,
} from "@solana/spl-token";
import { PublicKey, Keypair, Connection, LAMPORTS_PER_SOL, sendAndConfirmTransaction } from "@solana/web3.js";
import { HERA_USDC_MINT } from "../constants";
import * as anchor from "@project-serum/anchor";
import { token } from "@project-serum/anchor/dist/cjs/utils";


export default function Footer() {
  const router = useRouter();
  const { publicKey } = useWallet();

  async function handleFaucet() {

    if (publicKey) {
    const connection = new Connection(
        "https://solana-devnet.g.alchemy.com/v2/7WwfMB3zkSP2RxvTPskmt75A-C0K1jIZ"
    );

    // UNSAFE: Do not do anything like this in mainnet
    const faucetWallet = Keypair.fromSecretKey(
      Uint8Array.from([
        35, 164, 184, 236, 85, 51, 101, 58, 103, 93, 37, 132, 41, 139, 184, 142,
        204, 218, 86, 154, 160, 165, 6, 246, 234, 135, 37, 218, 60, 123, 32,
        152, 166, 83, 33, 242, 222, 67, 224, 134, 85, 233, 136, 76, 171, 138,
        242, 254, 144, 185, 93, 167, 37, 153, 82, 145, 94, 240, 208, 79, 45, 40,
        90, 241,
      ])
    );

    const tokenAta = await getAssociatedTokenAddress(
      HERA_USDC_MINT,
      faucetWallet.publicKey,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    console.log(publicKey)

    // const persontokenAta = await getAssociatedTokenAddress(
    // HERA_USDC_MINT,
    // publicKey,
    // false,
    // TOKEN_PROGRAM_ID,
    // ASSOCIATED_TOKEN_PROGRAM_ID
    // );

    let subscriberTokenAccount: PublicKey

    try {
        subscriberTokenAccount = await createAssociatedTokenAccount(
        connection,
        faucetWallet,
        HERA_USDC_MINT,
        publicKey
        );
    } catch (e) {
      subscriberTokenAccount = await getAssociatedTokenAddress(
      HERA_USDC_MINT,
      publicKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
      );
    }

    const txFundTokenAccount = new anchor.web3.Transaction();
    txFundTokenAccount.add(
      createTransferInstruction(
        tokenAta,
        subscriberTokenAccount,
        faucetWallet.publicKey,
        500 * LAMPORTS_PER_SOL
      )
    );

    const txFundTokenSig = await sendAndConfirmTransaction(
      connection,
      txFundTokenAccount,
      [faucetWallet]
    );

    console.log("hitting");
    }
  }

  return (
    <footer className="mt-44 w-full flex flex-col justify-between py-2 items-center">
      <Link href="/">
        <a className="flex flex-row gap-2 mx-auto">
          <div className="text-lg font-medium hidden md:block">Hera Health</div>
        </a>
      </Link>
    <div className="mx-auto text-gray-400 text-xs my-1">
        Need Hera USDC to test? Make sure your wallet is connected and <span onClick={() => handleFaucet()} className="underline cursor-pointer">Click here</span>
    </div>
    </footer>
  );
}
