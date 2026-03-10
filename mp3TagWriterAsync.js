import { ID3Writer } from "browser-id3-writer";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { Shazam } from "node-shazam";
import download from "image-downloader";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const directory = dirname(fileURLToPath(import.meta.url));
const muzicDirectory = join(directory, "/inputMuzicDir");
const logWrongMP3s = [];
const logNoShazam = [];
const logSuccess = [];

const shazamFetch = async (muzicFile) => {
  const shazam = new Shazam();
  const muzicPath = join(muzicDirectory, muzicFile);

  // -------- recuperation des informations sur shazam
  try {
    const recognise = await shazam.recognise(muzicPath, "en-US");
    if (!recognise?.track) {
      logNoShazam.push(muzicFile);
      return;
    } else {
      console.log(recognise.track);
      const { title, subtitle: artist, images, key } = recognise?.track;
      const regex = /[^a-zA-Z0-9]/g;
      const newFileBaseName = `${title.replace(regex, " ")} - ${artist.replace(regex, " ")}`;
      //console.log({ title, artist, images });
      // -------- Recuperation de l'image via "image-downloader"
      const imgFileName = `${key}.jpg`;
      const options = {
        url: images.coverart,
        dest: join("../../images", imgFileName),
      };

      await download
        .image(options)
        .then(({ filename }) => {
          //console.log("Saved to", filename); // saved to /path/to/dest/image.jpg
        })
        .catch((err) => console.error("fail to download ", imgFileName));
      // ----------- creation du tag mp3
      const coverBuffer = readFileSync(join("./images", imgFileName));
      const songBuffer = readFileSync(muzicPath);
      const writer = new ID3Writer(songBuffer);
      writer
        .setFrame("TPE1", [artist]) // Artiste
        .setFrame("TIT2", title) // Titre
        .setFrame("APIC", {
          type: 3,
          data: coverBuffer,
          description: newFileBaseName,
        });
      writer.addTag();
      // ---------  Ecriture du fichier dans le dossier outputMuzicDir
      const taggedSongBuffer = Buffer.from(writer.arrayBuffer);
      writeFileSync(
        join(directory, "outputMuzicDir", `${newFileBaseName}.mp3`),
        taggedSongBuffer,
      );
      logSuccess.push(`${newFileBaseName}.mp3`);
    }
  } catch (error) {
    logNoShazam.push(muzicFile);
  }
};

// ================= Boucle principale

let muzicFiles = readdirSync(muzicDirectory);
const tagCreations = [];

for (let i = 0; i < muzicFiles.length; i++) {
  if (muzicFiles[i].slice(-4) !== ".mp3") {
    logWrongMP3s.push(muzicFiles[i]);
    //console.error(`${muzicFiles[i]} is not a mp3 file`);
    continue;
  } else {
    tagCreations.push(shazamFetch(muzicFiles[i]));
  }
}

// ============== Fin des actions asynchrones
Promise.all(tagCreations).then(() => {
  console.log("Results :");
  console.log("Wrong MP3", logWrongMP3s.length);
  console.table(logWrongMP3s);
  console.log("No Shazam entry", logNoShazam.length);
  console.table(logNoShazam);
  console.log("Success", logSuccess.length);
  console.table(logSuccess);
});
