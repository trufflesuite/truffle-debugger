import debugModule from "debug";
const debug = debugModule("debugger:data:decode:memory");

import { BN } from "web3-utils";

import * as utils from "./utils";
import { WORD_SIZE } from "./utils";

/**
 * read word from memory
 *
 * requires `byte` to be a multiple of WORD_SIZE (32)
 *
 * @param memory - Uint8Array
 * @return {BN}
 */
export function read(memory, byte) {
  return readBytes(memory, byte, WORD_SIZE);
}

/**
 * read <bytes> amount of bytes from memory, starting at byte <start>
 *
 * @param memory - Uint8Array
 */
export function readBytes(memory, byte, length) {
  byte = utils.toBN(byte);
  length = utils.toBN(length);

  if (byte.toNumber() >= memory.length) {
    return new Uint8Array(length ? length.toNumber() : 0);
  }

  if (length == undefined) {
    return new Uint8Array(memory.buffer, byte.toNumber());
  }

  // grab `length` bytes no matter what, here fill this array
  var bytes = new Uint8Array(length.toNumber());

  // if we're reading past the end of memory, truncate the length to read
  let excess = byte.add(length).sub(utils.toBN(memory.length)).toNumber();
  if (excess > 0) {
    length = utils.toBN(memory.length).sub(byte);
  }

  let existing = new Uint8Array(memory.buffer, byte.toNumber(), length.toNumber());

  bytes.set(existing);

  return bytes;
}

/**
 * Split memory into chunks
 */
export function chunk(memory, size = WORD_SIZE) {
  let chunks = [];

  for (let i = 0; i < memory.length; i += size) {
    let chunk = readBytes(memory, i, size);
    chunks.push(chunk);
  }

  return chunks;
}
