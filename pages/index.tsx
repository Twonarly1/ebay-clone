import { Header } from "components"
import type { NextPage } from "next"
import { useActiveListings, useContract, MediaRenderer } from "@thirdweb-dev/react"
import { ListingType } from "@thirdweb-dev/sdk"
import { BanknotesIcon, ClockIcon } from "@heroicons/react/24/outline"
import { useState } from "react"

const Home: NextPage = () => {
    const { contract } = useContract(process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT, "marketplace")
    const { data: listings, isLoading: loadingListings } = useActiveListings(contract)
    const [themeWhatever, setThemeWhatever] = useState<any>("")

    return (
        <div className={`bg-bkg ${themeWhatever === "root" ? "" : themeWhatever}`}>
            <Header setThemeWhatever={setThemeWhatever} />

            <main className="max-w-6xl mx-auto py-4 px-6">
                {loadingListings ? (
                    <p className="text-center animate-pulse text-skin-muted">Loading listings...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mx-auto">
                        {listings?.map((listing) => (
                            <div
                                key={listing.id}
                                className="flex flex-col relative card hover:scale-105 odd:hover:-skew-x-1 hover:skew-x-1 transition-all duration-150 ease-out"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-skin-hue/30 via-skin-hue/10 to-transparent opacity-50"></div>

                                <div className="flex-1 flex flex-col pb-2 items-center">
                                    <MediaRenderer
                                        className="z-10 w-44"
                                        src={listing.asset.image}
                                    />
                                </div>
                                <div className="pt-2 space-y-4">
                                    <div>
                                        <h2 className="text-lg truncate">{listing.asset.name}</h2>
                                        <hr />
                                        <p className="truncate text-sm text-skin-accent mt-2">
                                            {listing.asset.description}
                                        </p>
                                    </div>
                                    <p>
                                        <span className="font-bold mr-1">
                                            {/* added a 5 cuz I messed up! */}
                                            {listing.buyoutCurrencyValuePerToken.displayValue}5
                                        </span>
                                        {listing.buyoutCurrencyValuePerToken.symbol}
                                    </p>
                                    <div
                                        className={`flex items-center space-x-1 justify-end text-xs border rounded-lg text-skin-base w-fit ml-auto p-2 ${
                                            listing.type === ListingType.Direct
                                                ? "bg-skin-fill text-skin-inverted"
                                                : "bg-skin-button-accent-hover text-skin-accent border-flatBlack"
                                        } `}
                                    >
                                        <p>
                                            {listing.type === ListingType.Direct
                                                ? "Buy Now"
                                                : "Auction"}
                                        </p>
                                        {listing.type === ListingType.Direct ? (
                                            <BanknotesIcon className="h-4" />
                                        ) : (
                                            <ClockIcon className="h-4" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

export default Home
