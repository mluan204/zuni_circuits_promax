const { buildEddsa, buildBabyjub } = require("circomlibjs");
const { BN } = require("bn.js");
const crypto = require("crypto");


//Tạo cặp khóa public key và private key
async function main() {
  const eddsa = await buildEddsa();
  const babyJub = await buildBabyjub();

  // Tạo khóa riêng ngẫu nhiên
  // const keyRandom = crypto.randomBytes(32);
  // console.log("keyRandom: ", keyRandom.toString("hex"));

  // Tự tạo khóa riêng từ chuỗi hex, khi triển khai thực tế  nên dùng ở trên
  const prvKey = Buffer.from(
    "0001020304050607080900010203040506070809000102030405060708090002",
    "hex"
  );


  const pubKey = eddsa.prv2pub(prvKey);

  const pPubKey = babyJub.packPoint(pubKey);

  console.log(new BN(pPubKey));

}

main().catch((e) => console.log(e.message));
