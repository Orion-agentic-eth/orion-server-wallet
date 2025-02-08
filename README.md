# Orion Server Wallet

## Getting started with our REST API

### 0. Prerequisites

- [Set up](https://dashboard.privy.io/) a Privy app
  - Retrieve your `App ID` and `App secret`
- **Request access to server wallets by emailing [hi+ethglobal@privy.io](mailto:hi+ethglobal@privy.io) with your App ID**

Every request to Privy’s REST API must include the following headers:

- `Authorization`: basic auth header with the username being your Privy app ID, and the password being your Privy app secret
- `privy-app-id`: your Privy app ID

### 1. Environment Variables

Create a `.env` file in the root directory and add your Privy app ID and secret:

```
PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret
```

### 2. Creating a wallet

First, we’ll create a server wallet. You’ll use this wallet’s `id` in future calls to sign messages and send transactions.

```
POST /api/create-wallet
```

### 3. Signing a message

Next, we’ll sign a plaintext message with the server wallet using the `personal_sign` method.

```
POST /api/sign-message
{
  "wallet_id": "your_wallet_id",
  "message": "Hello, Ethereum."
}
```

### 4. Sending transactions

To send a transaction from your wallet, use the rpc method `eth_sendTransaction`.

```
POST /api/send-transaction
{
  "wallet_id": "your_wallet_id",
  "to": "0xyourRecipientAddress",
  "value": 100000
}
```
