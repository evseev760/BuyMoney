const axios = require("axios");
const { validationResult } = require("express-validator");
const nacl = require("tweetnacl");
const { createHash } = require("crypto");
const crypto = require("crypto");
const { Address } = require("ton");

const secret = "my_secret_key";
const ttl = 3600 * 1000; // 1 час в миллисекундах
const tonProofPrefix = "ton-proof-item-v2/";
const tonConnectPrefix = "ton-connect";

function getGeneratePayload(secret, ttl) {
  // Генерируем случайное значение (nonce)
  const nonce = crypto.randomBytes(8);

  // Вычисляем время жизни payload
  const expiry = new Date(Date.now() + ttl).getTime() / 1000;

  // Объединяем nonce и время жизни в буфер
  const buffer = Buffer.concat([nonce, Buffer.alloc(8)]);
  buffer.writeDoubleBE(expiry, 8);

  // Вычисляем HMAC с использованием SHA-256
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(buffer);
  const payload = hmac.digest();

  // Возвращаем первые 32 символа хэша в виде шестнадцатеричной строки
  return payload.toString("hex").slice(0, 32);
}

async function CreateMessage(message) {
  // wc := make([]byte, 4)
  // binary.BigEndian.PutUint32(wc, uint32(message.Workchain))

  const wc = Buffer.alloc(4);
  wc.writeUint32BE(message.Workchain);

  // ts := make([]byte, 8)
  // binary.LittleEndian.PutUint64(ts, uint64(message.Timstamp))

  const ts = Buffer.alloc(8);
  ts.writeBigUint64LE(BigInt(message.Timstamp));

  // dl := make([]byte, 4)
  // binary.LittleEndian.PutUint32(dl, message.Domain.LengthBytes)
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

  // const messageHash =  //sha256.Sum256(m)
  // const messageHash = await crypto.subtle.digest('SHA-256', m)
  // const m = Buffer.from(tonProofPrefix)
  // m.write(ts)

  // m := []byte(tonProofPrefix)
  // m = append(m, wc...)
  // m = append(m, message.Address...)
  // m = append(m, dl...)
  // m = append(m, []byte(message.Domain.Value)...)
  // m = append(m, ts...)
  // m = append(m, []byte(message.Payload)...)

  const messageHash = createHash("sha256").update(m).digest();

  const fullMes = Buffer.concat([
    Buffer.from([0xff, 0xff]),
    Buffer.from(tonConnectPrefix),
    Buffer.from(messageHash),
  ]);
  // []byte{0xff, 0xff}
  // fullMes = append(fullMes, []byte(tonConnectPrefix)...)
  // fullMes = append(fullMes, messageHash[:]...)

  // const res = await crypto.subtle.digest('SHA-256', fullMes)
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
  console.log(1111111, data);
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

  // return ed25519.Verify(pubkey, message, signature)
}

class verificationController {
  async generatePayload(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const appDomain = "pocketmoneytg.ru"; // Замените на домен вашего приложения
      const timestamp = Math.floor(Date.now() / 1000).toString(); // Текущее время в формате Unix epoch (секунды)
      const payloadData = "12345"; // Дополнительные данные для payload

      const tonProof = getGeneratePayload(secret, ttl);

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

      // Возвращаем результат проверки в ответ
      return res.json({ isValidProof: verifyRes });
    } catch (error) {
      console.error("Error checking proof:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new verificationController();
