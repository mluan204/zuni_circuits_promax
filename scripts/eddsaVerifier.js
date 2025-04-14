const {
  getInputFromDegree,
  getMsgFromDegree,
} = require("./utils");
const { buildEddsa, buildBabyjub } = require("circomlibjs");
const { BN } = require("bn.js");


//Tạo cặp khóa public key và private key
async function main() {
  const eddsa = await buildEddsa();
  const babyJub = await buildBabyjub();

  const msg = getMsgFromDegree();
  const degree = getInputFromDegree();

  const prvKey = Buffer.from(
    "0001020304050607080900010203040506070809000102030405060708090002",
    "hex"
  );

  const pubKey = eddsa.prv2pub(prvKey);

  const pPubKey = babyJub.packPoint(pubKey);

  console.log(new BN(pPubKey));

}

main().catch((e) => console.log(e.message));
