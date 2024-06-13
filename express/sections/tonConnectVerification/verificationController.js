const axios = require("axios");
const { validationResult } = require("express-validator");
const nacl = require("tweetnacl");
const { createHash } = require("crypto");
const crypto = require("crypto");
const { Address } = require("ton");
const jwt = require("jsonwebtoken");
const config = require("config");

const secret = "my_secret_key";
const ttl = 3600 * 1000;
const tonProofPrefix = "ton-proof-item-v2/";
const tonConnectPrefix = "ton-connect";

const generateAccessToken = (address, publicKey) => {
  const payload = {
    address,
    publicKey,
  };
  return jwt.sign(payload, config.get("walletSecret"), { expiresIn: "24h" });
};

function getGeneratePayload(secret) {
  const hash = crypto.createHash("sha256").update(secret).digest("hex");
  return hash.slice(0, 32);
}

async function CreateMessage(message) {
  const wc = Buffer.alloc(4);
  wc.writeUint32BE(message.Workchain);

  const ts = Buffer.alloc(8);
  ts.writeBigUint64LE(BigInt(message.Timstamp));

  const dl = Buffer.alloc(4);
  dl.writeUint32LE(message.Domain.LengthBytes);

  const m = Buffer.concat([
    Buffer.from(tonProofPrefix),
    wc,
    message.Address,
    dl,
    Buffer.from(message.Domain.Value),
    ts,
    Buffer.from(message.Payload),
  ]);

  const messageHash = createHash("sha256").update(m).digest();

  const fullMes = Buffer.concat([
    Buffer.from([0xff, 0xff]),
    Buffer.from(tonConnectPrefix),
    Buffer.from(messageHash),
  ]);

  const res = createHash("sha256").update(fullMes).digest();
  return Buffer.from(res);
}

async function getWalletPublicKey(walletStateInit, chain) {
  const { data } = await axios(
    `https://${
      chain === "-3" ? "testnet." : ""
    }tonapi.io/v2/tonconnect/stateinit`,
    {
      method: "POST",
      data: {
        state_init: walletStateInit,
      },
    }
  );
  return Buffer.from(data.public_key, "hex");
}
function ConvertTonProofMessage(account, proof) {
  const address = Address.parse(account.address);

  const res = {
    Workchain: address.workChain,
    Address: address.hash,
    Domain: {
      LengthBytes: proof.domain.lengthBytes,
      Value: proof.domain.value,
    },
    Signature: Buffer.from(proof.signature, "base64"),
    Payload: proof.payload,
    StateInit: account.walletStateInit,
    Timstamp: proof.timestamp,
  };
  return res;
}
function SignatureVerify(pubkey, message, signature) {
  return nacl.sign.detached.verify(message, signature, pubkey);
}

class verificationController {
  async generatePayload(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const tonProof = getGeneratePayload(secret);

      res.status(200).json({ tonProof });
    } catch (error) {
      console.error("Error generating payload:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async checkProof(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { proof, account } = req.body;

      // Получаем публичный ключ кошелька
      const walletPublicKey = await getWalletPublicKey(
        account.walletStateInit,
        account.chain
      );

      const parsedMessage = ConvertTonProofMessage(account, proof);
      const checkMessage = await CreateMessage(parsedMessage);

      const verifyRes = SignatureVerify(
        walletPublicKey,
        checkMessage,
        parsedMessage.Signature
      );
      if (!verifyRes) {
        return res.status(400).json({ message: "verifyRes is false" });
      }

      const currentPayload = getGeneratePayload(secret);
      if (currentPayload !== proof.payload) {
        return res.status(400).json({ message: "Payload verification failed" });
      }

      const currentTimestamp = Math.floor(Date.now() / 1000);
      const maxTimestampDifference = 300;
      if (
        Math.abs(currentTimestamp - proof.timestamp) > maxTimestampDifference
      ) {
        return res
          .status(400)
          .json({ message: "Timestamp verification failed" });
      }
      const token = generateAccessToken(account.address, account.publicKey);
      return res.json({ token });
    } catch (error) {
      console.error("Error checking proof:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async walletAuth(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { account } = req.body;
      if (
        req.wallet.address !== account.address ||
        req.wallet.publicKey !== account.publicKey
      ) {
        return res.status(400).json({ message: "Token is not vslid" });
      }

      const token = generateAccessToken(account.address, account.publicKey);
      return res.json({ token });
    } catch (error) {
      console.error("Error checking proof:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new verificationController();
