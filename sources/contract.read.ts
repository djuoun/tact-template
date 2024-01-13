import * as fs from "fs";
import * as path from "path";
import { Address, contractAddress } from "@ton/core";
import { TonClient4 } from "@ton/ton";
import { MyTactContract } from "./output/sample_MyTactContract";
import { prepareTactDeployment } from "@tact-lang/deployer";
import {_ENDPOINT_MAINNET, _ENDPOINT_TESTNET, _OWNER, _SEQ, _TEST_ONLY} from "./ton.config";

(async () => {
    // const client = new TonClient4({
    //     endpoint: "https://sandbox-v4.tonhubapi.com", // 🔴 Test-net API endpoint
    // });
    const client = new TonClient4({
        endpoint: _TEST_ONLY ? _ENDPOINT_TESTNET : _ENDPOINT_MAINNET
    });

    // Parameters
    let testnet = true;
    let packageName = "sample_SampleTactContract.pkg";
    // let owner = Address.parse("kQD2vDOIq2asu516eGa5N1UXdhbJ8iWrK6Ug2MTAw4YDeRw4");
    let owner = Address.parse(_OWNER);
    let init = await MyTactContract.init(owner);
    let contract_address = contractAddress(0, init);

    // Prepareing
    console.log("Reading Contract Info...");
    console.log(contract_address);

    // Input the contract address
    let contract = await MyTactContract.fromAddress(contract_address);
    let contract_open = await client.open(contract);
    console.log("Counter Value: " + (await contract_open.getCounter()));
    console.log("Getter Value: " + (await contract_open.getGetter()));
})();
