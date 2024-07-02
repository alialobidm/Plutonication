// html wrapper is needed for prettier formatting
// install: https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html
const html = String.raw;

const walletPlus = html`
<html>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    .plutonication__component .plutonication__wallets-content .plutonication__wallet-plus {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      text-decoration: none;
      padding: 10px;
      background-color: #393939;
      border-radius: 10px;
      cursor: pointer;
      color: white;
      font-size: 24px;
      height: 72px;
    }
  </style>
</head>

<body>
  <div class="plutonication__wallet-plus">
    +
  </div>
</body>

</html>
`

export default walletPlus
