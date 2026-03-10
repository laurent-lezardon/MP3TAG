# ShazamMp3Tag

retrouve les informations titre, artiste et image (coverart) d'une muzic mp3 et les ecrit sur une copie du fichier .

## Utilisation

Les fichiers mp3 a tager doivent être déposés dans le répertoire **inputMuzicDir**. Le script crée des copies avec les nouveaux tag mp3 dans le dossier **outputDir**.

Les fichiers sont renommés sous la forme "artiste - titre"

### script synchrone mp3TagWriter.js

⚠ Base de travail, script non abouti

3 types de log :

> 1. inconnu shazam (en jaune) : **_nom fichier_** --> !!!! shazam unknow
> 2. fichier non .mp3 (en rouge) : **_nom fichier_** is not a mp3 file
> 3. succes (en vert) : **_nom fichier_** --> **_artiste_** - **_titre_**

### script asynchrone mp3TagWriterAsync.js

Presentation des logs sous forme de tableaux
Results :
Wrong MP3 0

| (index) |
| :-----: |
|         |

No Shazam entry 0
| (index) |
|:--------:|
||

Success 2
| (index) | Values |
|:--------|:---------|
| 0 | "I Don't Believe In You (1997 - Remaster) - Talk Talk.mp3" |
| 1 | 'The Seed - Joep Pelt.mp3'|

## Remerciements

Le script s'appuie sur le travail des developpeurs des package npm :

- browser-id3-writer (https://www.npmjs.com/package/browser-id3-writer)
- node-shazam
- image-downloader
  > Un grand merci a eux ❤

## Problèmes

Pour un nombre de fichiers d'entrée supérieur a 10, il arrive que shazam envoie : 429 Too Many Requests (shazam)
