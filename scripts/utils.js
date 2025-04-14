const { byteLengthOfData } = require("./constant");
const { BN } = require("bn.js");
const fs = require("fs");
const { buildBabyjub, buildPedersenHash } = require("circomlibjs");

// Chuyển một chuỗi thành dạng hex little-endian có độ dài cố định (mặc định 32 byte)
const stringToLeHex = (stringData, length = 32) => {
  const itemBuffer = Buffer.from(stringData);
  const itemBN = new BN(itemBuffer);
  const itemLe = itemBN.toBuffer("le", length);
  const itemLeHex = itemLe.toString("hex");

  return "0x" + itemLeHex;
};

// Chuyển một Buffer thành chuỗi hex ở định dạng little-endian
const bufferLe = (buf) => {
  const itemBN = new BN(buf);
  const itemLe = itemBN.toBuffer("le");
  const itemLeHex = itemLe.toString("hex");

  return "0x" + itemLeHex;
};

// Cắt một buffer 32 byte thành 2 phần 16 byte, rồi chuyển mỗi phần thành hex LE
const convertToLePartials = (fullBuf) => {
  return [bufferLe(fullBuf.slice(0, 16)), bufferLe(fullBuf.slice(16, 32))];
};

// Chuyển một số hoặc buffer thành chuỗi hex big-endian, có padding để đủ độ dài byte (default 32 byte)
const toHex = (number, length = 32) =>
  "0x" +
  (number instanceof Buffer
    ? number.toString("hex")
    : new BN(number).toString(16)
  ).padStart(length * 2, "0");

// Hash dữ liệu bằng Pedersen Hash sử dụng lib circomlibjs, trả về tọa độ x của điểm hash trên BabyJubjub curve (ở dạng string)
const pedersenHash = async (data) => {
  const babyJubBuilder = await buildBabyjub();
  const pedersenHashBuilder = await buildPedersenHash();
  const hashed = pedersenHashBuilder.hash(data);

  const unpackedPoint = babyJubBuilder.unpackPoint(hashed)[0];

  return babyJubBuilder.F.toString(unpackedPoint);
};

/*
Đọc dữ liệu chứng chỉ từ `data.json`,
→ chuyển từng field thành chuỗi hex little-endian đúng độ dài
→ nối toàn bộ lại thành chuỗi hex lớn
→ tạo Buffer từ chuỗi này
→ băm bằng Pedersen Hash
→ trả về hash string (sẽ dùng để làm leaf trong Merkle Tree)
*/
const getPedersenHashFromDegree = async () => {
  const dataStringify = fs.readFileSync("./scripts/data.json");
  const data = JSON.parse(dataStringify);
  let totalData = "";

  for (let key in data) {
    if (typeof data[key] === "object") {
      const parentValue = data[key];

      for (let childKey in parentValue) {
        const value = parentValue[childKey];
        const length = byteLengthOfData[key][childKey];

        const itemLeHex = stringToLeHex(value, length);

        totalData += itemLeHex.slice(2);
      }
    } else {
      const value = data[key];
      const length = byteLengthOfData[key];

      const itemLeHex = stringToLeHex(value, length);

      totalData += itemLeHex.slice(2);
    }
  }

  const buff = new BN(totalData, "hex").toBuffer();

  return pedersenHash(buff);
};

/*
Đọc dữ liệu `data.json` 
→ mỗi giá trị sẽ được chuyển sang hex string (không thay đổi thứ tự byte)
→ nếu là object (như ngày/tháng/năm), lặp qua từng phần tử
→ trả về một object JSON với các giá trị hex, để dùng làm input cho Circom
*/
const getInputFromDegree = () => {
  const dataStringify = fs.readFileSync("./scripts/data.json");
  const data = JSON.parse(dataStringify);

  const input = {};

  for (let key in data) {
    if (typeof data[key] === "object") {
      const parentValue = data[key];
      const values = [];

      for (let childKey in parentValue) {
        const value = parentValue[childKey];

        const itemBuf = Buffer.from(value);
        const itemHex = "0x" + itemBuf.toString("hex");

        values.push(itemHex);
      }

      input[key] = values;
    } else {
      const value = data[key];

      const itemBuf = Buffer.from(value);
      const itemHex = "0x" + itemBuf.toString("hex");

      input[key] = itemHex;
    }
  }

  return input;
};

/*
Tương tự như `getPedersenHashFromDegree` nhưng chỉ trả về Buffer (không hash)
→ để dùng như thông điệp đầu vào (msg) cho ký số hoặc băm ngoài
*/
const getMsgFromDegree = () => {
  const dataStringify = fs.readFileSync("./scripts/data.json");
  const data = JSON.parse(dataStringify);
  let totalData = "";

  for (let key in data) {
    if (typeof data[key] === "object") {
      const parentValue = data[key];

      for (let childKey in parentValue) {
        const value = parentValue[childKey];
        const length = byteLengthOfData[key][childKey];

        const itemLeHex = stringToLeHex(value, length);

        totalData += itemLeHex.slice(2);
      }
    } else {
      const value = data[key];
      const length = byteLengthOfData[key];

      const itemLeHex = stringToLeHex(value, length);

      totalData += itemLeHex.slice(2);
    }
  }

  const buff = new BN(totalData, "hex").toBuffer();

  return buff;
};

module.exports = {
  stringToLeHex,
  toHex,
  pedersenHash,
  getPedersenHashFromDegree,
  getInputFromDegree,
  getMsgFromDegree,
  bufferLe,
  convertToLePartials,
};
