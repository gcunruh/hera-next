import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import { fetcher } from "../../constants";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { AnchorProvider } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import useProgram from "../../hooks/useProgram";

const Submit: NextPage = () => {
  const program = useProgram();
  const programId = new PublicKey(
    "EhVhhvQEhyRELEKSsivfSo1YFxKa4btgspR9WGjcP6Ei"
  );
  const provider = program?.provider as AnchorProvider;
  const router = useRouter();
  const { publicKey } = useWallet();
  const [submit, setSubmit] = useState(false);
  const [about, setAbout] = useState("");
  const [amount, setAmount] = useState(0.00);
  const [currency, setCurrency] = useState("USD");
  const { data: user } = useSWR(
    `${process.env.NEXT_PUBLIC_API}/subscriber/${publicKey}`,
    fetcher
  );

  // useEffect(() => {
  //   !publicKey ? router.push("/") : null;
  // }, []);

  async function handleSubmission() {
    const hr_idx = parseInt((Date.now() / 1000).toString());
    const claimIdx = new anchor.BN(hr_idx)
    const claimIdxBuffer = claimIdx.toArrayLike(Buffer, "le", 8)

    const enrollmentSeeds = [
      Buffer.from("enrollment"),
      provider.wallet.publicKey.toBuffer(),
    ];

    const [enrollmentPda, enrollmentBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        enrollmentSeeds,
        programId
      );

    const claimSeeds = [
      Buffer.from("claim"),
      provider.wallet.publicKey.toBuffer(),
      enrollmentPda.toBuffer(),
      claimIdxBuffer,
    ];

    const [claimPda, claimBump] =
      await anchor.web3.PublicKey.findProgramAddress(claimSeeds, programId);

    let tx = new anchor.web3.Transaction();

    program &&
    tx.add(
      await program.methods
        .makeClaim(claimIdx, new anchor.BN(amount * LAMPORTS_PER_SOL))
        .accounts({
          subscriber: provider.wallet.publicKey,
          enrollment: enrollmentPda,
          claim: claimPda,
        })
        .instruction()
    );

    await provider.sendAndConfirm(tx);
    console.log("created on-chain!");

    fetch(`${process.env.NEXT_PUBLIC_API}/claim`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pub_key: publicKey,
        enrollment_id: user.enrollments[0].uuid,
        file_support: "http://www.google.com",
        claim_amount: amount.toFixed(2),
      }),
    });
    console.log("created off-chain!");
    setSubmit(true);
  }

  return (
    <div className="w-full md:w-1/2 lg:w-1/2 mx-auto">
      {!submit ? (
        <div className="space-y-4">
          <div className="space-y-8 divide-y divide-gray-200">
            <div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Submit a Claim
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  You will need to provide limited information and upload proof
                </p>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium text-gray-700"
                  >
                    About the Claim
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="about"
                      name="about"
                      rows={3}
                      className="shadow-sm focus:ring-rose-500 focus:border-rose-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                      defaultValue={""}
                      onChange={(event) => setAbout(event.target.value)}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Please provide any information about the claim that might be
                    unclear from the uploaded proof.
                  </p>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Proof of Healthcare Services
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-rose-500 hover:text-rose-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-rose-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-6">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Claim Amount
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
                <div className="sm:col-span-3">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Currency
                  </label>
                  <div className="mt-1">
                    <select
                      id="country"
                      name="country"
                      autoComplete="country-name"
                      className="shadow-sm focus:ring-rose-500 focus:border-rose-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      onChange={(event) => setCurrency(event.target.value)}
                    >
                      <option>USD</option>
                      <option>CAD</option>
                      <option>EUR</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Claims are evaluated in local currency and converted to USDC
                    based on the prevailing currency exchange rate at time of
                    submission.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <Link href="/dashboard">
                <button
                  type="button"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                >
                  Cancel
                </button>
              </Link>
              <button
                onClick={() => handleSubmission()}
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-rose-500 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-lg leading-6 font-medium text-gray-900 my-4 md:mt-8">
          Your claim is now being processed! Return to your{" "}
          <Link href="/dashboard">
            <a className="text-semibold text-rose-500">dashboard</a>
          </Link>{" "}
          to check your status.
        </div>
      )}
    </div>
  );
};

export default Submit;
