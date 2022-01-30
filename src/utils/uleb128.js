// returns [result, bytesRead]
function decodeULEB128(buf, startOffset = 0) {
  let result = 0
  let shift = 0
  let offset = startOffset
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let byte = new Int8Array(buf, offset)[0]
    offset += 1
    result = result | ((byte & 0x7f) << shift)
    if ((byte & 0x80) === 0) break
    shift += 7
  }
  return [result, offset]
}

export { decodeULEB128 }
