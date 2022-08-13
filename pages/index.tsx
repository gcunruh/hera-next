import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row my-0 md:my-10 l:px-2 xl:w-2/3 xl:mx-auto">
      <div className="flex-grow">
        <div className="text-xl md:text-2xl font-medium tracking-wide mt-0 md:mt-8">
          Health insurance reimagined for the little guy.
        </div>
        <div className="font-light text-sm md:text-base mt-1 md:mt-0">
          Our on-chain health insurance solution is global, efficient, and
          returns funds at the end of the year to our subscribers.
        </div>
        <Link href="/enroll">
          <div className="my-6 w-24 text-center">
            <button
              type="button"
              className="w-full items-center px-6 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-rose-500 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              Enroll
            </button>
            <div className="mt-1 text-[0.6rem] text-gray-600">On Devnet</div>
          </div>
        </Link>
        <div className="text-gray-600 mt-10 text-sm">Built on</div>
        <div className="grid grid-cols-1 md:grid-cols-2 w-24 md:w-44 items-center gap-3 md:gap-8 my-2">
          <img className="w-22" src="./solana.png" />
          <img className="w-16" src="./aws.png" />
        </div>
      </div>
      <div className="w-full md:w-2/5 max-w-lg">
        <img src="/hera_card.png" />
      </div>
    </div>
  );
}

export default Home;
