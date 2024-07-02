import { AccessCredentials } from "../../plutonication/src/AccessCredentials";
import { cryptoWaitReady } from '@polkadot/util-crypto'
import { Keyring } from "@polkadot/api";

export const accessCredentials = new AccessCredentials(
  "wss://plutonication-acnha.ondigitalocean.app/",
  "Plutonication test",
  "https://rostislavlitovkin.pythonanywhere.com/plutowalleticonwhite"
);

/// Helper method that returns the Alice account
export async function getAlice() {
  await cryptoWaitReady()

  // Create an instance of the Keyring
  const keyring = new Keyring({ type: 'sr25519' })

  // Create pair and add Alice to keyring pair dictionary (with account seed)
  const alice = keyring.addFromUri('//Alice')

  return alice
}