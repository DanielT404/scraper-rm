const fetch = require('cross-fetch');
const fs = require('fs');

const saveImageToDisk = (url, filename) => {
    fetch(url)
    .then(res => {
        const dest = fs.createWriteStream(filename);
        res.body.pipe(dest)
    })
    .catch((err) => {
        console.log(err)
    })
}

const copyImageToDisk = (imgs, id) => {
    imgs.map((img, idx) => {
        let filename = `./images/rm-scraper/${id}-${idx}.jpg`;
        saveImageToDisk(img, filename);
    })
}

exports.copyImageToDisk = copyImageToDisk;