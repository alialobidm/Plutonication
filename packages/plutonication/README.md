# Plutonication

Plutonication is a secure way to connect your mobile crypto wallet to dApps remotely.

Optimised for use with Substrate-based blockchains.

# Usage

The overall structure of Plutonication is designed to be as little intrusive as possible.

A comprehensive guide for adding Plutonication to your dApp / Wallet can be found here: https://plutonication.com/docs/javascript.

You can get plutonication working in just 2 lines of extra code.

# How Plutonication works

The private key is always saved in your wallet on your phone and is never sent anywhere.

You need to pair the dApp with the wallet. To do so, the wallet needs to receive a special link with information needed to establish the connection. The wallet can receive this link, for example, by scanning a QR code. Once the link is received, the dApp and the wallet will get paired via websockets to establish a stable connection between different platforms. After the connection is established, the wallet is ready to receive any Extrinsics, which it can then sign and send back to the dApp.

To get a more in-depth details of the underlying backend, read this guide: https://plutonication.com/docs/flask-server.

# Limitations

- both devices need to support internet connection

# Other versions

- C# - https://github.com/cisar2218/Plutonication/tree/main

Feel free to add your own project by making a PR.

# dApps utilising Plutonication
- [Galaxy Logic Game](https://github.com/RostislavLitovkin/galaxylogicgamemaui)

Feel free to add your own project by making a PR.

# Wallets utilising Plutonication
- [PlutoWallet](https://github.com/RostislavLitovkin/PlutoWallet)

Feel free to add your own project by making a PR.

# Servers using Plutonication
- [PlutonicationServerTemplate](https://github.com/rostislavlitovkin/plutonicationservertemplate)

Feel free to add your own project by making a PR.

# Inspiration
- [https://walletconnect.com/](https://walletconnect.com/)

# Contributions
Contributions are welcome. If you wish to contribute to the project, follow these steps:

1. Fork the repository.
2. Create a new branch for your feature: git checkout -b feature/new-feature.
3. Make your changes and commit them: git commit -m 'Add new feature'.
4. Push your changes to your fork: git push origin feature/new-feature.
5. Open a Pull Request in the original repository.

# License
This project is licensed under the MIT License.
