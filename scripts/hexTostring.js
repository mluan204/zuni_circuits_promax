const fs = require("fs");

const inputJson = JSON.parse(
  fs.readFileSync(__dirname + "/../inputs/input.json", "utf8")
);
const output = {};

const excludeKeys = ["pubKeyPartials", "r8Partials", "sPartials"];

for (let key in inputJson) {
  if (excludeKeys.includes(key)) continue;

  const value = inputJson[key];

  if (Array.isArray(value)) {
    output[key] = value.map((hex) => {
      const hexStr = hex.startsWith("0x") ? hex.slice(2) : hex;
      return Buffer.from(hexStr, "hex").toString();
    });
  } else {
    const hexStr = value.startsWith("0x") ? value.slice(2) : value;
    output[key] = Buffer.from(hexStr, "hex").toString();
  }
}

console.log(output);
