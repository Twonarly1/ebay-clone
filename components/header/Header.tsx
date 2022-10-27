import React from "react"
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react"
import Link from "next/link"
import {
    BellIcon,
    ShoppingCartIcon,
    ChevronDownIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline"
import Image from "next/image"

type Props = {}

const Header = (props: Props) => {
    const connectWithMetamask = useMetamask()
    const disconnect = useDisconnect()
    const address = useAddress()

    return (
        <div className=" mx-auto max-w-6xl p-2 text-skin-base">
            <nav className="flex justify-between">
                <div className="flex items-center space-x-2 text-sm">
                    {address ? (
                        <button onClick={disconnect} className="connectWalletBtn">
                            Hi, {address.slice(0, 4) + "..." + address.slice(-4)}
                        </button>
                    ) : (
                        <button onClick={connectWithMetamask} className="connectWalletBtn">
                            Connect my wallet
                        </button>
                    )}
                    <p className="headerLink">Daily Deals</p>
                    <p className="headerLink">Help & Contact</p>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                    <p className="headerLink">Ship to</p>
                    <p className="headerLink">Sell</p>
                    <p className="headerLink">Watchlist</p>
                    <Link href="/addItem" className="hover:link flex items-center">
                        Add to Inventory
                        <ChevronDownIcon className="h-4" />
                    </Link>
                    <BellIcon className="h-6 w-6" />
                    <ShoppingCartIcon className="h-6 w-6" />
                </div>
            </nav>
            <hr className="mt-2" />

            <section className="flex flex-col items-center space-y-2 space-x-2 py-5 xs:flex-row xs:space-y-0">
                <div className="h-20 w-32 flex-shrink-0 cursor-pointer  xs:h-16 xs:w-16 sm:w-28 md:w-44">
                    <Link href="/">
                        <Image
                            className="h-full w-full object-contain"
                            alt="Thirdweb Logo"
                            src="https://links.papareact.com/bdb"
                            width={100}
                            height={100}
                        />
                    </Link>
                </div>

                <button className="hidden w-20 items-center space-x-2 lg:flex">
                    <p className="text-sm text-skin-accent">Shop by Category</p>
                    <ChevronDownIcon className="h-4 flex-shrink-0" />
                </button>

                <div className="flex flex-1 items-center space-x-2 border-2 border-black px-2 py-2 md:px-5">
                    <MagnifyingGlassIcon className="w-5 text-skin-accent" />
                    <input
                        className="flex-1 outline-none"
                        type="text"
                        placeholder="Search for anything"
                    />
                </div>

                <button className="hidden border-2 border-transparent bg-skin-button-accent px-5 py-2 text-skin-inverted hover:border-blue-500 hover:bg-skin-button-accent-hover hover:text-skin-muted sm:inline md:px-10">
                    Search
                </button>
                <Link href="/create">
                    <button className="flex border-2 border-blue-500 bg-skin-button-accent-hover px-5 py-2 text-skin-muted hover:bg-skin-fill hover:text-skin-inverted md:px-10">
                        List <span className="hidden md:ml-1 md:flex">Item</span>
                    </button>
                </Link>
            </section>

            <hr />

            <section className="flex justify-center space-x-6 whitespace-nowrap py-3 px-6 text-xs md:text-sm">
                <p className="link">Home</p>
                <p className="link">Electronics</p>
                <p className="link">Computers</p>
                <p className="link hidden sm:inline">Video Games</p>
                <p className="link hidden sm:inline">Home & Garden</p>
                <p className="link hidden md:inline">Health & Beauty</p>
                <p className="link hidden lg:inline">Collectibles and Art</p>
                <p className="link hidden lg:inline">Books</p>
                <p className="link hidden lg:inline">Music</p>
                <p className="link hidden xl:inline">Deals</p>
                <p className="link hidden xl:inline">Other</p>
                <p className="link">More</p>
            </section>
        </div>
    )
}

export default Header
