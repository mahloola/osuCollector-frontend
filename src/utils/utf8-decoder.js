function decodeUtf8(uintArray) {
  let encodedString = String.fromCharCode.apply(null, Array.from(uintArray))
  let decodedString = decodeURIComponent(escape(encodedString))
  return decodedString
}

export { decodeUtf8 }
