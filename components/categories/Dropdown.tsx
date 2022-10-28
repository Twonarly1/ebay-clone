import { Fragment } from "react"
import { Menu, Transition } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/24/outline"

export default function Dropdown() {
    return (
        <Menu as="div" className="relative z-20 inline-block text-left">
            <div>
                <Menu.Button className="flex cursor-pointer  items-center text-skin-accent xl:hidden">
                    <span className="sr-only">Open options</span>
                    <p className="hover:underline-none">More</p>
                    <ChevronDownIcon className="ml-1 w-3" aria-hidden="true" />
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none xl:hidden">
                    <div className="">
                        <Menu.Item>
                            <a href="#" className="categoryItem sm:hidden">
                                Video Games
                            </a>
                        </Menu.Item>
                        <Menu.Item>
                            <a href="#" className="categoryItem sm:hidden">
                                Home & Garden
                            </a>
                        </Menu.Item>
                        <Menu.Item>
                            <a href="#" className="categoryItem md:hidden">
                                Health & Beauty
                            </a>
                        </Menu.Item>
                        <Menu.Item>
                            <a href="#" className="categoryItem lg:hidden">
                                Collectibles and Art
                            </a>
                        </Menu.Item>
                        <Menu.Item>
                            <a href="#" className="categoryItem lg:hidden">
                                Books
                            </a>
                        </Menu.Item>
                        <Menu.Item>
                            <a href="#" className="categoryItem lg:hidden">
                                Music
                            </a>
                        </Menu.Item>
                        <Menu.Item>
                            <a href="#" className="categoryItem xl:hidden">
                                Deals
                            </a>
                        </Menu.Item>
                        <Menu.Item>
                            <a href="#" className="categoryItem xl:hidden">
                                Other
                            </a>
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
