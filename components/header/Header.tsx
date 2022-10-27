import React, { Fragment, useEffect, useState } from "react"
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react"
import Link from "next/link"
import {
    BellIcon,
    ShoppingCartIcon,
    ChevronDownIcon,
    MagnifyingGlassIcon,
    Bars3Icon,
    XMarkIcon,
    BookmarkIcon,
    TagIcon,
    TruckIcon,
    PlusIcon,
    PlusSmallIcon,
} from "@heroicons/react/24/outline"
import Image from "next/image"
import { Dropdown } from "components/categories"
import { Transition, Dialog } from "@headlessui/react"

type Props = {
    setThemeWhatever: any
}

const Header = ({ setThemeWhatever }: Props) => {
    const connectWithMetamask = useMetamask()
    const disconnect = useDisconnect()
    const address = useAddress()
    const [mounted, setMounted] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)

    useEffect(() => {
        setMounted(true)
        // setTimeout(() => {
        //   setMounted(false);
        // }, 5000);
    }, [])

    return (
        <div className=" mx-auto max-w-6xl bg-flatWhite p-2 text-skin-base">
            <nav className="flex justify-between">
                <div className="flex items-center space-x-2 text-sm">
                    {address ? (
                        <button
                            onClick={disconnect}
                            className="connectWalletBtn hover:border-grayBorder"
                        >
                            Hi, {address.slice(0, 4) + "..." + address.slice(-4)}
                        </button>
                    ) : (
                        <button
                            onClick={connectWithMetamask}
                            className="connectWalletBtn flex hover:border-grayBorder"
                        >
                            Connect <span className="ml-1 hidden md:flex">my wallet</span>
                        </button>
                    )}
                    <p className="headerLink flex">
                        <span className="mr-1 hidden md:flex">Daily</span> Deals
                    </p>
                    <p className="headerLink flex">
                        Help<span className="ml-1 hidden md:flex">& Contact</span>
                    </p>
                </div>

                <div className="flex items-center space-x-2 text-sm">
                    <div className="mt-1 items-center space-x-1">
                        <button
                            className="animate-blob"
                            onClick={() => setThemeWhatever("theme-ebay-red")}
                        >
                            <div className="h-4 w-4 rounded-full bg-ebay-red md:h-5 md:w-5" />
                        </button>
                        <button
                            className="animation-delay-2000 animate-blob"
                            onClick={() => setThemeWhatever("root")}
                        >
                            <div className="h-4 w-4 rounded-full bg-ebay-blue md:h-5 md:w-5" />
                        </button>
                        <button
                            className="animation-delay-4000 animate-blob"
                            onClick={() => setThemeWhatever("theme-ebay-yellow")}
                        >
                            <div className="h-4 w-4 rounded-full bg-ebay-yellow md:h-5 md:w-5" />
                        </button>
                        <button
                            className="animation-delay-6000 animate-blob"
                            onClick={() => setThemeWhatever("theme-ebay-green")}
                        >
                            <div className="h-4 w-4 rounded-full bg-ebay-green md:h-5 md:w-5" />
                        </button>
                    </div>
                    <div className="links cursor-pointer">
                        <Bars3Icon
                            onClick={() => setOpen(true)}
                            className="h-8 w-8 rounded border border-grayBorder p-1  font-medium "
                        />
                    </div>
                    <Transition.Root show={open} as={Fragment}>
                        <Dialog as="div" className="relative z-20" onClose={setOpen}>
                            <div className="fixed inset-0" />
                            <div className="fixed inset-0 overflow-hidden">
                                <div className="absolute inset-0 overflow-hidden">
                                    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
                                        <Transition.Child
                                            as={Fragment}
                                            enter="transform transition ease-in-out duration-500 sm:duration-700"
                                            enterFrom="translate-x-full"
                                            enterTo="translate-x-0"
                                            leave="transform transition ease-in-out duration-500 sm:duration-700"
                                            leaveFrom="translate-x-0"
                                            leaveTo="translate-x-full"
                                        >
                                            <Dialog.Panel className="pointer-events-auto w-screen md:w-[377px]">
                                                <div className="flex h-full flex-col overflow-y-scroll bg-bkg shadow-xl">
                                                    <div className="flex items-center justify-between border-b md:border-none">
                                                        <Dialog.Title className="py-2 px-6 text-3xl font-semibold">
                                                            <Link href="/">
                                                                <Image
                                                                    className="h-full w-full object-contain"
                                                                    alt="Thirdweb Logo"
                                                                    src="https://links.papareact.com/bdb"
                                                                    width={100}
                                                                    height={100}
                                                                />
                                                            </Link>
                                                        </Dialog.Title>
                                                        <div className="mr-3 flex items-center">
                                                            <button
                                                                type="button"
                                                                className=" rounded-md focus:outline-none"
                                                                onClick={() => setOpen(false)}
                                                            >
                                                                <span className="sr-only">
                                                                    Close panel
                                                                </span>
                                                                <XMarkIcon
                                                                    className="w-6"
                                                                    aria-hidden="true"
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col divide-y px-3 text-left">
                                                        <div className="flex justify-center space-x-2 py-4 md:justify-start ">
                                                            <TruckIcon className="w-6" />
                                                            <p className="headerLink">Ship to</p>
                                                        </div>
                                                        <div className="flex justify-center space-x-2 py-4 md:justify-start ">
                                                            <TagIcon className="w-6" />
                                                            <p className="headerLink">Sell</p>
                                                        </div>
                                                        <div className="flex justify-center space-x-2 py-4 md:justify-start ">
                                                            <BookmarkIcon className="w-6" />
                                                            <p className="headerLink">Watchlist</p>
                                                        </div>
                                                        <Link
                                                            href="/addItem"
                                                            className="hover:link headerLink flex items-center  justify-center space-x-2 py-4 md:justify-start"
                                                        >
                                                            <PlusIcon className="w-6 cursor-pointer" />
                                                            <p>Add to Inventory</p>
                                                            <ChevronDownIcon className="h-4" />
                                                        </Link>
                                                        <div className="flex justify-center space-x-2 py-4 md:justify-start ">
                                                            <BellIcon className="headerLink w-6 cursor-pointer" />{" "}
                                                            <p className="headerLink">Watchlist</p>
                                                        </div>
                                                        <div className="flex justify-center space-x-2 py-4 md:justify-start ">
                                                            <ShoppingCartIcon className="headerLink w-6 cursor-pointer" />{" "}
                                                            <p className="headerLink">Watchlist</p>
                                                        </div>
                                                        <footer>
                                                            <a
                                                                className="absolute right-6 bottom-2 cursor-pointer text-sm outline-none"
                                                                href="https://beau-hawkinson.vercel.app/"
                                                            >
                                                                ©️ bhawkinson
                                                            </a>
                                                        </footer>
                                                    </div>
                                                </div>
                                            </Dialog.Panel>
                                        </Transition.Child>
                                    </div>
                                </div>
                            </div>
                        </Dialog>
                    </Transition.Root>
                </div>
            </nav>
            <hr className="mt-2" />

            <section className="flex flex-col items-center space-y-2 space-x-2 py-5 xs:flex-row xs:space-y-0">
                <div
                    className={`h-20 w-32 flex-shrink-0 cursor-pointer opacity-0 xs:h-16 xs:w-16 sm:w-28 md:w-44 ${
                        mounted && "opacity-100 transition-opacity duration-[4000ms]  ease-in"
                    } `}
                >
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

                <div className="flex flex-1 items-center space-x-2 border-2 border-flatBlack px-2 py-2 md:px-5">
                    <MagnifyingGlassIcon className="w-5 text-skin-accent" />
                    <input
                        className="flex-1 outline-none"
                        type="text"
                        placeholder="Search for anything"
                    />
                </div>

                <button className="hidden border-2 border-transparent bg-skin-button-accent px-5 py-2 text-skin-inverted hover:border-grayBorder hover:bg-skin-button-accent-hover hover:text-skin-muted sm:inline md:px-10">
                    Search
                </button>
                <Link href="/create">
                    <button className="flex border-2 border-grayBorder bg-skin-button-accent-hover px-5 py-2 text-skin-muted hover:bg-skin-fill hover:text-skin-inverted md:px-10">
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
                {/* <p className="link">More</p> */}
                <Dropdown />
            </section>
        </div>
    )
}

export default Header
