import { test, expect } from '@playwright/test'
import { ApiPromise, WsProvider } from "@polkadot/api";
import { accessCredentials, getAlice } from './helper'
import { initializePlutonicationDAppClient } from '../../plutonication/src/PlutonicationDAppClient'
import { PlutonicationWallet, initializePlutonicationWalletClient } from '../../plutonication/src/PlutonicationWalletClient'
import type { SignerPayloadJSON, SignerPayloadRaw } from "@polkadot/types/types"
import { u8aToHex, hexToU8a } from '@polkadot/util'

test('dApp does not behave correctly', async () => {
  const alice = await getAlice()

  const api = await ApiPromise.create({ provider: new WsProvider("wss://ws.test.azero.dev") });

  console.log("Connected to api")

  function onReceivePubkey(pubkey: string) {
    // Ensure that the received key is right
    expect(pubkey).toBe("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY")
  }

  let dAppConnectionConfirmation = false

  const [dAppClient, walletClient] = await Promise.all([
    initializePlutonicationDAppClient(accessCredentials, onReceivePubkey),
    new Promise<PlutonicationWallet>(async (resolve) => {
      // Wait 3 second
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Connect the PlutonicationWalletClient after PlutonicationDAppClient.
      // They need to run in paralel however.
      // Typically, they would run on different devices/apps in paralel.
      const walletClient = await initializePlutonicationWalletClient(
        accessCredentials,
        alice.address,
        async (payload: SignerPayloadJSON) => { 
          expect(payload.address).toBe("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY")
          console.log("Receive payload")

          const signingPayload = api.registry.createType("ExtrinsicPayload", payload, {
            version: payload.version,
          });
        
          console.log(`Payload to Sign ${signingPayload.toHex()}`);
        
          let message = signingPayload.toU8a({ method: true });
          // If the message is too long, hash it
          if (message.length > 256) {
            message = api.registry.hash(message); // blake2b_256
          }
          
          const signature = alice.sign(message)

          walletClient.sendPayloadSignature({ signature: u8aToHex(signature), id: 0 })
        },
        async (raw: SignerPayloadRaw) => {
          expect(raw.address).toBe("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY")
          console.log("Received raw: " + raw)
          const signature = alice.sign(hexToU8a(raw.data))
          walletClient.sendRawSignature({ signature: u8aToHex(signature), id: 0 })
        },
        undefined,
        () => {
          dAppConnectionConfirmation = true
        }
      )

      resolve(walletClient)
    }),
  ]);

  // Wait 4 second
  await new Promise(resolve => setTimeout(resolve, 4000))

  expect(dAppConnectionConfirmation).toBeTruthy()
  
  // Test payload message signing
  const payload: any = {
    address: alice.address,
    // Half of properties are missing
    signedExtensions: ['CheckNonZeroSender', 'CheckSpecVersion', 'CheckTxVersion', 'CheckGenesis', 'CheckMortality', 'CheckNonce', 'CheckWeight', 'ChargeTransactionPayment'],
    specVersion: "0x00000043",
    tip: "0x00000000000000000000000000000000",
    transactionVersion: "0x00000011",
    version: 4,

    // More unrelated properties
    nothing: "Nothing",
    isThisFunny: true,
  }

  if (dAppClient.signer.signPayload != null) {
    const payloadSignatureResult = await dAppClient.signer.signPayload(payload);

    const signingPayload = api.registry.createType("ExtrinsicPayload", payload, {
      version: payload.version,
    });

    let message = signingPayload.toU8a({ method: true });
    // If the message is too long, hash it
    if (message.length > 256) {
      message = api.registry.hash(message); // blake2b_256
    }

    expect(alice.verify(message, hexToU8a(payloadSignatureResult.signature), alice.publicKey)).toBeTruthy();
  }

  await dAppClient.disconnect()
  await walletClient.disconnect()
});