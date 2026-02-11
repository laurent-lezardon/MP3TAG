import download from "image-downloader";
const options = {
  //url: "https://www.bdgest.com/critiques/images/bandeau/13257_b.jpg",
  url: "https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/a0/2b/53/a02b534b-1a80-3d4f-1daf-b2ad2f721c51/08UMGIM03150.rgb.jpg/400x400cc.jpg",
  dest: "../../images/",
};

download
  .image(options)
  .then(({ filename }) => {
    console.log("Saved to", filename); // saved to /path/to/dest/image.jpg
  })
  .catch((err) => console.error(err));
