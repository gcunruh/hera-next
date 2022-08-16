import { useState } from "react";
import useSWR from "swr";
import type { NextPage } from "next";
import { AnchorProvider } from "@project-serum/anchor";
import useProgram from "../hooks/useProgram";
import * as anchor from "@project-serum/anchor";
import { Idl, Program } from "@project-serum/anchor";
import { LAMPORTS_PER_SOL, PublicKey, Connection } from "@solana/web3.js";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import Head from "next/head";
import Image from "next/image";
import next from "next";
import { fetcher, HERA_USDC_MINT } from "../constants";
import { Metaplex, keypairIdentity, walletAdapterIdentity } from "@metaplex-foundation/js";

export type Maybe<T> = T | null;

const Steps = ({steps, currentStep}: {steps: any, currentStep: number}) => {
  return (
    <nav aria-label="Progress" className="md:mb-6">
      <ol role="list" className="space-y-3 md:flex md:space-y-0 md:space-x-8">
        {steps.map((step: any, index: number) => (
          <li key={step.name} className="md:flex-1">
            {index < currentStep ? (
              <div
                className="group pl-4 py-2 flex flex-col border-l-4 border-rose-500 hover:border-rose-800 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4"
              >
                <span className="text-sm text-rose-500 font-medium group-hover:text-rose-800">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </div>
            ) : index < currentStep ? (
              <div
                className="pl-4 py-2 flex flex-col border-l-4 border-rose-500 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4"
                aria-current="step"
              >
                <span className="text-sm text-rose-500 font-medium">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </div>
            ) : (
              <div
                className="group pl-4 py-2 flex flex-col border-l-4 border-gray-200 hover:border-gray-300 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4"
              >
                <span className="text-sm text-gray-500 font-medium group-hover:text-gray-700">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

const Learn = ({ nextStep }: { nextStep: Function} ) => {
  return (
    <div className="md:pt-8">
      <div className="my-4">
        This is an experimental health insurance service designed to provide
        global health coverage to subscribers through a self-insurance pool.
        When you self-insure, you are taking on the risk that the fund may not
        be able to pay out in high-risk years. However, in low risk years, a
        self-insurer will pay out redemptions back to subscribers, reducing your
        overall cost.
      </div>
      <div className="mb-4 font-medium text-lg">
        Hera offers two funds designed for different goals
        <ol className="list-decimal font-normal text-base mt-2">
          <li>
            Supplemental Insurance - This fund is designed for people with
            existing health insurance coverage, and is used to offset additional
            out of pocket expenses including services not covered by existing
            insurance or insurance deductibles.
          </li>
          <li>
            Catastrophic Insurance - This fund is designed for people without
            existing health insurance coverage, and is used to pay for out of
            pocket health care costs. This fund is specifically geared towards
            consumers in countries where insurance might be unattainable due to
            infrastructure or cost.
          </li>
        </ol>
      </div>
      <div className="mb-4 font-medium text-lg">
        Hera&apos;s insurance funds are administered on-chain through Solana.
        The funds are also denominated in USDC. There are certain benefits to
        this administration model including:
        <ul className="list-disc font-normal text-base mt-2">
          <li>Trustless accounting</li>
          <li>Automated claims processing and reduced adminsitration costs</li>
          <li>A global fund across borders and networks</li>
          <li>A stablecurrency that operates beyond markets and border</li>
          <li>
            Lower marketing expense compared to traditional insurance models
          </li>
        </ul>
      </div>
      <div className="mb-4 italic">
        By enrolling in a Hera Health you agree that you are enrolling in an
        experimental insurance product with certain inherent risks.
      </div>
      <div>
        To read more about Hera&apos;s fund model, claims processing, and
        administration,{" "}
        <a
          className="text-rose-500 font-semibold"
          href="https://docs.google.com/document/d/1AlE1l3OXakVMIbT0FIXJRWjOMefC068TtZRPK9lGQR0/edit?usp=sharing"
        >
          click here
        </a>
        .
      </div>
      <div className="pt-5 pb-8">
        <div className="flex justify-end">
          <button
            onClick={() => nextStep()}
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-rose-500 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}

const ChooseFund = ({ funds, fund, setFund, prevStep, nextStep }: {funds: any, fund: string, setFund: Function, prevStep: Function, nextStep: Function} ) => {
  console.log(fund);
  return (
    <div className="pt-4 md:pt-8">
      <div className="flex flex-col md:flex-row gap-4">
        {funds.map((i: any) => (
          <button
            key={i.uuid}
            onClick={() => {
              setFund(i.name);
            }}
            type="button"
            className={`relative block w-full border-2 rounded-lg p-12 text-center focus:outline-none ${
              i.name === fund
                ? "border-rose-500"
                : "hover:border-gray-400 border-gray-300"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="mt-2 block text-sm font-medium text-gray-900">
              {i.name}
            </span>
          </button>
        ))}
        {/* <button
          onClick={() => {
            setFund("Catastrophic");
          }}
          type="button"
          className={`relative block w-full border-2 rounded-lg p-12 text-center focus:outline-none ${
            fund === "Catastrophic"
              ? "border-rose-500"
              : "hover:border-gray-400 border-gray-300"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <span className="mt-2 block text-sm font-medium text-gray-900">
            Catastrophic
          </span>
        </button> */}
      </div>
      <div className="pt-5">
        <div className="flex justify-end">
          <button
            onClick={() => {
              setFund(undefined);
              prevStep();
            }}
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
          >
            Back
          </button>
          <button
            onClick={() => {
              fund ? nextStep() : null;
            }}
            type="submit"
            className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-rose-500 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 ${
              fund ? "" : "cursor-not-allowed"
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

const ProvideInformation = ({ prevStep, nextStep, setFirstName, setLastName, setEmail, setCountry, firstName, lastName, email, country }: { prevStep: Function, nextStep: Function, setFirstName: Function, setLastName: Function, setEmail: Function, setCountry: Function, firstName: string, lastName: string, email: string, country: string }) => {
  return (
    <div className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div className="pt-4 md:pt-8 space-y-6 sm:pt-10 sm:space-y-5">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Personal Information
            </h3>
          </div>
          <div className="space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                First name
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  autoComplete="given-name"
                  className="max-w-lg block w-full shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  onChange={(event) => setFirstName(event.target.value)}
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="last-name"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Last name
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  autoComplete="family-name"
                  className="max-w-lg block w-full shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  onChange={(event) => setLastName(event.target.value)}
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Email address
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block max-w-lg w-full shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm border-gray-300 rounded-md"
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Country of Residence
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <select
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  className="max-w-lg block focus:ring-rose-500 focus:border-rose-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  onChange={(event) => setCountry(event.target.value)}
                >
                  <option>United States</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5 pb-8">
        <div className="flex justify-end">
          <button
            onClick={() => prevStep()}
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
          >
            Back
          </button>
          <button
            onClick={() => {(firstName.length < 1 || lastName.length < 1 || email.length < 1 || country.length < 1) ? null : nextStep()}}
            className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-rose-500 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 ${(firstName.length < 1 || lastName.length < 1 || email.length < 1 || country.length < 1) ? "cursor-not-allowed" : ""}`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

const Pay = ({ prevStep, nextStep, funds, fund, program, programId, provider, fund_idx, firstName, lastName, email }: { prevStep: Function, nextStep: Function, funds: any, fund: string, program: Maybe<Program<Idl>>, programId: PublicKey, provider: AnchorProvider, fund_idx: string, firstName: string, lastName: string, email: string }) => {

  async function handleEnrollment() {
    const enrollmentSeeds = [
      Buffer.from("enrollment"),
      provider.wallet.publicKey.toBuffer()
    ]

    const [enrollmentPda, enrollmentBump] = await anchor.web3.PublicKey
        .findProgramAddress(
            enrollmentSeeds,
            programId,
    );

    const idx = new anchor.BN(fund_idx);
    const idxBuffer = idx.toArrayLike(Buffer, "le", 8);

    const fundDataSeeds = [Buffer.from("fund_data"), idxBuffer];

    const fundSeeds = [Buffer.from("fund"), idxBuffer];

    const [fundDataPda, fundDataBump] = await anchor.web3.PublicKey.findProgramAddress(fundDataSeeds, programId);

    const [fundPda, fundBump] = await anchor.web3.PublicKey.findProgramAddress(fundSeeds, programId);

    const tokenAta = await getAssociatedTokenAddress(
      HERA_USDC_MINT,
      provider.wallet.publicKey,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
    try {
      let tx = new anchor.web3.Transaction();

      program &&
      tx.add(
        await program.methods.enroll(new anchor.BN(funds.find((obj: any) => obj.name === fund).fy_premium * LAMPORTS_PER_SOL)).accounts({
          subscriber: provider.wallet.publicKey,
          fundData: fundDataPda,
          enrollment: enrollmentPda,
          fund: fundPda,
          fromAccount: tokenAta
        }).instruction()
      )

      await provider.sendAndConfirm(tx)
      console.log("enrolled on-chain!");
    } catch (e) {
      console.log(e);
    }

    // API
    fetch(`${process.env.NEXT_PUBLIC_API}/enroll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fund: fund,
        pub_key: provider.wallet.publicKey.toBase58(),
        first_name: firstName,
        last_name: lastName,
        email: email,
        paid_in: funds.find((obj: any) => obj.name === fund).fy_premium
      }),
    });
    console.log("enrolled off-chain!");
    nextStep();
  }

  return (
    <div className="pt-4 md:pt-5">
      <div>
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
          You have elected to enroll in the{" "}
          <span className="font-semibold">{fund} Insurance Fund</span> from Hera
          Health
        </h3>
      </div>
      <div className="text-sm">
        The {fund} Insurance Fund is designed to provide coverage for healthcare
        needs. In order to recieve a reimbursement from the fund you will need
        to submit an image of a legitimate medical bill for care administered to
        the same name you provided in Step 3.
      </div>
      <div className="mt-6 font-semibold text-lg text-right">
        {funds.find((obj: any) => obj.name === fund).fy_premium} USDC
      </div>
      <div>
        <h2 className="text-sm text-right">Annual Premium Due Today</h2>
      </div>
      <div className="pt-4 flex justify-end">
        <button
          onClick={() => prevStep()}
          type="button"
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
        >
          Back
        </button>
        <button
          onClick={() => handleEnrollment()}
          type="submit"
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-rose-500 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
        >
          Enroll
        </button>
      </div>
      <div className="text-xs mt-8 italic">
        Note: When you click Enroll you will be paying your annual premium and
        will be able to claim an insurance card NFT in your wallet. You will need to submit claims using the same wallet you use to enroll.
      </div>
    </div>
  );
}

const Mint = ({ provider, firstName, lastName, fund, year, metaplex }: { provider: any, firstName: string, lastName: string, fund: string, year: number, metaplex: any}) => {

  async function handleMint() {
    const image_uri = await fetch(`${process.env.NEXT_PUBLIC_API}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pub_key: provider.wallet.publicKey.toBase58(),
        name: firstName + " " + lastName,
        year: year,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data.uri;
      });

    const metadata = {
      name: "Hera Health Card",
      symbol: "HH",
      description: `Hera Health Insurance Card for the ${fund} Fund`,
      seller_fee_basis: 0,
      external_url: "https://herahealth.com",
      edition: 1,
      background_color: "FFFFFF",
      attributes: [
        {
          trait_type: "Fund",
          value: fund,
        },
        {
          trait_type: "Year",
          value: year,
        }
      ],
      properties: {
        category: "image",
        creators: [
          {
            address: provider.wallet.publicKey.toBase58(),
            share: 100,
          },
        ],
        files: [
          {
            uri: image_uri,
            type: "image/png",
          },
        ],
      },
      image: image_uri,
    };

    const uri = await fetch(`${process.env.NEXT_PUBLIC_API}/createmetadata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(metadata),
    })
      .then((response) => response.json())
      .then((data) => {
        return data.uri;
      });

  console.log(uri)

    const { nft } = await metaplex
      .nfts()
      .create({
        uri: uri,
        name: "Hera Health Card",
        symbol: "HH",
        sellerFeeBasisPoints: 0, // Represents 5.00%.
      })
      .run();
  }

  return (
    <div className="pt-4 md:pt-5">
      <div>
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
          Congrats on enrolling!
        </h3>
      </div>
      <div>
        Click the button below to get your personalized insurance card
        representing your enrollment in a{" "}
        <span className="font-semibold">Hera Health</span> fund.
      </div>
      <div className="pt-4 flex justify-end">
        <button
          onClick={() => handleMint()}
          type="submit"
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-rose-500 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
        >
          Get Card
        </button>
      </div>
    </div>
  );
}

const Enroll: NextPage = () => {
  const { data: funds, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API}/funds`,
    fetcher
  );
  const program = useProgram();
  const programId = new PublicKey(
    "EhVhhvQEhyRELEKSsivfSo1YFxKa4btgspR9WGjcP6Ei"
  );
  const provider = program?.provider as AnchorProvider;
  const connection = new Connection(
    "https://solana-devnet.g.alchemy.com/v2/7WwfMB3zkSP2RxvTPskmt75A-C0K1jIZ"
  );
  const metaplex = new Metaplex(connection).use(walletAdapterIdentity(provider.wallet));
  const [step, setStep] = useState(1);
  const [fund, setFund] = useState<"Supplemental" | "Catastrophic" | "">("");
  const [ firstName, setFirstName ] = useState("");
  const [ lastName, setLastName ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ country, setCountry ] = useState("United States");

  const steps = [
    { id: "Step 1", name: "Learn", href: "#" },
    { id: "Step 2", name: "Choose Fund", href: "#" },
    { id: "Step 3", name: "Provide Information", href: "#" },
    { id: "Step 4", name: "Enroll", href: "#" },
  ];

  const prevStep = () => {
    setStep(step - 1);
  };

  const nextStep = () => {
    setStep(step + 1);
  };
  return (
    <>
      {(!provider) ? (
        <div className="my-0 md:my-8 mx-auto px-2 md:px-2 lg:px-24 text-white">
        </div>
      ) : (
        <div className="w-full md:w-1/2 lg:w-1/2 mx-auto">
          <div className="font-medium text-2xl mb-2 md:mb-10">Enroll</div>
          <Steps steps={steps} currentStep={step} />
          {
            {
              1: <Learn nextStep={nextStep} />,
              2: (
                <ChooseFund
                  funds={funds}
                  fund={fund}
                  setFund={setFund}
                  prevStep={prevStep}
                  nextStep={nextStep}
                />
              ),
              3: (
                <ProvideInformation
                  prevStep={prevStep}
                  nextStep={nextStep}
                  setFirstName={setFirstName}
                  setLastName={setLastName}
                  setEmail={setEmail}
                  setCountry={setCountry}
                  firstName={firstName}
                  lastName={lastName}
                  email={email}
                  country={country}
                />
              ),
              4: (
                <Pay
                  prevStep={prevStep}
                  nextStep={nextStep}
                  funds={funds}
                  fund={fund ? fund : ""}
                  program={program}
                  programId={programId}
                  provider={provider}
                  fund_idx={
                    funds &&
                    fund &&
                    funds.find((obj: any) => obj.name === fund).chain_id
                  }
                  firstName={firstName}
                  lastName={lastName}
                  email={email}
                />
              ),
              5: (
                <Mint
                  provider={provider}
                  year={
                    funds &&
                    fund &&
                    funds.find((obj: any) => obj.name === fund).year
                  }
                  firstName={firstName}
                  lastName={lastName}
                  fund={fund}
                  metaplex={metaplex}
                />
              ),
            }[step]
          }
        </div>
      )}
    </>
  );
};

export default Enroll;
