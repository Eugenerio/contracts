import { Address, Builder, Cell, Dictionary, Slice, beginCell, fromNano, toNano } from "ton-core";
import { NftCollection, storeRequestNftDeploy } from "./output/nft_NftCollection";
import { createOffchainContent } from "./helpers";
import { readFileSync } from "fs";
import { mnemonicToWalletKey } from "ton-crypto";
import { TonClient4, WalletContractV3R2, WalletContractV4 } from "ton";
import { buffer } from "stream/consumers";

(async () => {
    createNftDeployLink(
        Address.parse("EQAF4ilq66WK4zIeLPLiFwV5hv1a0-l-wGK12v0qvZbVREwo"), //nft collection
        Address.parse("0QA9PfOXSKS_r5A24KTXPvJiRkvKJ_ZY9TQbCjmXGku4mi7V"), // owner
        toNano("0.06"),
        "https://raw.githubusercontent.com/Eugenerio/ton-test/main/nft_data.json?token=GHSAT0AAAAAACSJOY4C5KBS6UU4KK7CASPWZTFJXTA",
        0n
    );
    // let mnemonics = readFileSync("./secret.txt").toString().split(",");
    // let pair = await mnemonicToWalletKey(mnemonics);
    // let client4 = new TonClient4({ endpoint: "https://sandbox-v4.tonhubapi.com" });
    // let wallet = client4.open(WalletContractV4.create({ workchain: 0, publicKey: pair.publicKey }));
    // let collection = client4.open(
    //     NftCollection.fromAddress(Address.parse("QAF4ilq66WK4zIeLPLiFwV5hv1a0-l-wGK12v0qvZbVREwo"))
    // );
    // await collection.send(
    //     wallet.sender(pair.secretKey),
    //     { value: toNano("0.08") },
    //     {
    //         $$type: "RequestNftDeploy",
    //         index: 1n,
    //         amount: toNano("0.03"),
    //         content: createOffchainContent(
    //             "https://raw.githubusercontent.com/Eugenerio/ton-test/main/nft_data.json?token=GHSAT0AAAAAACSJOY4C5KBS6UU4KK7CASPWZTFJXTA"
    //         ),
    //         owner: wallet.address,
    //     }
    // );
})();

export function createNftDeployLink(
    collection: Address,
    owner: Address,
    amount: bigint,
    content: string,
    index: bigint
) {
    let message = createNftDeployMessage(owner, content, index);
    let link = `ton://transfer/${collection.toString()}?amount=${amount}&bin=${message.toBoc().toString("base64url")}`;
    console.log(link);
}

export function createNftDeployMessage(
    owner: Address,
    content: string,
    index: bigint,
    amount: bigint = toNano("0.03")
) {
    return beginCell()
        .store(
            storeRequestNftDeploy({
                $$type: "RequestNftDeploy",
                index,
                amount,
                content: createOffchainContent(content),
                owner,
            })
        )
        .endCell();
}
