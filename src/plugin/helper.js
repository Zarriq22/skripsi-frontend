export function formatUploadFileData(fileData) {
  var mime = fileData.split(':')[1]
  var mimeClean = mime.split(';')[0]
  var base64data = fileData.split(',')[1]

  var result = {
    mime: mimeClean,
    base64data: base64data,
  }

  return result
}

export function formatNumber(number) {
  if (!number) return 0
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}