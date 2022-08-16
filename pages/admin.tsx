import { useState } from "react";
import type { NextPage } from "next";
import useProgram from "../hooks/useProgram";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { AnchorProvider } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import { HERA_USDC_MINT, fetcher } from "../constants";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import useSWR from "swr";

const Admin: NextPage = () => {
  const { data: funds, error } = useSWR('http://localhost:8000/api/funds', fetcher);
  const program = useProgram();
  const programId = new PublicKey(
      "EhVhhvQEhyRELEKSsivfSo1YFxKa4btgspR9WGjcP6Ei"
    );
  const provider = program?.provider as AnchorProvider;
  let connectedWalletAddress = provider?.publicKey?.toBase58();
  const [name, setName] = useState('');
  const [premium,  setPremium] = useState(200.00);
  const [allowable, setAllowable] = useState(600.00);
  const [year, setYear] = useState(new Date().getFullYear());

  const [amount, setAmount] = useState(10);
  const [fund, setFund] = useState(funds ? funds[0] : { name: "none" });

  const AUTHORITIES = new Set([
    "HaoeZFFMy46YTxaaHb3v7U1BmGqi4VBGXqpVHS1fu6fP",
  ]);

  async function createFund(premium: number, allowable: number, year: number) {
    const hr_idx = parseInt((Date.now() / 1000).toString());
    const idx = new anchor.BN(hr_idx);
    const idxBuffer = idx.toArrayLike(Buffer, "le", 8)

    const fundDataSeeds = [Buffer.from("fund_data"), idxBuffer];

    const fundSeeds = [Buffer.from("fund"), idxBuffer];

    const [fundDataPda, fundDataBump] = await anchor.web3.PublicKey.findProgramAddress(fundDataSeeds, programId);

    const [fundPda, fundBump] = await anchor.web3.PublicKey.findProgramAddress(fundSeeds, programId);

    try {
      let tx = new anchor.web3.Transaction();

      program &&
      tx.add(
        await program.methods
          .initializeFund(idx, premium, allowable, year)
          .accounts({
            fundData: fundDataPda,
            creator: provider.wallet.publicKey,
            fund: fundPda,
            mint: HERA_USDC_MINT,
          })
          .instruction()
      );
      await provider.sendAndConfirm(tx);
      console.log("created on-chain!");
    } catch (e) {
      console.log(e);
    }

    fetch(`${process.env.NEXT_PUBLIC_API}/fund`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name, chain_id: hr_idx.toString(), year: year, fy_premium: premium, fy_allowable: allowable }),
    });
    console.log("created off-chain!");
  }

  async function fundPool(fund_idx: number) {
    const idx = new anchor.BN(fund_idx);
    const idxBuffer = idx.toArrayLike(Buffer, "le", 8);

    const fundSeeds = [Buffer.from("fund"), idxBuffer];

    const [fundPda, fundBump] = await anchor.web3.PublicKey.findProgramAddress(
      fundSeeds,
      programId
    );

    const tokenAta = await getAssociatedTokenAddress(
      HERA_USDC_MINT,
      provider.wallet.publicKey,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    try {
      let tx = new anchor.web3.Transaction();

      program &&
      tx.add(
        await program.methods
          .seedFund(new anchor.BN(amount * LAMPORTS_PER_SOL))
          .accounts({
            sender: provider.wallet.publicKey,
            fund: fundPda,
            fromAccount: tokenAta,
          })
          .instruction()
      );

      await provider.sendAndConfirm(tx);
      console.log("funded on-chain")
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      {connectedWalletAddress ? (
        AUTHORITIES.has(connectedWalletAddress) ? (
          <div className="w-full md:w-1/2 lg:w-1/2 mx-auto">
            <div className="mb-8">
              <div className="mb-4">Create Fund</div>
              <div className="mb-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="shadow-sm focus:ring-rose-500 focus:border-rose-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Supplemental"
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
              </div>
              <div className="mb-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Year
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="year"
                    id="year"
                    className="shadow-sm focus:ring-rose-500 focus:border-rose-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder={year.toString()}
                    onChange={(event) => setYear(parseInt(event.target.value))}
                  />
                </div>
              </div>
              <div className="mb-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Year Premium
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="premium"
                    id="premium"
                    className="shadow-sm focus:ring-rose-500 focus:border-rose-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder={premium.toString()}
                    onChange={(event) =>
                      setPremium(parseInt(event.target.value))
                    }
                  />
                </div>
              </div>
              <div className="mb-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Year Allowable
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="allowable"
                    id="allowable"
                    className="shadow-sm focus:ring-rose-500 focus:border-rose-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder={allowable.toString()}
                    onChange={(event) =>
                      setAllowable(parseInt(event.target.value))
                    }
                  />
                </div>
              </div>
              <div className="pt-5 pb-8">
                <div className="flex justify-end">
                  <button
                    onClick={() => createFund(premium, allowable, year)}
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-rose-500 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
            <div className="mb-8">
              <div className="mb-4">Fund a Pool</div>
              <div className="mb-2">
                <label
                  htmlFor="fund"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fund
                </label>
                <select
                  id="fund"
                  name="fund"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm rounded-md"
                  placeholder="Select Fund"
                  onChange={(event) => setFund(funds.find((obj: any) => obj.name === event.target.value))}
                >
                  {funds &&
                    funds.map((i: any) => <option key={i.uuid}>{i.name}</option>)}
                </select>
              </div>
              <div className="mb-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Funding Amount
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="allowable"
                    id="allowable"
                    className="shadow-sm focus:ring-rose-500 focus:border-rose-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder={amount.toString()}
                    onChange={(event) =>
                      setAmount(parseInt(event.target.value))
                    }
                  />
                </div>
              </div>
              <div className="pt-5 pb-8">
                <div className="flex justify-end">
                  <button
                    onClick={() => fundPool(fund.chain_id)}
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-rose-500 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                  >
                    Fund
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="my-0 md:my-8 mx-auto px-2 md:px-2 lg:px-24 text-white">
            Not authorized
          </div>
        )
      ) : (
        <div className="my-0 md:my-8 mx-auto px-2 md:px-2 lg:px-24 text-white">
          Connect your wallet
        </div>
      )}
    </>
  );
};

export default Admin;
