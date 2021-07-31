import { decodeULEB128 } from './uleb128'
import { decodeUtf8 } from './utf8-decoder'

// Returns array of:
/*
{
  name: string,
  beatmapMd5s: string[]
}
*/
function parseCollectionDb(buffer) {
  let collections = []
  let offset = 0

  // skip version (Int32, 4 bytes)
  offset += 4

  // read number of collections (Int32, 4 bytes)
  let numCollections = readUnalignedInt32(buffer, offset)
  offset += 4

  for (let i = 0; i < numCollections; i++) {

    // read collection name (peppy string)
    let [collectionName, bytesParsed] = parsePeppyString(buffer, offset)
    offset += bytesParsed

    // read number of beatmaps in collection (Int32)
    // let numBeatmaps: number = new Uint32Array(buffer, offset)[0]
    let numBeatmaps = readUnalignedInt32(buffer, offset)
    offset += 4

    // read each beatmap MD5 hash
    let beatmapMd5s = []
    for (let i = 0; i < numBeatmaps; i++) {
        let [beatmapMd5, bytesParsed] = parsePeppyString(buffer, offset)
        beatmapMd5s.push(beatmapMd5)
        offset += bytesParsed
    }

    collections.push({
      name: collectionName,
      beatmaps: beatmapMd5s
    })
  }
  return collections
}

function readUnalignedInt32(source, position) {
    let readBuffer = new ArrayBuffer(4)
    let u8Dest = new Uint8Array(readBuffer, 0, 4); // Create 8-bit view of the array
    let u8Src = new Uint8Array(source, position, 4);   // Create 8-bit view of the array
    u8Dest.set(u8Src, 0);                          // Copy bytes one by one
    return new Uint32Array(readBuffer)[0]
}

// Peppy's binary string encoding according to https://osu.ppy.sh/wiki/cs/osu!_File_Formats/Db_(file_format)
/* Has three parts; a single byte which will be either 0x00, indicating that the
 * next two parts are not present, or 0x0b (decimal 11), indicating that the next
 * two parts are present. If it is 0x0b, there will then be a ULEB128,
 * representing the byte length of the following string, and then the string
 * itself, encoded in UTF-8. */
// Returns [result: string, bytesRead: number], where endOffset is the position after the last byte of the string
function parsePeppyString(buffer, startOffset) {
  let offset = startOffset
  if (new Uint8Array(buffer, offset)[0] === 0x00) {
    return ['', 1]
  }
  else if (new Uint8Array(buffer, offset)[0] === 0x0b) {
    offset += 1
    const uleb128 = decodeULEB128(new Uint8Array(buffer, offset), 0)
    const stringLength = Number(uleb128[0])
    const ulebLength = uleb128[1]
    offset += ulebLength

    const result = decodeUtf8(new Uint8Array(buffer, offset, stringLength))
    offset += stringLength
    let bytesParsed = offset - startOffset
    return [result, bytesParsed]
  }
  throw new Error('Tried to read an invalid peppy string')
}

export { parseCollectionDb }