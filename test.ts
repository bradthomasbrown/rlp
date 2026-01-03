import { encode } from "./src/rlp.js";
import RLP from "rlp"

const input = await Bun.file("input.hex").text();

const foo = encode([
    1n,
    875000001n,
    2665792n,
    new Uint8Array(),
    0n,
    Uint8Array.fromHex(input),
    1337n,
    0n,
    0n
]).toHex().slice(0, 10);

const bar = RLP.encode([
    1n,
    875000001n,
    2665792n,
    new Uint8Array(),
    0n,
    Uint8Array.fromHex(input),
    1337n,
    0n,
    0n
]).toHex().slice(0, 10);

console.log(foo == bar);

console.log(encode(1337n).toHex());
console.log(RLP.encode(1337n).toHex());