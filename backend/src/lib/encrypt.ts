import crypto from "crypto";


function encrypt(text){
    const iv = crypto.randomBytes(parseInt(process.env.IV_LENGTH));
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(process.env.ENCRYPT_KEY, 'hex'), iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
};


function decrypt(text) {
  const colonIndex = text.indexOf(":");
  const iv = text.substring(0, colonIndex);
  const cipher = text.substring(colonIndex + 1);

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.ENCRYPT_KEY, 'hex'),
    Buffer.from(iv, 'hex')
  );

  return Buffer.concat([
    decipher.update(Buffer.from(cipher, 'hex')),
    decipher.final()
  ]).toString();
}

export {
    encrypt,
    decrypt
}
