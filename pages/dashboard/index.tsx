import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { PaperClipIcon } from "@heroicons/react/solid";

const claims = [
  {
    name: "1/1/2022",
    title: "Supplemental",
    role: "Pending",
  },
  // More people...
];

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { publicKey } = useWallet();

  console.log(publicKey);

  useEffect(() => {
      !publicKey ? router.push("/") : null;
  }, []);

  return (
    <div>
      <div className="bg-white shadow-md overflow-hidden rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Hello, Gabriel
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Your information lives here
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900">Gabriel Unruh</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Coverage</dt>
              <dd className="mt-1 text-sm text-gray-900">Supplemental</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Email address
              </dt>
              <dd className="mt-1 text-sm text-gray-900">gabriel@solana.dev</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Enrollment Year
              </dt>
              <dd className="mt-1 text-sm text-gray-900">2022</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500 mb-1">
                Claimed to Date
              </dt>
              <div className="w-full bg-gray-300 rounded-full">
                <div className="bg-indigo-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full w-[25%]">
                  {" "}
                  50 <span className="hidden md:inline-block">USDC</span>
                </div>
              </div>
              <div className="text-xs mt-1">Maximum allowable: 200 USDC</div>
            </div>
          </dl>
        </div>
        <div className="mb-8">
          <div className="px-4 sm:px-6">
            <div className="sm:flex sm:items-center">
              <dt className="text-sm font-medium text-gray-500">Claims</dt>
            </div>
            <div className="mt-1 flex flex-col">
              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle px-4 md:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-xs md:text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-xs md:text-sm font-semibold text-gray-900"
                          >
                            Coverage
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-xs md:text-sm font-semibold text-gray-900"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                          >
                            <span className="sr-only">Edit</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {claims.map((person) => (
                          <tr key={person.name}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs md:text-sm font-medium text-gray-900 sm:pl-6">
                              {person.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-xs md:text-sm text-gray-500">
                              {person.title}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-xs md:text-sm text-gray-500">
                              {person.role}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-xs md:text-sm font-medium sm:pr-6">
                              <a
                                href="#"
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                View
                                <span className="sr-only">, {person.name}</span>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-lg leading-6 font-medium text-gray-900 my-4 md:mt-8">
        What would you like to do?
      </div>
      <div className="flex flex-row gap-4">
        <Link href="/dashboard/submit">
          <button
            type="button"
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit a claim
          </button>
        </Link>
        <button
          type="button"
          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          View performance
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
