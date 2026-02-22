# ShazamMp3Tag

retrouve les informations titre, artiste et image (coverart) d'une muzic mp3 et les ecrit sur une copie du fichier.

## Utilisation

Les fichiers mp3 a tager doivent être déposés dans le répertoire **inputMuzicDir**. Le script crée des copies avec les nouveaux tag mp3 dans le dossier **outputDir**.

Les fichiers sont renommés sous la forme "artiste - titre"

3 types de log :

> 1. inconnu shazam : **_nom fichier_** --> !!!! shazam unknow
> 2. fichier non .mp3 : **_nom fichier_** is not a mp3 file
> 3. succes : **_nom fichier_** --> **_artiste_** - **_titre_**

## Remerciements

Le script s'appuie sur le travail des developpeurs des package npm :

- browser-id3-writer
- node-shazam
- image-downloader

Un grand merci a eux ❤
