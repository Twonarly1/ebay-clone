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

    console.log(bidAmount.toString())

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
        try {
            if (networkMismatch) {
                switchNetwork && switchNetwork(network)
                return
            }
            //Direct
            if (listing?.type === ListingType.Direct) {
                if (listing.buyoutPrice.toString() === utils.parseEther(bidAmount).toString()) {
                    console.log("Buyout Price met, buying NFT...")
                    buyNft()
                    return
                }
                console.log("Buyout price not met, making offer...")
                await makeOffer(
                    {
                        quantity: 1,
                        listingId,
                        pricePerToken: bidAmount,
                    },
                    {
                        onSuccess(data, variables, context) {
                            alert("Offer made successfully")
                            console.log("SUCCESS: ", data, variables, context)
                            setBidAmount("")
                        },
                        onError(error, variables, context) {
                            alert("ERROR: Offer could not be made")
                            console.log("ERROR: ", error, variables, context)
                        },
                    }
                )
            }

            //Auction
            if (listing?.type === ListingType.Auction) {
                console.log("Making Bid...")
                await makeBid(
                    {
                        listingId,
                        bid: bidAmount,
                    },
                    {
                        onSuccess(data, variables, context) {
                            alert("Bid made successfully")
                            console.log("SUCCESS: ", data, variables, context)
                            setBidAmount("")
                        },
                        onError(error, variables, context) {
                            alert("ERROR: Bid could not be made")
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
            <main className="mx-auto flex max-w-6xl flex-col space-y-10 space-x-5 p-2 pr-10 lg:flex-row">
                <div className="mx-auto max-w-md border border-grayBorder p-10 lg:mx-0 lg:max-w-xl">
                    <MediaRenderer src={listing?.asset.image} />
                </div>
                <section className="flex-1 space-y-5 pb-20 lg:pb-0">
                    <div>
                        <h1 className="text-xl font-bold">{listing.asset.name}</h1>
                        <p className="text-skin-accent">{listing.asset.description}</p>
                        <p className="flex items-center text-xs sm:text-skin-base">
                            <UserCircleIcon className="h-5" />
                            <span className="pr-1 font-bold">Seller:</span> {listing.sellerAddress}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 items-center py-2">
                        <p className="font-bold">Listing Type:</p>
                        <p className="font-bold">
                            {listing.type === ListingType.Direct
                                ? "Direct Listing"
                                : "Auction Listing"}
                        </p>
                        <p className="font-bold">Buy it now Price:</p>
                        <p className="text-4xl font-bold">
                            {listing.buyoutCurrencyValuePerToken.displayValue}
                        </p>
                        <p>{listing.buyoutCurrencyValuePerToken.symbol}</p>

                        <button
                            onClick={buyNft}
                            className="col-start-2 mt-2 w-44 rounded-full bg-skin-fill py-4 px-10 font-bold text-flatWhite"
                        >
                            Buy Now
                        </button>
                    </div>

                    {listing.type === ListingType.Direct && offers && (
                        <div className="grid grid-cols-2 gap-y-2">
                            <p className="font-bold">Offers: </p>
                            <p className="font-bold">{offers.length > 0 ? offers.length : 0}</p>
                            {offers.map((offer) => (
                                <>
                                    <p className="ml-5 flex items-center text-sm italic">
                                        {offer.offerer.slice(0, 5) +
                                            "..." +
                                            offer.offeror.slice(-5)}
                                    </p>
                                    <div>
                                        <p
                                            key={
                                                offer.listingId +
                                                offer.offeror +
                                                offer.totalOfferAmount.toString()
                                            }
                                            className="text-sm italic"
                                        >
                                            {ethers.utils.formatEther(offer.totalOfferAmount)}
                                            {NATIVE_TOKENS[network].symbol}
                                        </p>
                                        {listing.sellerAddress === address && (
                                            <button
                                                onClick={() => {
                                                    acceptOffer(
                                                        {
                                                            listingId,
                                                            addressOfOfferor: offer.offeror,
                                                        },
                                                        {
                                                            onSuccess(data, variables, context) {
                                                                alert("Offer accepted successfully")
                                                                console.log(
                                                                    "SUCCESS: ",
                                                                    data,
                                                                    variables,
                                                                    context
                                                                )
                                                                router.replace("/")
                                                            },
                                                            onError(error, variables, context) {
                                                                alert(
                                                                    "ERROR: Offer could not be accepted"
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
                                                className="w-32 cursor-pointer rounded-lg bg-red-500/50 p-2 text-xs font-bold"
                                            >
                                                Accept Offer
                                            </button>
                                        )}
                                    </div>
                                </>
                            ))}
                        </div>
                    )}

                    <div className="grid grid-cols-2 items-center justify-end space-y-2">
                        <hr className="col-span-2" />
                        <p className="col-span-2">
                            {listing.type === ListingType.Direct
                                ? "Make an Offer"
                                : "Bid on this Auction"}
                        </p>
                        {listing.type === ListingType.Auction && (
                            <>
                                <p>Current Minimun Bid:</p>
                                <p className="font-bold">
                                    {minimumNextBid?.displayValue} {minimumNextBid?.symbol}
                                </p>
                                <p>Time Remaining:</p>
                                <Countdown
                                    date={Number(listing.endTimeInEpochSeconds.toString()) * 1000}
                                />
                            </>
                        )}
                        <input
                            className="mr-5 rounded-lg border border-grayBorder p-2"
                            type="text"
                            onChange={(e) => setBidAmount(e.target.value)}
                            placeholder={formatPlaceholder()}
                        />
                        <button
                            onClick={createBidOrOffer}
                            className="w-44 rounded-full bg-skin-fill py-4 px-10 font-bold text-flatWhite"
                        >
                            {listing.type === ListingType.Direct ? "Offer" : "Bid"}
                        </button>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default listingPage
