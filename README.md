Download [pot16.ptau](https://storage.googleapis.com/zkevm/ptau/powersOfTau28_hez_final_16.ptau).
Biên dịch file: circom --r1cs --wasm --c --sym --inspect circuits/zuni.circom -o outputs


1. snarkjs groth16 setup outputs/zuni.r1cs outputs/pot16.ptau outputs/zuni_final.zkey
2. snarkjs zkey export verificationkey outputs/zuni_final.zkey outputs/verification_key.json
4. Tao input bằng file addInput.js
3. node outputs/zuni_js/generate_witness.js outputs/zuni_js/zuni.wasm inputs/zuni.json outputs/witness.wtns
4. snarkjs groth16 fullprove inputs/zuni.json outputs/zuni_js/zuni.wasm outputs/zuni_final.zkey outputs/proof.json outputs/public.json 
5. snarkjs groth16 verify outputs/verification_key.json outputs/public.json outputs/proof.json
6. snarkjs zkey export solidityverifier outputs/zuni_final.zkey contracts/Verifier.sol
7. snarkjs zkey export soliditycalldata proofs/zuni/public.json proofs/zuni/proof.json (sử dụng data trả về từ lệnh này để verify trên smart contract đã deploy)
