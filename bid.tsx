require("dotenv").config();
const bs58 = require("bs58").default;
const nodeFetch = require("node-fetch");
const {
    Connection,
    Keypair,
    VersionedTransaction,
} = require("@solana/web3.js");

const bearerToken = process.env.API_KEY;
const base58EncodedSecretKey = process.env.SENDER_PRIVATE_KEY;

if (!bearerToken || !base58EncodedSecretKey) {
    throw new Error("API_KEY or SENDER_PRIVATE_KEY is missing in environment variables");
}

const secretKeyUint8Array = bs58.decode(base58EncodedSecretKey);
const senderKeypair = Keypair.fromSecretKey(secretKeyUint8Array);
const connection = new Connection(process.env.RPC_URL || "https://api.mainnet-beta.solana.com", "confirmed");

/**
 * Fetches serialized transaction data from the given endpoint.
 * @param {string} endpoint - The API endpoint URL.
 * @returns {Promise<Object>} The transaction data.
 */
async function fetchTxData(endpoint: string) {
    const response = await nodeFetch(endpoint, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${bearerToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch transaction data: ${response.statusText}`);
    }

    return await response.json();
}

interface BidParams {
    spotPrice: number;
    curveType: string;
    curveDelta: number;
    reinvestBuy: boolean;
    reinvestSell: boolean;
    expiry: number;
    lpFeeBp: number;
    buysideCreatorRoyaltyBp: number;
    paymentMint: string;
    collectionSymbol: string;
    owner: string;
    sharedEscrowCount: number;
}

/**
 * Place a collection bid with your escrow account on Magic Eden.
 * @param {BidParams} params - The transaction parameters.
 */
const sendCollectionBidTx = async ({
    spotPrice,
    curveType,
    curveDelta,
    reinvestBuy,
    reinvestSell,
    expiry,
    lpFeeBp,
    buysideCreatorRoyaltyBp,
    paymentMint,
    collectionSymbol,
    owner,
    sharedEscrowCount,
}: BidParams) => {
    try {
        const baseUrl =
            "https://api-mainnet.magiceden.dev/v2/instructions/mmm/create-pool";
        const endpointUrl = `${baseUrl}?spotPrice=${spotPrice}&curveType=${curveType}&curveDelta=${curveDelta}&reinvestBuy=${reinvestBuy}&reinvestSell=${reinvestSell}&expiry=${expiry}&lpFeeBp=${lpFeeBp}&buysideCreatorRoyaltyBp=${buysideCreatorRoyaltyBp}&paymentMint=${paymentMint}&collectionSymbol=${collectionSymbol}&owner=${owner}&sharedEscrowCount=${sharedEscrowCount}`;

        const txData = await fetchTxData(endpointUrl);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const serializedTxData = new Uint8Array((txData as any).txSigned.data);
        const tx = VersionedTransaction.deserialize(serializedTxData);
        tx.sign([senderKeypair]);

        const txId = await connection.sendTransaction(tx);
        await connection.confirmTransaction({
            signature: txId,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            blockhash: (txData as any).blockhashData.blockhash,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            lastValidBlockHeight: (txData as any).blockhashData.lastValidBlockHeight,
        });

        console.log(`Transaction sent. Signature: ${txId}`);
    } catch (error: any) {
        console.error(`Error sending bid transaction: ${error.message}`);
    }
};

// Example usage:
sendCollectionBidTx({
    spotPrice: 1000000,
    curveType: "exp",
    curveDelta: 0,
    reinvestBuy: false,
    reinvestSell: false,
    expiry: 1714689180,
    lpFeeBp: 0,
    buysideCreatorRoyaltyBp: 500,
    paymentMint: "11111111111111111111111111111111",
    collectionSymbol: "magicticket",
    owner: senderKeypair.publicKey.toBase58(),
    sharedEscrowCount: 3,
});
