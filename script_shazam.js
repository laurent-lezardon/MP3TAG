//ESM
import MP3Tag from "mp3tag.js";
import fs from "fs";
import { Shazam } from "node-shazam";
import download from "image-downloader";

const muzicDirectory = "./inputMuzicDir";
const imageDirectory = "./images";
let muzicFiles = fs.readdirSync(muzicDirectory);
console.log(muzicFiles);
for (let i = 0; i < muzicFiles.length; i++) {
  const shazam = new Shazam();
  const muzicPath = muzicDirectory + "/" + muzicFiles[0];
  //console.log("muzikPath", muzicPath);
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
    dest: "../../images/",
  };

  download
    .image(options)
    .then(({ filename }) => {
      console.log("Saved to", filename); // saved to /path/to/dest/image.jpg
    })
    .catch((err) => console.error(err));
  const buffer = fs.readFileSync(muzicPath);
  const mp3tag = new MP3Tag(buffer);

  mp3tag.read();

  // Handle error if there's any
  if (mp3tag.error !== "") throw new Error(mp3tag.error);
  else {
    console.log(`Old Title ${mp3tag.tags.title}
   Old Title ${mp3tag.tags.title}
   //Old Artist ${mp3tag.tags.artist} `);
    mp3tag.tags.title = recognise.track.title;
    mp3tag.tags.artist = recognise.track.subtitle;

    mp3tag.save();
    mp3tag.read();
    console.log(`New Title ${mp3tag.tags.title}
   New Title ${mp3tag.tags.title}
   New Artist ${mp3tag.tags.artist} `);
    //console.log("mp3tag.tags.v1", mp3tag.tags.v2?.APIC);
    // Write the new buffer to file
    fs.writeFileSync(muzicPath, mp3tag.buffer);
  }
}
