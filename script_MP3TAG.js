import MP3Tag from "mp3tag.js";
import fs from "fs";
const buffer = fs.readFileSync("./Feist - I Feel it all.mp3");
const mp3tag = new MP3Tag(buffer);

mp3tag.read();

// Handle error if there's any
if (mp3tag.error !== "") throw new Error(mp3tag.error);
else {
  console.log(mp3tag.tags);
  mp3tag.tags.title = "NEW TITLE";
  mp3tag.tags.artist = "NEW ARTIST";
  mp3tag.tags.album = "NEW ALBUM";
  mp3tag.save();
  mp3tag.read();
  console.log("apres changemet", mp3tag.tags);
  // Write the new buffer to file
  fs.writeFileSync("./Feist - I Feel it all.mp3", mp3tag.buffer);
}
