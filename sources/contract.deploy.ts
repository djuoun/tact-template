import * as fs from "fs";
import * as path from "path";
import { Address, contractAddress } from "@ton/core";
import { MyTactContract } from "./output/sample_MyTactContract";
import { prepareTactDeployment } from "@tact-lang/deployer";
import {_OWNER, _SEQ, _TEST_ONLY} from "./ton.config";

(async () => {
    // Parameters
    let testnet = true;
    let packageName = "sample_MyTactContract.pkg";
    // let owner = Address.parse("kQD2vDOIq2asu516eGa5N1UXdhbJ8iWrK6Ug2MTAw4YDeRw4");
    let owner = Address.parse(_OWNER);
    let init = await MyTactContract.init(owner);
    // let init = await SampleTactContract.init(owner, _SEQ);

    // Load required data
    let address = contractAddress(0, init);
    let data = init.data.toBoc();
    let pkg = fs.readFileSync(path.resolve(__dirname, "output", packageName));

    // Prepareing
    console.log("Uploading package...");
    let prepare = await prepareTactDeployment({ pkg, data, testnet });

    // Deploying
    console.log("============================================================================================");
    console.log("Contract Address");
    console.log("============================================================================================");
    console.log();
    console.log(address.toString({ testOnly: testnet }));
    console.log();
    console.log("============================================================================================");
    console.log("Please, follow deployment link");
    console.log("============================================================================================");
    console.log();
    console.log(prepare);
    console.log();
    console.log("============================================================================================");
})();
