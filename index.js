// external dependencies
const XLSX = require('xlsx');
const puppeteer = require('puppeteer');
const _ = require('underscore');

// internal dependencies
const Product = require('./classes/Product');
const images = require('./utils/images');

// excel file
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
            // wait 2s after going to page to ensure DOM availability
            await page.waitForTimeout(2000);
            // if its first time consent to gdpr
            if(i == 0 && j == 1) {
                const gdpr = await page.$('.gdpr_new_version');
                await gdpr.click();
            }
            const productsWrapper = await page.$$eval('div.box-products > div.normal-products > * > .inner', (products) => products.map((product) => product.innerText));
            const imgs = await page.$$eval('div.box-products > div.normal-products > * > .inner > .picture > a > img[src]', imgs => imgs.map(img => img.getAttribute('src')));
            const price = await page.$$eval('div.box-products > div.normal-products > * > .inner > .offer > .price-product > .price', div => div
                .filter(price => price.querySelector('sup'))
                .map(span => span.innerHTML)
            )

            // pt salvarea imaginilor local - de scos comentariile pe hosting
            // images.copyImageToDisk(imgs, id);

            const result = await productsWrapper;
            // if there is element in page, extract product information
            if(result.length > 0) {
                let product = new Product();
                product.setExternalId(data[i][j]["id-extern"]);
                product.setName(data[i][j]["nume-articol-scurt"]);
                product.setDescription(data[i][j]["nume-articol-lung"]);
                product.setUnit(data[i][j]["unitate-masura"]);
                imgs.map((img) => {
                    let filename = `https://idratherprogram.com/images/${id}.jpg`;
                    product.addImage(filename);
                })
                product.setMainCategory(data[i][j]["divizie-interna"]);
                product.addMainSubcategories(data[i][j]["gama-interna"]);
                product.addSecondaryCategory(data[i][j]["clasa-interna"]);
                product.addSecondarySubcategory(data[i][j]["subclasa-interna"]);
                let extractPriceInfo = price[0].split("<sup>");
                product.setPrice(extractPriceInfo[0]);
                product.setDecimals(extractPriceInfo[1].replace(/\D/g, ''));
                product.setFormattedPrice();
                product.setCurrency("lei");

                console.log(product);
            } else {
                console.log(`Product is not currently available on romstal with id ${id}! \n`);
            }
            await page.close();
        }
        await browser.close();
    }
})();