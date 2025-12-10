/**
 * An item to be RLP encoded.
 */
type Item =
      Uint8Array
    | Array<Item>
    | bigint;

/**
 * @param {Item} item - An RLP encodable item.
 * @returns The length of the RLP encoding of the item.
 */
function itemEncodingLength(item:Item):number {
	if (typeof item == "bigint") return bigintEncodingLength(item);
	if (item instanceof Uint8Array) return uint8ArrayEncodingLength(item);
	if (item instanceof Array) return itemArrayEncodingLength(item);
    return undefined as never;
}

/**
 * @param {bigint} bigint - A bigint.
 * @returns The length of the RLP encoding of the bigint.
 */
function bigintEncodingLength(bigint:bigint):number {
	if (bigint <= 0x7fn) return 1; 
	let _0420_ = 0;
	for (; bigint > 0; _0420_++, bigint >>= 8n);
	return _a9ba_(_0420_);
}

/**
 * @param {Uint8Array} uint8Array - A Uint8Array.
 * @returns The length of the RLP encoding of the Uint8Array.
 */
function uint8ArrayEncodingLength(uint8Array:Uint8Array):number {
	const { byteLength } = uint8Array;
	if ((byteLength == 1 && uint8Array[0]! <= 0x7f) || byteLength == 0) return 1;
	return _a9ba_(byteLength);
}

/**
 * @param {Array<item>} itemArray - An item array.
 * @returns The length of the RLP encoding of the item array.
 */
function itemArrayEncodingLength(itemArray:Array<Item>):number {
	const _fd11_ = itemArray.reduce((a,s) => a + itemEncodingLength(s), 0);
	return _a9ba_(_fd11_);
}

/**
 * Takes a quantity of bytes representing the direct value of an RLP encodable item and returns the sum of those bytes and
 * the "boilerplate" bytes needed for the full RLP encoding, including length and type information.
 * @param {number} _4f22_ - The quantity of bytes representing the direct value of an item.
 * @returns The quantity of bytes representing the full RLP encoding of an item, including direct value bytes and encoding boilerplate bytes.
 */
function _a9ba_(_4f22_:number):number {
	if (_4f22_ <= 55) return 1 + _4f22_;
	let _b8e3_ = 0;
	for (let _7a43_ = _4f22_; _7a43_ > 0; _b8e3_++, _7a43_ >>= 8);
	return 1 + _b8e3_ + _4f22_;
}

/**
 * @param {Item} item - An RLP encodable item.
 * @returns The RLP encoding of the item.
 */
function encode(item:Item):Uint8Array {
	const encoding = new Uint8Array(itemEncodingLength(item));
	const index = encoding.byteLength - 1;
	encodeItem(encoding, index, item);
	return encoding;
}

/**
 * Dispatches encoding execution depending on the type of an item and updates the final RLP encoding pointer.
 * @param {Uint8Array} encoding - A Uint8Array to contain the final RLP encoding of an item.
 * @param {number} index - A pointer indicating the current index into the final RLP encoding Uint8Array.
 * @param {Item} item - An RLP encodable item.
 */
function encodeItem(encoding:Uint8Array, index:number, item:Item):number {
	if (typeof item == "bigint") return index = encodeBigint(encoding, index, item);
	if (item instanceof Uint8Array) return index = encodeUint8Array(encoding, index, item);
	if (item instanceof Array) return index = encodeItemArray(encoding, index, item);
    return undefined as never;
}

/**
 * Encodes a bigint into the final RLP encoding's Uint8Array and returns an updated pointer value.
 * @param {Uint8Array} encoding - A Uint8Array to contain the final RLP encoding of an item.
 * @param {number} index - A pointer indicating the current index into the final RLP encoding Uint8Array.
 * @param {bigint} bigint - A bigint.
 */
function encodeBigint(encoding:Uint8Array, index:number, bigint:bigint) {
	if (bigint != 0n && bigint <= 0x7fn) {
		encoding[index] = Number(bigint);
		return index - 1;
	}
	let _6287_ = 0;
	while (bigint > 0n) {
		_6287_++;
		encoding[index] = Number(bigint & 0xffn);
		index--;
		bigint >>= 8n;
	}
	if (_6287_ <= 55) {
		encoding[index] = 0x80 + _6287_;
		return index - 1;
	}
	let _f0c6_ = 0;
	while (_6287_ > 0) {
		_f0c6_++;
		encoding[index] = _6287_ & 0xff;
		index--;
		_6287_ >>= 8;
	}
	encoding[index] = 0xb7 + _f0c6_;
	return index - 1;
}

/**
 * Encodes a Uint8Array into the final RLP encoding's Uint8Array and returns an updated pointer value.
 * @param {Uint8Array} encoding - A Uint8Array to contain the final RLP encoding of an item.
 * @param {number} index - A pointer indicating the current index into the final RLP encoding Uint8Array.
 * @param {Uint8Array} uint8Array - A Uint8Array.
 */
function encodeUint8Array(encoding:Uint8Array, index:number, uint8Array:Uint8Array) {
	let { byteLength } = uint8Array;
	if (byteLength == 1 && uint8Array[0]! <= 0x7f) {
		encoding[index] = uint8Array[0]!;
		return index - 1;
	}
	for (let _b8b3_ = byteLength - 1; _b8b3_ >= 0; _b8b3_--, index--)
        encoding[index] = uint8Array[_b8b3_]!;
	if (byteLength <= 55) {
		encoding[index] = 0x80 + byteLength;
		return index - 1;
	}
	let _4648_ = 0;
	while (byteLength > 0) {
		_4648_++;
		encoding[index] = byteLength & 0xff;
		index--;
		byteLength >>= 8;
	}
	encoding[index] = 0xb7 + _4648_;
	return index - 1;
}

/**
 * Encodes an item array into the final RLP encoding's Uint8Array and returns an updated pointer value.
 * @param {Uint8Array} encoding - A Uint8Array to contain the final RLP encoding of an item.
 * @param {number} index - A pointer indicating the current index into the final RLP encoding Uint8Array.
 * @param {Array<Item>} itemArray - An item array.
 */
function encodeItemArray(encoding:Uint8Array, index:number, itemArray:Array<Item>) {
    const initialIndex = index;
	for (let _81e0_ = itemArray.length - 1; _81e0_ >= 0; _81e0_--)
		index = encodeItem(encoding, index, itemArray[_81e0_]!);
    const indexDelta = initialIndex - index;
	if (indexDelta <= 55) {
		encoding[index] = 0xc0 + indexDelta;
		return index - 1;
	}
	let _0ba3_ = 0;
    let _c2e7_ = indexDelta;
	while (_c2e7_ > 0) {
		_0ba3_++;
		encoding[index] = _c2e7_ & 0xff;
		index--;
		_c2e7_ >>= 8;
	}
	encoding[index] = 0xf7 + _0ba3_;
	return index - 1;
}

export { encode };