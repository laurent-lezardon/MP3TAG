import { ID3Writer } from "browser-id3-writer";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { Shazam } from "node-shazam";
import download from "image-downloader";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const reset = "\x1b[0m";

const log = {
  green: (text) => console.log("\x1b[32m" + text + reset),
  red: (text) => console.log("\x1b[31m" + text + reset),
  blue: (text) => console.log("\x1b[34m" + text + reset),
  yellow: (text) => console.log("\x1b[33m" + text + reset),
};

const directory = dirname(fileURLToPath(import.meta.url));
const muzicDirectory = join(directory, "/inputMuzicDir");
let muzicFiles = readdirSync(muzicDirectory);

for (let i = 0; i < muzicFiles.length; i++) {
  if (muzicFiles[i].slice(-4) !== ".mp3") {
    console.error(`${muzicFiles[i]} is not a mp3 file`);
    continue;
  } else {
    const shazam = new Shazam();

    const muzicPath = join(muzicDirectory, muzicFiles[i]);

    // -------- recuperation des informations sur shazam
    const recognise = await shazam.recognise(muzicPath, "en-US");
    if (!recognise?.track) {
      console.log(muzicFiles[i], "-->", "!!!! shazam unknow");
      continue;
    }
    const { title, subtitle: artist, images } = recognise?.track;

    // -------- Recuperation de l'image via "image-downloader"
    const options = {
      url: images.coverart,
      dest: "../../images/coverart.jpg",
    };

    await download
      .image(options)
      .then(({ filename }) => {
        //console.log("Saved to", filename); // saved to /path/to/dest/image.jpg
      })
      .catch((err) => console.error(err));

    // ----------- creation du tag mp3
    const coverBuffer = readFileSync("./images/coverart.jpg");
    const songBuffer = readFileSync(muzicPath);
    const writer = new ID3Writer(songBuffer);
    writer
      .setFrame("TIT2", title)
      .setFrame("TALB", artist)
      .setFrame("APIC", {
        type: 3,
        data: coverBuffer,
        description: `${artist} - ${title}`,
      });
    writer.addTag();

    // ---------  Ecriture du fichier dans le dossier outputMuzicDir
    const taggedSongBuffer = Buffer.from(writer.arrayBuffer);
    writeFileSync(
      join(directory, "outputMuzicDir", `${artist} - ${title}.mp3`),
      taggedSongBuffer,
    );
    const logText = `${muzicFiles[i]} --> ${artist} - ${title}.mp3`;
    log.green(logText);
  }
}
