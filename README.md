# ZUni zkSNARKs PROMAX

Tải file pot16.ptau, [pot16.ptau](https://storage.googleapis.com/zkevm/ptau/powersOfTau28_hez_final_16.ptau).

## Cài đặt thư viện

```sh
npm install @openzeppelin/contracts bn.js circomlib circomlibjs ethers fixed-merkle-tree nodemon snarkjs
```

## Biên dịch file zuni.circom
```sh
circom --r1cs --wasm --c --sym --inspect circuits/zuni.circom -o outputs
```

## Tạo proving key và verifying key
```sh
snarkjs groth16 setup outputs/zuni.r1cs pot16.ptau outputs/zuni_final.zkey
snarkjs zkey export verificationkey outputs/zuni_final.zkey outputs/verification_key.json
```

## Tạo input từ data.json
```sh
node scripts/addInput.js
```

## Tạo proof và major cho contract VerificationCenter.sol
```sh
node scripts/generateProof.js
```

## Tạo contract Verifier.sol
```sh
snarkjs zkey export solidityverifier outputs/zuni_final.zkey contracts/Verifier.sol
```

## ⚠️ Lưu ý:
Deploy smart contract RegistryDID.sol && Verifier.sol trước.

Sau khi deploy 2 contract trên thì deploy contract VerificatioCenter.sol với đầu vào là address của hai contract trên.


# Một số lệnh khác
## Tính witness
```sh
node outputs/zuni_js/generate_witness.js outputs/zuni_js/zuni.wasm inputs/input.json outputs/witness.wtns
```

##  Tạo proof và public signal
```sh
snarkjs groth16 fullprove inputs/input.json outputs/zuni_js/zuni.wasm outputs/zuni_final.zkey outputs/proof.json outputs/public.json
```

##  Xác minh proof
```sh
snarkjs groth16 verify outputs/verification_key.json outputs/public.json outputs/proof.json
```

## Tạo Solidity calldata để gửi lên smart contract
```sh
snarkjs zkey export soliditycalldata outputs/public.json outputs/proof.json
```






