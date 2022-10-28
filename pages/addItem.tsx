import { Header } from "components"
import React, { FormEvent, useState } from "react"
import { useAddress, useContract } from "@thirdweb-dev/react"
import { useRouter } from "next/router"
import { useStore } from "components/header/Header"
import Image from "next/image"

type Props = {}

const addItem = (props: Props) => {
    const address = useAddress()
    const router = useRouter()
    const { contract } = useContract(process.env.NEXT_PUBLIC_COLLECTION_CONTRACT, "nft-collection")
    const [preview, setPreview] = useState<string>()
    const [image, setImage] = useState<File>()
    const themeWhatever = useStore().themeName //update theme using zustand

    const mintNft = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!contract || !address) return

        if (!image) {
            alert("Please select and image")
            return
        }

        const target = e.target as typeof e.target & {
            name: { value: string }
            description: { value: string }
        }
        const metadata = {
            name: target.name.value,
            description: target.description.value,
            image: image,
        }

        try {
            const tx = await contract.mintTo(address, metadata)
            const receipt = tx.receipt
            const tokenId = tx.id
            const nft = await tx.data()

            console.log(receipt, tokenId, nft)
            router.push("/create")
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className={` -z-50 ${themeWhatever === "root" ? "" : themeWhatever}`}>
            <img
                src="/bkg-lines.svg"
                className=" absolute top-0 -z-40  min-h-screen w-full bg-bkg opacity-30 md:flex"
                alt=""
            />
            <Header />
            <main className="mx-auto max-w-6xl border p-10">
                <h1 className="text-4xl font-bold opacity-50">Add an Item to the Marketplace</h1>
                <h2 className="pt-5 text-xl font-semibold text-skin-accent">Item Details</h2>
                <p className="pb-5 text-skin-accent">
                    By adding an item to the marketplace, you're essentially Minting an NFT of the
                    item into your wallet which we can then list for sale!
                </p>
                <div className="relative flex flex-col items-center justify-center pt-5 md:flex-row md:space-x-5">
                    <Image
                        className="h-80 w-80 shrink-0 border bg-black object-contain"
                        alt="Thirdweb Logo"
                        src={preview || "https://links.papareact.com/ucj"}
                        width={100}
                        height={100}
                    />
                    <form
                        onSubmit={mintNft}
                        action=""
                        className="mt-6 flex flex-1 flex-col justify-center space-y-2 md:mt-0"
                    >
                        <label className=" text-left font-light" htmlFor="">
                            Name of Item
                        </label>
                        <input
                            className="formField"
                            type="text"
                            placeholder="Name of item..."
                            name="name"
                            id="name"
                        />
                        <label className=" text-left font-light" htmlFor="">
                            Description
                        </label>
                        <input
                            className="formField"
                            type="text"
                            placeholder="Enter Description..."
                            name="description"
                            id="description"
                        />
                        <label className=" text-left font-light" htmlFor="">
                            Image of the Item
                        </label>
                        <input
                            className="  w-full"
                            type="file"
                            onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    setPreview(URL.createObjectURL(e.target.files[0]))
                                    setImage(e.target.files[0])
                                }
                            }}
                        />
                        <button
                            type="submit"
                            className="bottom-0 right-2 w-full  justify-center rounded bg-skin-fill py-2 px-10 font-semibold text-skin-inverted md:absolute  md:mt-auto md:w-56 md:justify-end"
                        >
                            Add / Mint Item
                        </button>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default addItem
