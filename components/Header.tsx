import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from 'react';
import useSWR from 'swr';
import { fetcher } from '../constants';

const NavLink = ({text, path, active}:{text:string, path:string, active?:boolean}) => {
  return (
    <Link href={path}>
      <a className={active ? "font-semibold" : ""}>{text}</a>
    </Link>
  );
}

export default function Header() {
  const router = useRouter();
  const { publicKey } = useWallet();
  const { data: user, error } = useSWR(`${process.env.NEXT_PUBLIC_API}/subscriber/${publicKey}`, fetcher)

  return (
    <header className="flex flex-row justify-between py-2 items-center">
      <Link href="/">
        <a className="flex flex-row gap-2">
          <img src="/logo.png" className="h-7" />
          <div className="text-lg font-medium hidden md:block">Hera Health</div>
        </a>
      </Link>
      <div className="flex flex-row items-center gap-4">
        {/* <NavLink text="Home" path="/" active={router.pathname == "/" ? true : false}/> */}
        {publicKey ? (
          user ? (
            <NavLink
              text="Dashboard"
              path="/dashboard"
              active={router.pathname == "/dashboard" ? true : false}
            />
          ) : (
            <NavLink
              text="Enroll"
              path="/enroll"
              active={router.pathname == "/enroll" ? true : false}
            />
          )
        ) : (
          null
        )}

        <WalletMultiButton className="custom-wallet-button" />
      </div>
    </header>
  );
}