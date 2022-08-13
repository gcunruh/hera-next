import React from "react";
// import Footer from "./Footer";
import Header from "./Header";

type LayoutProps = {
    children: React.ReactNode;
};

export default function Layout ( { children }: LayoutProps )
{
    return (
        <div className="px-4 md:px-8">
            <Header />
            <div className="bg-white w-full mx-auto text-black">
                { children }
            </div>
        </div>
    );
}