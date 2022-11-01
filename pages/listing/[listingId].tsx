import { UserCircleIcon } from "@heroicons/react/24/outline"
import {
    MediaRenderer,
    useContract,
    useListing,
    useAddress,
    useMakeBid,
    useMakeOffer,
    useOffers,
    useBuyNow,
    useNetwork,
    useNetworkMismatch,
    useAcceptDirectListingOffer,
} from "@thirdweb-dev/react"
import { ListingType, NATIVE_TOKENS } from "@thirdweb-dev/sdk"
import { Header } from "components"
import { useStore } from "components/header/Header"
import { ethers } from "ethers"
import { utils } from "ethers/lib/ethers"
import network from "lib/thirdweb/network"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import Countdown from "react-countdown"
import toast from "react-hot-toast"

function listingPage() {
    const themeWhatever = useStore().themeName
    const router = useRouter()
    const address = useAddress()
    const { listingId } = router.query as { listingId: string }
    const [bidAmount, setBidAmount] = useState("")
    const [, switchNetwork] = useNetwork()
    const networkMismatch = useNetworkMismatch()
    const [minimumNextBid, setMinimumNextBid] = useState<{
        displayValue: string
        symbol: string
    }>()
    const { contract } = useContract(process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT, "marketplace")
    const { mutate: makeBid } = useMakeBid(contract)
    const { data: offers } = useOffers(contract, listingId)
    const { mutate: makeOffer } = useMakeOffer(contract)
    const { mutate: buyNow } = useBuyNow(contract)
    const { data: listing, isLoading, error } = useListing(contract, listingId)
    const { mutate: acceptOffer } = useAcceptDirectListingOffer(contract)

    useEffect(() => {
        if (!listingId || !contract || !listing) return
        if (listing?.type === ListingType.Auction) {
            fetchMinNextBid()
        }
    }, [listingId, contract, listing])

    const fetchMinNextBid = async () => {
        if (!listing || !contract) return
        const { displayValue, symbol } = await contract.auction.getMinimumNextBid(listingId)
        setMinimumNextBid({
            displayValue: displayValue,
            symbol: symbol,
        })
    }

    const formatPlaceholder = () => {
        if (!listing) return
        if (listing.type === ListingType.Direct) {
            return "Enter Offer Amount"
        }
        if (listing.type === ListingType.Auction) {
            return Number(minimumNextBid?.displayValue) === 0
                ? "Enter Bid Amount"
                : `${minimumNextBid?.displayValue} ${minimumNextBid?.symbol} or more`
        }
        // improve bid amt
    }

    const buyNft = async () => {
        if (!address) {
            toast.error("Connect your wallet!")
            return
        }
        const notification = toast.loading("Buying NFT...")

        if (networkMismatch) {
            switchNetwork && switchNetwork(network)
            return
        }
        if (!listing || !contract || !listingId) return

        await buyNow(
            {
                id: listingId,
                buyAmount: 1,
                type: listing.type,
            },
            {
                onSuccess(data, variables, context) {
                    toast.success("NFT bought successfully!", {
                        id: notification,
                    })
                    console.log("SUCCESS: ", data, variables, context)
                    router.replace("/")
                },
                onError(error, variables, context) {
                    toast.error("Whoops something went wrong!", {
                        id: notification,
                    })
                    console.log("ERROR: ", error, variables, context)
                },
            }
        )
    }

    const createBidOrOffer = async () => {
        if (!address) {
            toast.error("Connect your wallet!")
            return
        }
        const notification = toast.loading("Placing Bid... ")
        try {
            if (networkMismatch) {
                switchNetwork && switchNetwork(network)
                return
            }
            //Direct
            if (listing?.type === ListingType.Direct) {
                if (listing.buyoutPrice.toString() === utils.parseEther(bidAmount).toString()) {
                    toast.loading("Buyout Price met, buying NFT...!", {
                        id: notification,
                    })
                    console.log("Buyout Price met, buying NFT...")
                    buyNft()
                    return
                }
                toast.loading("Buyout price not met, making offer...!", {
                    id: notification,
                })
                console.log("Buyout price not met, making offer...")
                await makeOffer(
                    {
                        quantity: 1,
                        listingId,
                        pricePerToken: bidAmount,
                    },
                    {
                        onSuccess(data, variables, context) {
                            toast.success("Offer made successfully!", {
                                id: notification,
                            })
                            console.log("SUCCESS: ", data, variables, context)
                            setBidAmount("")
                        },
                        onError(error, variables, context) {
                            toast.error("Whoops something went wrong!", {
                                id: notification,
                            })
                            console.log("ERROR: ", error, variables, context)
                        },
                    }
                )
            }

            //Auction
            if (listing?.type === ListingType.Auction) {
                console.log("Placing Bid...")
                await makeBid(
                    {
                        listingId,
                        bid: bidAmount,
                    },
                    {
                        onSuccess(data, variables, context) {
                            toast.success("Bid made successfully", {
                                id: notification,
                            })
                            console.log("SUCCESS: ", data, variables, context)
                            setBidAmount("")
                        },
                        onError(error, variables, context) {
                            toast.error("Whoops something went wrong!", {
                                id: notification,
                            })
                            console.log("ERROR: ", error, variables, context)
                        },
                    }
                )
            }
        } catch (error) {
            console.error(error)
        }
    }

    if (isLoading)
        return (
            <div>
                <Header />
                <div className="animate-pulse text-center text-skin-accent">
                    <p>Loading Item...</p>
                </div>
            </div>
        )

    if (!listing) {
        return <div>Listing not found</div>
    }
    return (
        <div className={`-z-50 ${themeWhatever === "root" ? "" : themeWhatever}`}>
            <Header />
            <main className="mx-auto flex max-w-6xl flex-col space-y-10  p-4 md:p-2 md:pr-10 lg:flex-row">
                <div className="mx-auto max-w-md p-6  md:p-10 lg:mx-0 lg:max-w-xl">
                    <div className=" border border-grayBorder bg-flatWhite p-4 ">
                        <MediaRenderer src={listing?.asset.image} />
                    </div>
                </div>
                <section className="flex-1 space-y-5 pb-20 lg:pb-0">
                    <div className=" -mt-6 text-center lg:mt-0 lg:text-left">
                        <h1 className="text-xl font-bold text-skin-accent opacity-50 md:text-4xl">
                            {listing.asset.name}
                        </h1>
                        <p className="text-sm font-semibold text-skin-accent md:text-lg">
                            {listing.asset.description}
                        </p>
                        <p className="flex items-center justify-center pb-5 text-xs text-skin-accent md:text-sm lg:justify-start">
                            {/* <UserCircleIcon className="h-5" /> */}
                            <span className="pr-1 text-skin-accent">owner:</span>{" "}
                            {listing.sellerAddress.slice(0, 5) +
                                "..." +
                                listing.sellerAddress.slice(-5)}
                        </p>
                    </div>
                    <div className="flex max-w-xl flex-col space-y-5 md:mx-auto">
                        <div className="flex flex-col items-center justify-center py-2 sm:flex-row sm:justify-between  md:space-x-10">
                            <div className="text-center sm:pl-20 sm:text-left lg:pl-0 ">
                                <p className="text-sm font-bold text-skin-accent md:text-lg">
                                    {listing.type === ListingType.Direct
                                        ? "Direct Listing"
                                        : "Auction Listing"}
                                </p>
                                <div className="flex space-x-2 text-2xl font-bold text-skin-accent">
                                    <p>{listing.buyoutCurrencyValuePerToken.displayValue} </p>
                                    <p>{listing.buyoutCurrencyValuePerToken.symbol}</p>
                                </div>
                            </div>
                            <button
                                onClick={buyNft}
                                className="mt-2 w-32 rounded border-2 border-grayBorder bg-skin-button-accent-hover py-2 px-4 font-bold text-skin-muted hover:bg-skin-fill hover:text-skin-inverted md:mr-20 md:w-44 md:justify-end md:px-10"
                            >
                                Buy Now
                            </button>
                        </div>
                        <div className="flex flex-col items-center justify-center py-2 sm:flex-row sm:justify-between md:space-x-10">
                            <div className="sm:pl-20 lg:pl-0">
                                <p className="text-center text-sm font-bold text-skin-accent sm:text-left md:text-left md:text-lg">
                                    {listing.type === ListingType.Direct
                                        ? "Make an Offer"
                                        : "Bid on this Auction"}
                                </p>
                                <div>
                                    {listing.type === ListingType.Auction && (
                                        <div className="text-center sm:text-left ">
                                            <p className="text-2xl font-bold text-skin-accent">
                                                {minimumNextBid?.displayValue}{" "}
                                                {minimumNextBid?.symbol}
                                            </p>
                                            <Countdown
                                                date={
                                                    Number(
                                                        listing.endTimeInEpochSeconds.toString()
                                                    ) * 1000
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                                <input
                                    className="mx-auto mt-2 rounded-lg border border-grayBorder bg-white p-2 focus:border-transparent focus:ring-grayBorder "
                                    type="text"
                                    onChange={(e) => setBidAmount(e.target.value)}
                                    placeholder={formatPlaceholder()}
                                />
                            </div>
                            <button
                                onClick={createBidOrOffer}
                                className="mt-4 w-32 rounded border-2 border-grayBorder bg-skin-button-accent-hover py-2 px-4 font-bold text-skin-muted hover:bg-skin-fill hover:text-skin-inverted md:mr-20 md:w-44 md:px-10"
                            >
                                {listing.type === ListingType.Direct ? "Offer" : "Bid"}
                            </button>
                        </div>
                    </div>

                    {listing.type === ListingType.Direct && offers && (
                        <div className="mx-auto flex flex-col justify-center gap-y-2 py-2  pt-5">
                            <div className="text-center text-sm font-bold text-skin-accent md:text-lg">
                                {offers.length > 0 ? (
                                    <p className="">{offers.length} Offers</p>
                                ) : (
                                    <p className="">No offers</p>
                                )}
                            </div>
                            {offers.map((offer) => (
                                <div className="mx-auto flex w-full justify-center space-x-10 xs:px-10 lg:space-x-16">
                                    <div className="flex flex-col items-center md:flex-row md:space-x-3">
                                        <p className="items-center text-sm italic text-skin-accent">
                                            {offer.offeror.slice(0, 5) +
                                                "..." +
                                                offer.offeror.slice(-5)}
                                        </p>
                                        <div
                                            key={
                                                offer.listingId +
                                                offer.offeror +
                                                offer.totalOfferAmount.toString()
                                            }
                                            className="flex items-center space-x-2 text-sm font-semibold text-skin-accent md:text-lg"
                                        >
                                            <p>
                                                {ethers.utils.formatEther(offer.totalOfferAmount)}
                                            </p>
                                            <p> {NATIVE_TOKENS[network].symbol}</p>
                                        </div>
                                    </div>

                                    {listing.sellerAddress === address && (
                                        <button
                                            className="w-fit cursor-pointer items-center self-center rounded border-2 border-grayBorder bg-skin-button-accent-hover py-2 px-4 text-xs font-bold text-skin-muted hover:bg-skin-fill hover:text-skin-inverted md:h-10 md:py-0 md:text-sm"
                                            onClick={() => {
                                                if (!address) {
                                                    toast.error("Connect your wallet!")
                                                    return
                                                }
                                                const notification =
                                                    toast.loading("Placing Offer... ")
                                                acceptOffer(
                                                    {
                                                        listingId,
                                                        addressOfOfferor: offer.offeror,
                                                    },
                                                    {
                                                        onSuccess(data, variables, context) {
                                                            toast.success(
                                                                "Offer accepted successfully",
                                                                {
                                                                    id: notification,
                                                                }
                                                            )
                                                            console.log(
                                                                "SUCCESS: ",
                                                                data,
                                                                variables,
                                                                context
                                                            )
                                                            router.replace("/")
                                                        },
                                                        onError(error, variables, context) {
                                                            toast.error(
                                                                "Whoops something went wrong!",
                                                                {
                                                                    id: notification,
                                                                }
                                                            )

                                                            console.log(
                                                                "ERROR: ",
                                                                error,
                                                                variables,
                                                                context
                                                            )
                                                        },
                                                    }
                                                )
                                            }}
                                        >
                                            Accept
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}

export default listingPage
