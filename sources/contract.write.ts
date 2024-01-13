import { Address, contractAddress, toNano } from "@ton/core";
import { TonClient4, WalletContractV4 } from "@ton/ton";
import { MyTactContract } from "./output/sample_MyTactContract";
import { mnemonicToPrivateKey } from "@ton/crypto";
import {_ENDPOINT_MAINNET, _ENDPOINT_TESTNET, _OWNER, _SEQ, _TEST_ONLY, getKeypairFromFile} from "./ton.config";

const Sleep = (ms: number)=> {
    return new Promise(resolve=>setTimeout(resolve, ms))
}

(async () => {
    const client = new TonClient4({
        endpoint: "https://sandbox-v4.tonhubapi.com", // 🔴 Test-net API endpoint
    });

    // open wallet v4 (notice the correct wallet version here)
    const mnemonic = "excite tenant track brief card travel picture company suggest shed usage wire evolve advice lady inform key regular hockey pride health corn dish trigger"; // your 24 secret words (replace ... with the rest of the words)
    const key = await mnemonicToPrivateKey(mnemonic.split(" "));
    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
    
    // let keyPair = await getKeypairFromFile('mnemonics.txt',_TEST_ONLY);
    // const wallet = WalletContractV4.create({ publicKey: keyPair.publicKey, workchain: 0 });
    // const address = wallet.address;
    // console.info("Wallet address (bounceable)" + address.toString({urlSafe:true, bounceable:false, testOnly:_TEST_ONLY}))
    // console.info("Wallet address (non-bounceable)" + address.toString({urlSafe:true, bounceable:true, testOnly:_TEST_ONLY}))
    // console.info("Wallet address (HEX) " + address.toRawString())

    // open wallet and read the current seqno of the wallet
    const walletContract = client.open(wallet);
    const walletSender = walletContract.sender(key.secretKey);

    // open the contract address
    let owner = Address.parse(_OWNER);
    let init = await MyTactContract.init(owner);
    let contract_address = contractAddress(0, init);
    let contract = await MyTactContract.fromAddress(contract_address);
    let contract_open = await client.open(contract);

    // send message to contract
    await contract_open.send(walletSender, { value: toNano(1) }, "decrement");
    
    await Sleep(3000);
    console.log("Getter Value: " + (await contract_open.getGetter()));
})();

