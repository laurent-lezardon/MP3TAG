import { ID3Writer } from "browser-id3-writer";
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { Shazam } from "node-shazam";
import download from "image-downloader";
// ------- Dossier depot des fichiers mp3
const muzicDirectory = "./inputMuzicDir";

let muzicFiles = readdirSync(muzicDirectory);
//console.log(muzicFiles);
for (let i = 0; i < muzicFiles.length; i++) {
  if (muzicFiles[i].slice(-4) !== ".mp3") {
    console.error(`${muzicFiles[i]} is not a mp3 file`);
    break;
  } else {
    const shazam = new Shazam();
    const muzicPath = muzicDirectory + "/" + muzicFiles[i];
    // -------- recuperation des informations sur shazam
    const recognise = await shazam.recognise(muzicPath, "en-US");
    //console.log(recognise?.track);
    const { title, subtitle: artist, images } = recognise.track;

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
    // creation du tag mp3
    const coverBuffer = readFileSync("./images/coverart.jpg");
    const songBuffer = readFileSync(muzicPath);
    //console.log("recognise.track.images.coverart", images.coverart);

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
    // Ecriture du fichier dans le dossier outputMuzicDir
    const taggedSongBuffer = Buffer.from(writer.arrayBuffer);
    writeFileSync(
      `./outputMuzicDir/${artist} - ${title}.mp3`,
      taggedSongBuffer,
    );
    console.log(muzicFiles[i], "-->", artist, " - ", title, "mp3");
  }
}
