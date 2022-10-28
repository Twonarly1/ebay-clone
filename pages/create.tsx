import { Header } from "components"
import React, { FormEvent, useEffect, useState } from "react"
import {
    useAddress,
    useContract,
    MediaRenderer,
    useNetwork,
    useNetworkMismatch,
    useOwnedNFTs,
    useCreateAuctionListing,
    useCreateDirectListing,
} from "@thirdweb-dev/react"
import { NFT, NATIVE_TOKENS, NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk"
import network from "lib/thirdweb/network"
import { useRouter } from "next/router"
import { useStore } from "components/header/Header"

type Props = {}

const Create = (props: Props) => {
    // const [themeWhatever, setThemeWhatever] = useState<any>("")
    const address = useAddress()
    const router = useRouter()
    const themeWhatever = useStore().themeName //update theme using zustand
    console.log(address)

    const { contract } = useContract(process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT, "marketplace")
    const [selectedNft, setSelectedNft] = useState<NFT>()

    const { contract: collectionContract } = useContract(
        process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
        "nft-collection"
    )
    const ownedNFTs = useOwnedNFTs(collectionContract, address)

    const networkMismatch = useNetworkMismatch()
    const [, switchNetwork] = useNetwork()

    const { mutate: createDirectListing, isLoading, error } = useCreateDirectListing(contract)
    const {
        mutate: createAuctionListing,
        isLoading: isLoadingAuction,
        error: errorAuction,
    } = useCreateAuctionListing(contract)

    const handleCreateListing = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (networkMismatch) {
            switchNetwork && switchNetwork(network)
            return
        }
        if (!selectedNft) return

        const target = e.target as typeof e.target & {
            elements: { listingType: { value: string }; price: { value: string } }
        }

        const { listingType, price } = target.elements

        if (listingType.value === "directListing") {
            createDirectListing(
                {
                    assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
                    tokenId: selectedNft.metadata.id,
                    currencyContractAddress: NATIVE_TOKEN_ADDRESS,
                    listingDurationInSeconds: 60 * 60 * 24 * 7, //week
                    quantity: 1,
                    buyoutPricePerToken: price.value,
                    startTimestamp: new Date(),
                },
                {
                    onSuccess(data, variables, context) {
                        console.log("SUCCESS: ", data, variables, context)
                        router.push("/")
                    },
                    onError(error, variables, context) {
                        console.log("ERROR", error, variables, context)
                    },
                }
            )
        }
        if (listingType.value === "auctionListing") {
            createAuctionListing(
                {
                    assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
                    buyoutPricePerToken: price.value,
                    tokenId: selectedNft.metadata.id,
                    startTimestamp: new Date(),
                    currencyContractAddress: NATIVE_TOKEN_ADDRESS,
                    listingDurationInSeconds: 60 * 60 * 24 * 7, //week
                    quantity: 1,
                    reservePricePerToken: 0,
                },
                {
                    onSuccess(data, variables, context) {
                        console.log("SUCCESS: ", data, variables, context)
                        router.push("/")
                    },
                    onError(error, variables, context) {
                        console.log("ERROR", error, variables, context)
                    },
                }
            )
        }
    }

    return (
        <div className={` ${themeWhatever} -z-50`}>
            <img
                src="/bkg-lines.svg"
                className="bg:bg-repeat-y absolute top-0 -z-40 min-h-screen w-full bg-bkg opacity-30 md:flex"
                alt=""
            />
            <Header />

            <main className="mx-auto max-w-6xl p-10 pt-2">
                <h1 className="text-4xl font-bold">List an Item</h1>
                <h2 className="pt-5 text-xl font-semibold">
                    Select an Item you would like to Sell
                </h2>

                <hr className="mb-5" />

                <p>Below you will find the NFT's you own in your wallet</p>
                <div className="flex space-x-2 overflow-x-scroll p-4">
                    {ownedNFTs?.data?.map((nft) => (
                        <div
                            onClick={() => setSelectedNft(nft)}
                            className={`card relative flex min-w-fit flex-col space-y-2 border-2 transition-all duration-150 ease-out  hover:scale-105  ${
                                nft.metadata.id === selectedNft?.metadata.id
                                    ? "bg-bkg"
                                    : "border-transparent"
                            }`}
                            key={nft.metadata.id}
                        >
                            <div className="absolute inset-0 rounded bg-gradient-to-br from-skin-hue/30 via-skin-hue/10 to-transparent opacity-50"></div>
                            <div className="flex flex-1 flex-col items-center pb-2">
                                <MediaRenderer
                                    className="h-48 rounded-lg"
                                    src={nft.metadata.image}
                                />
                            </div>
                            <p className="truncate text-lg font-bold">{nft.metadata.name}</p>
                            <p className="truncate text-xs">{nft.metadata.description}</p>
                        </div>
                    ))}
                </div>
                {selectedNft && (
                    <form onSubmit={handleCreateListing}>
                        <div className="mt-10 flex flex-col md:p-10  ">
                            <div className="grid grid-cols-2 items-center gap-5">
                                <label className="border-r font-light">
                                    Direct Listing / Fixed Price
                                </label>
                                <input
                                    type="radio"
                                    name="listingType"
                                    value="directListing"
                                    className="form-radio ml-auto h-10 w-10 text-skin-muted checked:bg-skin-fill focus:ring-transparent"
                                />
                                <label className="border-r font-light">Auction</label>
                                <input
                                    type="radio"
                                    name="listingType"
                                    value="auctionListing"
                                    className="form-radio ml-auto h-10 w-10 text-skin-muted  checked:bg-skin-fill focus:ring-transparent "
                                />

                                <label className="border-r font-light">Price</label>
                                <input
                                    type="text"
                                    name="price"
                                    placeholder="0.05"
                                    className="border border-grayBorder bg-skin-button-accent-hover p-5 focus:border-transparent focus:ring-grayBorder"
                                />
                            </div>
                            <button
                                type="submit"
                                className="mt-8 rounded-lg bg-skin-fill p-4 text-skin-inverted"
                            >
                                Create Listing
                            </button>
                        </div>
                    </form>
                )}
            </main>
        </div>
    )
}

export default Create
