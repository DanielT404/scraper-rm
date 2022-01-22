const XLSX = require('xlsx');
const puppeteer = require('puppeteer');
const fetch = require('cross-fetch');
const fs = require('fs');
const _ = require('underscore');

function saveImageToDisk(url, filename){
    fetch(url)
    .then(res => {
        const dest = fs.createWriteStream(filename);
        res.body.pipe(dest)
    })
    .catch((err) => {
        console.log(err)
    })
}

var workbook = XLSX.readFile('articole-romstal.xlsx');
var worksheet = workbook.Sheets[workbook.SheetNames[0]];

const headers = ['id-extern', 'nume-articol-scurt', 'nume-articol-lung', 'unitate-masura', 'divizie-interna', 'gama-interna', 'clasa-interna', 'subclasa-interna'];
var data = XLSX.utils.sheet_to_json(worksheet, {header: headers});
data = _.chunk(data, 5000); // split data in multiple chunks of 5000 elements


(async () => {
    for(let i = 0; i < data.length; i++) {
        const browser = await puppeteer.launch();
        for(let j = 0; j < data[i].length; j++) {  
            // skip headers 
            if(i == 0 && j == 0) continue; 
            const page = await browser.newPage();
            let id = Buffer.from(data[i][j]["id-extern"].trim(), 'utf-8').toString();
            id = id.replace(" ", "%20%");
            console.log(`Articol ${id} - verificare romstal \n`);
            await page.goto(`https://www.romstal.ro/index.php?page=search&sn.q=${id}`);
            // if its first time consent to gdpr
            if(i == 0 && j == 1) {
                const gdpr = await page.$('.gdpr_new_version');
                await gdpr.click();
                // and wait for page to refresh with gdpr consent
                await page.waitForTimeout(1200);
            }
            // await page.screenshot({path: `example-${id}.png`});
            const productsWrapper = await page.$$eval('div.box-products > div.normal-products > * > .inner', (products) => products.map((product) => product.innerText));
            const imgs = await page.$$eval('div.box-products > div.normal-products > * > .inner > .picture > a > img[src]', imgs => imgs.map(img => img.getAttribute('src')));
            const price = await page.$$eval('div.box-products > div.normal-products > * > .inner > .offer > .price-product > .price', div => div
                .filter(price => price.querySelector('sup'))
                .map(span => span.innerHTML)
            )

            // pt salvarea imaginilor local - de scos comentariile pe hosting
            // imgs.map((img) => {
            //     let filename = `./images/${id}.jpg`;
            //     saveImageToDisk(img, filename);
            // })

            const result = await productsWrapper;
            // if there is element in page, extract product information
            if(result.length > 0) {
                let productInfo = result[0].split("\n");
                console.log(productInfo);
                console.log(imgs);
                console.log(price);
            } else {
                console.log(`Product is not currently available on romstal with id ${id}! \n`);
            }
            page.close();
        }
        await browser.close();
    }
})();

// (async () => {
//     const browser = await puppeteer.launch();
//     // first 5000 products for testing - TODO: data variable to be split in multiple chunks of 5000 elements
//     for(let i = 1; i < 5000; i++) {    
//         const page = await browser.newPage();
//         let id = Buffer.from(data[i]["id-extern"].trim(), 'utf-8').toString();
//         console.log(`Articol ${id} - verificare romstal \n`);
//         await page.goto(`https://www.romstal.ro/index.php?page=search&sn.q=${id}`);
//         // if its first time consent to gdpr
//         if(i == 1) {
//             const gdpr = await page.$('.gdpr_new_version');
//             await gdpr.click();
//             // and wait for page to refresh with gdpr consent
//             await page.waitForTimeout(1200);
//         }
//         // await page.screenshot({path: `example-${id}.png`});
//         const productsWrapper = await page.$$eval('div.box-products > div.normal-products > * > .inner', (products) => products.map((product) => product.innerText));
//         const imgs = await page.$$eval('div.box-products > div.normal-products > * > .inner > .picture > a > img[src]', imgs => imgs.map(img => img.getAttribute('src')));
//         const price = await page.$$eval('div.box-products > div.normal-products > * > .inner > .offer > .price-product > .price', div => div
//             .filter(price => price.querySelector('sup'))
//             .map(span => span.innerHTML)
//         )
//         // imgs.map((img) => {
//         //     let filename = `./images/${id}.jpg`;
//         //     saveImageToDisk(img, filename);
//         // })
//         const result = await productsWrapper;
//         // if there is element in page, extract product information
//         if(result.length > 0) {
//             let productInfo = result[0].split("\n");
//             console.log(productInfo);
//             console.log(imgs);
//             console.log(price);
//         } else {
//             console.log(`Product is not currently available on romstal with id ${id}! \n`);
//         }
//         page.close();
//     }
//     await browser.close();
//   })();