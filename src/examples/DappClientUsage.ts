// Small example of how to send the payloads request to be signed  to the  
//wallet using PlutonicationDappClient function

import type { Injected, InjectedAccount } from "@polkadot/extension-inject/types";
import type { SignerPayloadJSON, SignerPayloadRaw, SignerResult } from "@polkadot/types/types";
import { waitForSignature } from "../helpers.ts/waitForSignature";
import { AccessCredentials } from "../AccesCredentials";
import { PlutonicationDAppClient } from "../PlutonicationDAppClient";
import { ApiPromise, WsProvider } from "@polkadot/api";

const dappClientUsage = () : void => {
  const accessCredentials = new AccessCredentials(
    "wss://plutonication-acnha.ondigitalocean.app/",
    "1",
    "Galaxy Logic Game",
    "https://rostislavlitovkin.pythonanywhere.com/logo"
  );

  const dappClient = new PlutonicationDAppClient(accessCredentials);
  const payloadRaw: SignerPayloadRaw  = {
    address: "5EenBDznmizmHFXu37jGsQ3K7uvcrAqXjKByoqgbge82KMgF",
    data: "0x3c42797465733e48656c6c6f20537562737472617465206d6573736167653c2f42797465733e",
    type: "bytes",
  };

  const payloadJson: SignerPayloadJSON  = {
    address: "5EenBDznmizmHFXu37jGsQ3K7uvcrAqXjKByoqgbge82KMgF",
    blockHash: "0xd12ff783a76a5e07156d2a3ff61745b3a1f892bf6247c1b3bf0fd7ba2085eda6",
    blockNumber: "0x02c539c4",
    era: "0x481c",
    genesisHash: "0x05d5279c52c484cc80396535a316add7d47b1c5b9e0398dd1f584149341460c5",
    method: "0x050700004769bbe59968882c1597ec1151621f0193547285125f1c1337371c013ff61f0f0080c6a47e8d03",
    nonce: "0x00000001",
    signedExtensions: ["CheckNonZeroSender", "CheckSpecVersion", "CheckTxVersion", "CheckGenesis", "CheckMortality", "CheckNonce", "CheckWeight", "ChargeTransactionPayment"],
    specVersion: "0x00000043",
    tip: "0x00000000000000000000000000000000",
    transactionVersion: "0x00000011",
    version: 4,
  };


  // initialize the connection
  dappClient.initialize();

  // Receive the pub key from the wallet
  dappClient.receivePubKey();

  // Send the payload requests
  dappClient.sendJsonPayload(payloadJson);
  dappClient.sendRawPayload(payloadRaw);



};

dappClientUsage();