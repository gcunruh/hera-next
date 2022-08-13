import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import next from "next";

const Steps = ({steps, currentStep}: {steps: any, currentStep: number}) => {
  return (
    <nav aria-label="Progress" className="mb-6">
      <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
        {steps.map((step, index: number) => (
          <li key={step.name} className="md:flex-1">
            {index < currentStep ? (
              <a
                href={step.href}
                className="group pl-4 py-2 flex flex-col border-l-4 border-indigo-600 hover:border-indigo-800 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4"
              >
                <span className="text-sm text-indigo-600 font-medium group-hover:text-indigo-800">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </a>
            ) : index < currentStep ? (
              <a
                href={step.href}
                className="pl-4 py-2 flex flex-col border-l-4 border-indigo-600 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4"
                aria-current="step"
              >
                <span className="text-sm text-indigo-600 font-medium">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </a>
            ) : (
              <a
                href={step.href}
                className="group pl-4 py-2 flex flex-col border-l-4 border-gray-200 hover:border-gray-300 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4"
              >
                <span className="text-sm text-gray-500 font-medium group-hover:text-gray-700">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

const Learn = ({ nextStep }: { nextStep: Function} ) => {
  return (
    <div className="flex justify-end">
      <button
        onClick={() => nextStep()}
        type="submit"
        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        I Understand
      </button>
    </div>
  );
}

const ChooseFund = ({ setFund, prevStep, nextStep }: { setFund: Function, prevStep: Function, nextStep: Function} ) => {
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={() => {
            setFund("Supplemental");
            nextStep();
          }}
          type="button"
          className="relative block w-full border-2 border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span className="mt-2 block text-sm font-medium text-gray-900">
            Supplemental
          </span>
        </button>
        <button
          onClick={() => {
            setFund("Catastrophic");
            nextStep();
          }}
          type="button"
          className="relative block w-full border-2 border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
        </button>
      </div>
      <div className="pt-5">
        <div className="flex justify-end">
          <button
            onClick={() => prevStep()}
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

const ProvideInformation = ({ prevStep, nextStep }: { prevStep: Function, nextStep: Function}) => {
  return (
    <form className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
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
                  className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
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
                  className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
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
                  className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
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
                  className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                >
                  <option>United States</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            onClick={() => prevStep()}
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back
          </button>
          <button
            onClick={() => nextStep()}
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}

const Pay = ({ prevStep, nextStep, fund, premiums }: { prevStep: Function, nextStep: Function, fund: string, premiums: any}) => {
  return (
    <div className="pt-5">
      <div>
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
          You elected to enroll in the{" "}
          <span className="font-semibold">{fund} Insurance Fund</span> from Hera Health
        </h3>
      </div>
      <div className="text-sm">
        The {fund} Insurance Fund is designed to provide coverage for healthcare needs. In order to recieve a reimbursement from the fund you need to submit an image of a legitiate medical bill addressed to the same name you provided in Step 2.
      </div>
      <div className="mt-6 font-semibold text-lg mb-1">600 USDC</div>
      <div>
        <h2 className="text-sm">Annual Premium Due Today</h2>
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => prevStep()}
          type="button"
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back
        </button>
        <button
          onClick={() => nextStep()}
          type="submit"
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Enroll
        </button>
      </div>
    </div>
  );
}

const Enroll: NextPage = () => {
  const [step, setStep] = useState(1);
  const [fund, setFund] = useState<"Supplemental" | "Catastrophic" | undefined>(undefined);

  const premiums = {
    "supplemental": 200,
    "catastrophic": 400
  }

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
    <div className="w-full md:w-1/2 lg:w-1/2 mx-auto">
      <div className="font-medium text-2xl mb-10">Enroll</div>
      <Steps steps={steps} currentStep={step} />
      {
        {
          1: <Learn nextStep={nextStep} />,
          2: <ChooseFund setFund={setFund} prevStep={prevStep} nextStep={nextStep} />,
          3: <ProvideInformation prevStep={prevStep} nextStep={nextStep} />,
          4: <Pay prevStep={prevStep} nextStep={nextStep} fund={fund ? fund : ""} premiums={premiums}/>,
        }[step]
      }
    </div>
  );
};

export default Enroll;
