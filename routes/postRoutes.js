const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();
router.post("/data", (req, res) => {
  res.send(`Received data: ${JSON.stringify(req.body)}`);
});

router.post("/create-wallet", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.privy.io/v1/wallets",
      {
        chain_type: "ethereum",
      },
      {
        auth: {
          username: process.env.PRIVY_APP_ID,
          password: process.env.PRIVY_APP_SECRET,
        },
        headers: {
          "privy-app-id": process.env.PRIVY_APP_ID,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

router.post("/sign-message", async (req, res) => {
  const { wallet_id, message } = req.body;
  try {
    const response = await axios.post(
      `https://api.privy.io/v1/wallets/${wallet_id}/rpc`,
      {
        chain_type: "ethereum",
        method: "personal_sign",
        params: {
          message: message,
          encoding: "utf-8",
        },
      },
      {
        auth: {
          username: process.env.PRIVY_APP_ID,
          password: process.env.PRIVY_APP_SECRET,
        },
        headers: {
          "privy-app-id": process.env.PRIVY_APP_ID,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/send-transaction", async (req, res) => {
  const { wallet_id, to, value } = req.body;
  try {
    const response = await axios.post(
      `https://api.privy.io/v1/wallets/${wallet_id}/rpc`,
      {
        method: "eth_sendTransaction",
        caip2: "eip155:11155111",
        params: {
          transaction: {
            to: to,
            value: value,
          },
        },
      },
      {
        auth: {
          username: process.env.PRIVY_APP_ID,
          password: process.env.PRIVY_APP_SECRET,
        },
        headers: {
          "privy-app-id": process.env.PRIVY_APP_ID,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/create-policy", async (req, res) => {
  const { name, maxAmount } = req.body;
  try {
    const response = await axios.post(
      "https://api.privy.io/v1/policies",
      {
        version: "1.0",
        name: name,
        chain_type: "ethereum",
        method_rules: [
          {
            method: "eth_sendTransaction",
            rules: [
              {
                name: "Restrict USDC transfers",
                conditions: [
                  {
                    field_source: "ethereum_transaction",
                    field: "to",
                    operator: "eq",
                    value: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606EB48", // USDC contract address
                  },
                  {
                    field_source: "ethereum_calldata",
                    field: "transfer.amount",
                    abi: [
                      {
                        inputs: [
                          {
                            internalType: "address",
                            name: "recipient",
                            type: "address",
                          },
                          {
                            internalType: "uint256",
                            name: "amount",
                            type: "uint256",
                          },
                        ],
                        name: "transfer",
                        outputs: [
                          {
                            internalType: "bool",
                            name: "",
                            type: "bool",
                          },
                        ],
                        stateMutability: "nonpayable",
                        type: "function",
                      },
                    ],
                    operator: "leq",
                    value: maxAmount,
                  },
                ],
                action: "ALLOW",
              },
            ],
          },
        ],
        default_action: "DENY",
      },
      {
        auth: {
          username: process.env.PRIVY_APP_ID,
          password: process.env.PRIVY_APP_SECRET,
        },
        headers: {
          "privy-app-id": process.env.PRIVY_APP_ID,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
