# ZUni zkSNARKs Proof System

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
snarkjs groth16 setup outputs/zuni.r1cs outputs/pot16.ptau outputs/zuni_final.zkey
snarkjs zkey export verificationkey outputs/zuni_final.zkey outputs/verification_key.json
```

## Tạo input từ data.json
```sh
node scripts/addInput.js
```

## Tính witness
```sh
node outputs/zuni_js/generate_witness.js outputs/zuni_js/zuni.wasm inputs/zuni.json outputs/witness.wtns
```

##  Tạo proof và public signal
```sh
snarkjs groth16 fullprove inputs/zuni.json outputs/zuni_js/zuni.wasm outputs/zuni_final.zkey outputs/proof.json outputs/public.json
```

##  Xác minh proof
```sh
snarkjs groth16 verify outputs/verification_key.json outputs/public.json outputs/proof.json
```

## Tạo Solidity calldata để gửi lên smart contract
```sh
snarkjs zkey export soliditycalldata outputs/public.json outputs/proof.json
```






