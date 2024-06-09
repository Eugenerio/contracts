import * as fs from "fs";
import * as path from "path";
import { prepareTactDeployment } from "@tact-lang/deployer";
import { createOffchainContent } from "./helpers";
import { Address, Builder, Cell, Dictionary, Slice, beginCell, fromNano, toNano, contractAddress } from "ton";
import { NftCollection, storeRequestNftDeploy } from "./output/nft_NftCollection";
import { readFileSync } from "fs";
import { mnemonicToWalletKey } from "ton-crypto";
import { TonClient4, WalletContractV3R2, WalletContractV4 } from "ton";
import { buffer } from "stream/consumers";

// (async () => {
//     // Parameters
//     let testnet = true;
//     let packageName = "nft_NftCollection.pkg";
//     let owner = Address.parse("0QA9PfOXSKS_r5A24KTXPvJiRkvKJ_ZY9TQbCjmXGku4mi7V");
//     let content = createOffchainContent(
//         "https://raw.githubusercontent.com/Eugenerio/ton-test/main/collection_content.json"
//     );
//     let init = await NftCollection.init(owner, content, owner, 21n, 1000n);

//     // Load required data
//     let address = contractAddress(0, init);
//     let data = init.data.toBoc();
//     let pkg = fs.readFileSync(path.resolve(__dirname, "output", packageName));

//     // Prepareing
//     console.log("Uploading package...");
//     let prepare = await prepareTactDeployment({ pkg, data, testnet });

//     // Deploying
//     console.log("============================================================================================");
//     console.log("Contract Address");
//     console.log("============================================================================================");
//     console.log();
//     console.log(address.toString({ testOnly: testnet }));
//     console.log();
//     console.log("============================================================================================");
//     console.log("Please, follow deployment link");
//     console.log("============================================================================================");
//     console.log();
//     console.log(prepare);
//     console.log();
//     console.log("============================================================================================");
// })();

// nft deploy
(async () => {
    createNftDeployLink(
        Address.parse("EQBBKun5mqc35wwGyos09goz5_7DBpP1UnD06sbFD2Mu5g91"), //nft collection
        Address.parse("0QA9PfOXSKS_r5A24KTXPvJiRkvKJ_ZY9TQbCjmXGku4mi7V"), // owner
        toNano("0.06"),
        "https://raw.githubusercontent.com/Eugenerio/ton-test/main/nft_data.json",
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
