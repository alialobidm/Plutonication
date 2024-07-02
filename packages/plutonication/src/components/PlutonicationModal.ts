// @ts-nocheck

import QRCode from "qrcode"
import { AccessCredentials } from "../AccessCredentials"
import { DOMAttributes } from "react"
import plutonicationModalMainDesktop from "./PlutonicationModalMainDesktop"
import plutonicationModalMainMobile from "./PlutonicationModalMainMobile"
import plutonicationModalAllWallets from "./PlutonicationModalAllWallets"
import plutonicationModalWalletDownloads from "./PlutonicationModalWalletDownloads"
import plutonicationModalWalletDownloadDesktop from "./PlutonicationModalWalletDownloadDesktop"
import plutonicationModalConnectionStatus from "./PlutonicationModalConnectionStatus"
import plutonicationModalBase from "./PlutonicationModalBase"
import wallet from "./Wallet"
import walletPlus from "./WalletPlus"
import { DownloadWalletDto } from "./DownloadWalletDto"
import { DeepLinker, initializeDeepLinker } from "./DeepLinker"

/**
 * "QR Modal used to connect the dapp to the Plutonication server.
 * @extends HTMLElement
 */
export class PlutonicationModal extends HTMLElement {
  private shadow: ShadowRoot
  private content: HTMLDivElement
  private accessCredentials: AccessCredentials
  private walletInfos: DownloadWalletDto[]

  /**
   * Creates a new modal.
   */
  constructor() {
    super()

    this.shadow = this.attachShadow({ mode: "open" })

    this.shadow.innerHTML = plutonicationModalBase

    this.content = this.shadowRoot?.getElementById("plutonication__content")

    document.addEventListener('keydown', (event) => event.key === 'Escape' && this.closeModal())
  }

  /**
   * Load and show Main view for Desktop
   * @param accessCredentials used for establishing a correct connection to the PlutonicationServer
   */
  private async showMainDesktopView(): Promise<void> {
    this.content.innerHTML = plutonicationModalMainDesktop

    // This is loading optimization
    const modal: HTMLElement = this.shadowRoot?.getElementById("plutonication__component")
    modal.style.display = "flex"

    // Back button
    const backButton: HTMLImageElement = this.shadowRoot?.getElementById("plutonication__back")
    backButton.addEventListener("click", () => {
      this.closeModal()
    })

    // Load QR code
    await this.generateQRCode(this.accessCredentials.ToUri())

    // Load supported wallets
    await this.loadDownloadWallets(3)
  }

  /**
   * Load and show Main view for Desktop
   * @param accessCredentials used for establishing a correct connection to the PlutonicationServer
   */
  private async showMainMobileView(): Promise<void> {
    this.content.innerHTML = plutonicationModalMainMobile

    // This is loading optimization
    const modal: HTMLElement = this.shadowRoot.querySelector(".plutonication__component")
    modal.style.display = "flex"

    // Back button
    const backButton = this.shadowRoot.querySelector(".plutonication__back")
    backButton.addEventListener("click", () => {
      this.closeModal()
    })
  }

  /**
   * Loads the supported wallets
   */
  private async loadDownloadWallets(limit: number | undefined) {

    //Fetching api with wallets content

    if (!this.walletInfos) {
      try {
        const response = await fetch("https://plutonication.com/supported-wallets")
        this.walletInfos = await response.json()
      }
      catch {
        return;
      }
    }

    const walletsContent: HTMLDivElement = this.shadowRoot?.getElementById("plutonication__wallets-content")

    const walletInfos = limit ? this.walletInfos.slice(0, limit) : this.walletInfos

    walletInfos.forEach((data: DownloadWalletDto, index: number) => {
      const walletItem: HTMLDivElement = document.createElement("div")

      walletItem.innerHTML = wallet;
      walletItem.id = `wallet${index}`
      walletItem.setAttribute("data-google-play-link", data.downloadAndroid)
      walletItem.setAttribute("data-app-store-link", data.downloadIOS)

      const img: HTMLImageElement = walletItem.querySelector(".plutonication__wallet-icon")
      img.src = data.icon

      const description: HTMLSpanElement = walletItem.querySelector(".plutonication__wallet-description")
      description.textContent = data.name

      walletItem.addEventListener("click", () => {
        this.showWalletDownloads(data)
      })

      walletsContent.appendChild(walletItem)
    })

    if (limit && this.walletInfos.length > limit) {
      const walletItem: HTMLDivElement = document.createElement("div")

      walletItem.innerHTML = walletPlus;
      walletItem.id = `wallet${limit}`

      walletItem.addEventListener("click", () => {
        this.showAllWallets()
      })

      walletsContent.appendChild(walletItem)
    }
  }

  /**
   * Generate the QRCode in base an input text
   * @param {inputText} - text
   */
  private async generateQRCode(inputText: string) {
    const qrCodeContainer = this.shadowRoot.getElementById("qr-code")

    const qrCodeDataURL = await QRCode.toDataURL(inputText)
    const qrCodeImage = document.createElement("img")
    qrCodeImage.height = 260
    qrCodeImage.width = 260
    qrCodeImage.src = qrCodeDataURL
    if (qrCodeContainer) {
      qrCodeContainer.innerHTML = ""
      qrCodeContainer.appendChild(qrCodeImage)
    }
  }

  /**
   * Show all wallet options in case there are more than three.
   */
  private async showAllWallets() {
    this.content.innerHTML = plutonicationModalAllWallets

    // This is loading optimization
    const modal: HTMLElement = this.shadowRoot?.getElementById("plutonication__component")
    modal.style.display = "flex"

    // Back button
    const backButton = this.shadowRoot.querySelector(".plutonication__back")
    backButton.addEventListener("click", () => {
      this.showMainDesktopView()
    })

    // Load supported wallets
    await this.loadDownloadWallets(undefined)
  }

  /**
   * Display the download buttons for the wallet for both iOS and Windows
   * @param {walletItem} - Specific wallet item
   */
  private showWalletDownloads(walletInfo: DownloadWalletDto) {
    this.content.innerHTML = plutonicationModalWalletDownloads

    // This is loading optimization
    const modal: HTMLElement = this.shadowRoot.querySelector(".plutonication__component")
    modal.style.display = "flex"

    // Back button
    const backButton = this.shadowRoot.querySelector(".plutonication__back")
    backButton.addEventListener("click", () => {
      this.showMainDesktopView()
    })

    // Google Play download link
    const googlePlayLink = this.shadowRoot.getElementById("google-play")
    if (walletInfo.downloadAndroid) {
      googlePlayLink.addEventListener("click", () => {
        this.showWalletDownloadDesktop(walletInfo.downloadAndroid)
      })
    } else {
      googlePlayLink.classList.add("plutonication__disabled");
    }

    // App Store download link
    const appStoreLink = this.shadowRoot.getElementById("app-store")
    if (walletInfo.downloadIOS) {
      appStoreLink.addEventListener("click", () => {
        this.showWalletDownloadDesktop(walletInfo.downloadIOS)
      })
    } else {
      appStoreLink.classList.add("plutonication__disabled");
    }
  }

  /**
   * Display the download buttons for the wallet for both iOS and Windows
   * @param {walletItem} - Specific wallet item
   */
  private showWalletDownloadDesktop(link: string) {
    this.content.innerHTML = plutonicationModalWalletDownloadDesktop

    // This is loading optimization
    const modal: HTMLElement = this.shadowRoot.querySelector(".plutonication__component")
    modal.style.display = "flex"

    // Back button
    const backButton = this.shadowRoot.querySelector(".plutonication__back")
    backButton.addEventListener("click", () => {
      this.showMainDesktopView()
    })

    this.generateQRCode(link)
  }

  /**
   * Shows the connection status when it unexpectedly changes.
   * Mostly used for telling the user that the connection has failed or the wallet has disconnected.
   */
  showConnectionStatus(message: string): void {
    this.content.innerHTML = plutonicationModalConnectionStatus

    // This is loading optimization
    const modal: HTMLElement = this.shadowRoot.querySelector(".plutonication__component")
    modal.style.display = "flex"

    // Back button
    const backButton = this.shadowRoot.querySelector(".plutonication__back")
    backButton.addEventListener("click", () => {
      this.showMainDesktopView()
    })

    const connectionStatus: HTMLDivElement = this.shadowRoot.querySelector(".plutonication__connection-status")
    connectionStatus.innerHTML = message
  }

  /**
   * Opens the modal and displays the QR code generated with the access credentials information.
   * @param {AccessCredentials} accessCredentials - used to generate the correct QR.
   */
  openModal(accessCredentials: AccessCredentials): void {
    this.accessCredentials = accessCredentials

    const linker: DeepLinker = initializeDeepLinker(
      () => this.showMainMobileView(),
      () => this.showMainDesktopView(),
    )

    linker.openURL(accessCredentials.ToUri());
  }

  /**
   * Closes the modal
   */
  closeModal(): void {
    const modal: HTMLMainElement = this.shadowRoot?.getElementById("plutonication__component")
    modal.style.display = "none"
  }
}

// Defines the html web component
customElements.get("plutonication-modal") || customElements.define("plutonication-modal", PlutonicationModal)

// Extends the JSX namespace
type CustomElement<T> = Partial<T & DOMAttributes<T>>

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["plutonication-modal"]: CustomElement<PlutonicationModal>
    }
  }
}
