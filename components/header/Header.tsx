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
import create from "zustand"
import { devtools, persist } from "zustand/middleware"
import shallow from "zustand/shallow"

type Props = {
    // setThemeWhatever?: any
}

type MyTheme = {
    themeName: string
}

type Action = {
    updateThemeName: (themeName: MyTheme["themeName"]) => void
}

//persisten issues
export const useStore = create<MyTheme & Action>()(
    devtools(
        persist((set) => ({
            themeName: "",
            updateThemeName: (themeName) => set((state) => ({ themeName: themeName })),
        }))
    )
)

const Header = ({}: Props) => {
    const connectWithMetamask = useMetamask()
    const disconnect = useDisconnect()
    const address = useAddress()
    const [mounted, setMounted] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)

    const [updateThemeName] = useStore((state) => [state.updateThemeName], shallow) //update theme using zustand

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <div className=" mx-auto max-w-6xl bg-flatWhite p-2 text-skin-accent">
            <nav className="flex justify-between">
                <div className="flex items-center space-x-2 text-sm md:space-x-4">
                    {address ? (
                        <button
                            onClick={disconnect}
                            className="connectWalletBtn hover:border-grayBorder"
                        >
                            {address.slice(0, 4) + "..." + address.slice(-4)}
                        </button>
                    ) : (
                        <button
                            onClick={connectWithMetamask}
                            className="connectWalletBtn flex hover:border-grayBorder"
                        >
                            Connect <span className="ml-1 hidden md:flex">my wallet</span>
                        </button>
                    )}
                    <p className="headerLink flex text-xs hover:text-flatBlack md:text-sm">
                        <span className="mr-1 hidden md:flex">Daily</span> Deals
                    </p>
                    <p className="headerLink flex text-xs hover:text-flatBlack md:text-sm">
                        Help<span className="ml-1 hidden md:flex">& Contact</span>
                    </p>
                    <Link href="/addItem" className=" hover:text-flatBlack">
                        <PlusIcon className="hidden w-4 cursor-default hover:scale-110 xs:flex md:w-5" />
                    </Link>
                </div>

                <div className="flex items-center space-x-2 text-sm">
                    <div className="mt-1 items-center space-x-1">
                        <button
                            className="animate-blob"
                            onClick={() => updateThemeName("theme-ebay-red")}
                        >
                            <div className="h-4 w-4 rounded-full bg-ebay-red md:h-5 md:w-5" />
                        </button>
                        <button
                            className="animation-delay-2000 animate-blob"
                            onClick={() => updateThemeName("root")}
                        >
                            <div className="h-4 w-4 rounded-full bg-ebay-blue md:h-5 md:w-5" />
                        </button>
                        <button
                            className="animation-delay-4000 animate-blob"
                            onClick={() => updateThemeName("theme-ebay-yellow")}
                        >
                            <div className="h-4 w-4 rounded-full bg-ebay-yellow md:h-5 md:w-5" />
                        </button>
                        <button
                            className="animation-delay-6000 animate-blob"
                            onClick={() => updateThemeName("theme-ebay-green")}
                        >
                            <div className="h-4 w-4 rounded-full bg-ebay-green md:h-5 md:w-5" />
                        </button>
                    </div>

                    <div className="links cursor-pointer">
                        <Bars3Icon
                            onClick={() => setOpen(true)}
                            className="h-8 w-8 rounded border border-grayBorder p-1 font-medium text-skin-accent hover:text-flatBlack "
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
                                                        <Dialog.Title className="py-2 px-6 text-3xl font-semibold focus:outline-none">
                                                            <Link
                                                                href="/"
                                                                className="focus:outline-none"
                                                            >
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
                                                                className=" rounded-md text-skin-accent focus:outline-none hover:text-flatBlack"
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
                                                    <div className="flex flex-col divide-y px-3 text-left text-skin-accent">
                                                        <div className="flex justify-center space-x-2 py-4 hover:text-flatBlack md:justify-start ">
                                                            <TruckIcon className="w-6" />
                                                            <p className="headerLink">Ship to</p>
                                                        </div>
                                                        <div className="flex justify-center space-x-2 py-4 hover:text-flatBlack md:justify-start ">
                                                            <TagIcon className="w-6" />
                                                            <p className="headerLink">Sell</p>
                                                        </div>
                                                        <div className="flex justify-center space-x-2 py-4 hover:text-flatBlack md:justify-start ">
                                                            <BookmarkIcon className="w-6" />
                                                            <p className="headerLink">Watchlist</p>
                                                        </div>
                                                        <Link
                                                            href="/addItem"
                                                            className="headerLink flex cursor-default items-center justify-center space-x-2  py-4 hover:text-flatBlack  md:justify-start"
                                                        >
                                                            <PlusIcon className="w-6 " />
                                                            <p>Add Inventory</p>
                                                            {/* <ChevronDownIcon className="h-4" /> */}
                                                        </Link>
                                                        <div className="flex justify-center space-x-2 py-4 hover:text-flatBlack md:justify-start ">
                                                            <BellIcon className="headerLink w-6 " />{" "}
                                                            <p className="headerLink">Reminders</p>
                                                        </div>
                                                        <div className="flex justify-center space-x-2 py-4 hover:text-flatBlack md:justify-start ">
                                                            <ShoppingCartIcon className="headerLink w-6 " />{" "}
                                                            <p className="headerLink">My Cart</p>
                                                        </div>
                                                    </div>
                                                    <footer className=" absolute bottom-2 z-20 mx-auto flex w-full cursor-pointer items-center justify-center space-x-3 py-4 text-sm text-skin-accent">
                                                        <a href="https://beau-hawkinson.vercel.app/">
                                                            ©️ bhawkinson
                                                        </a>
                                                        <a
                                                            href="https://twitter.com/twonarly"
                                                            className=""
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 512 512"
                                                                className="z-20 w-4"
                                                            >
                                                                <path
                                                                    fill="currentColor"
                                                                    d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
                                                                />
                                                            </svg>
                                                        </a>

                                                        <a
                                                            href="https://github.com/Twonarly1"
                                                            className=""
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 496 512"
                                                                className=" z-20 w-4"
                                                            >
                                                                <path
                                                                    fill="currentColor"
                                                                    d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
                                                                />
                                                            </svg>
                                                        </a>
                                                    </footer>
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

            <section className="flex flex-col items-center space-y-2 space-x-2 px-2 py-5 xs:flex-row xs:space-y-0">
                <div
                    className={`h-20 w-32  flex-shrink-0 cursor-pointer opacity-0 xs:h-16 xs:w-16 sm:w-28 md:w-44 ${
                        mounted && "opacity-100 transition-opacity duration-[4000ms]  ease-in"
                    } `}
                >
                    <Link href="/">
                        <Image
                            className="h-full w-full  shrink-0 object-contain"
                            alt="Thirdweb Logo"
                            src="https://links.papareact.com/bdb"
                            width={100}
                            height={100}
                        />
                    </Link>
                </div>
                {/* 
                <button className="hidden w-20 items-center space-x-2 lg:flex">
                    <p className="text-xs text-skin-accent">Shop by Category</p>
                    <ChevronDownIcon className="h-4 flex-shrink-0" />
                </button> */}

                <div className="flex flex-1 items-center space-x-2 border-2 border-grayBorder py-[3px] px-5 md:py-[1px] ">
                    <MagnifyingGlassIcon className="w-5 text-skin-muted" />
                    <input
                        className="flex-1 border-transparent text-xs  focus:border-transparent focus:ring-transparent md:text-sm"
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

            <section className="mt-2 flex justify-center space-x-6 whitespace-nowrap py-1 px-6 text-sm">
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
