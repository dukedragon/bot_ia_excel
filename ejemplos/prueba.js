import fs from "fs-extra"
import * as fileType from 'file-type';
let media =  fs.readFileSync("./output.mp3")
let type = await fileType.fileTypeFromBuffer(media)
console.log(media,type)