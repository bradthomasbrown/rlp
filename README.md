# rlp
This is a simple, minimal implementation of recursive-length prefix serialization in TypeScript/JavaScript. 

## Why?
There is surprisingly little information on all aspects of the "cryptographic stack" in JavaScript and elsewhere that is simple and minimal. This repository is part of a series of repositories that builds up this stack from first principles, including:
- [Finite field arithmetic](https://github.com/bradthomasbrown/finite-field)
- [Elliptic curves over finite fields](https://github.com/bradthomasbrown/finite-curve)
- [Sponge constructions and Keccak](https://github.com/bradthomasbrown/keccak)
- The concrete instances of secp256k1, Keccak-256, and more as well as how these are made from the above concepts
- Recursive-length prefix serialization (this library)
- ECDSA
- Interacting with EVM nodes
- And potentially more

## Installation
```sh
npm i @bradthomasbrown/rlp
```

## Usage
```js
import { encode } from "@bradthomasbrown/rlp";

const T = new TextEncoder();

console.log(encode(T.encode("dog")).toHex());
// 83646f67

console.log(encode([T.encode("cat"), T.encode("dog")]).toHex());
// c88363617483646f67

console.log(encode(new Uint8Array()).toHex());
// 80

console.log(encode([]).toHex());
// c0

console.log(encode(0n).toHex());
// 80

console.log(encode(new Uint8Array([0x00])).toHex());
// 00

console.log(encode(new Uint8Array([0x0f])).toHex());
// 0f

console.log(encode(new Uint8Array([0x04, 0x00])).toHex());
// 820400

console.log(encode([ [], [[]], [ [], [[]] ] ]).toHex());
// c7c0c1c0c3c0c1c0

console.log(encode(T.encode("Lorem ipsum dolor sit amet, consectetur adipisicing elit")).toHex());
// b8384c6f72656d20697073756d20646f6c6f722073697420616d65742c20636f6e7365637465747572206164697069736963696e6720656c6974
```