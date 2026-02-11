import { ID3Writer } from "browser-id3-writer";
import { readFileSync, writeFileSync, readdirSync, copyFileSync } from "fs";
import { Shazam } from "node-shazam";
import download from "image-downloader";
// Dossier depot des fichiers mp3
const muzicDirectory = "./inputMuzicDir";

let muzicFiles = readdirSync(muzicDirectory);
console.log(muzicFiles);
const shazam = new Shazam();
const muzicPath = muzicDirectory + "/" + muzicFiles[0];
const recognise = await shazam.recognise(muzicPath, "en-US");
//console.log(recognise);
console.log(
  "track -----------------------------",
  recognise.track.title,
  recognise.track.subtitle,
  recognise.track.images.coverart,
);

// Recuperation de l'image
const options = {
  url: recognise.track.images.coverart,
  dest: "../../images/coverart.jpg",
};

await download
  .image(options)
  .then(({ filename }) => {
    console.log("Saved to", filename); // saved to /path/to/dest/image.jpg
  })
  .catch((err) => console.error(err));

const coverBuffer = readFileSync("./images/coverart.jpg");
const songBuffer = readFileSync(muzicPath);
console.log("recognise.track.images.coverart", recognise.track.images.coverart);

const writer = new ID3Writer(songBuffer);
writer
  .setFrame("TIT2", recognise.track.title)
  // .setFrame("TPE1", ["Eminem", "50 Cent"])
  .setFrame("TALB", recognise.track.subtitle)
  // .setFrame("TYER", 2004)
  .setFrame("APIC", {
    type: 3,
    data: coverBuffer,
    description: "Super picture",
  });
writer.addTag();

const taggedSongBuffer = Buffer.from(writer.arrayBuffer);
writeFileSync(
  `${recognise.track.subtitle} - ${recognise.track.title}.mp3`,
  taggedSongBuffer,
);
