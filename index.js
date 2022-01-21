if(typeof require !== 'undefined') XLSX = require('xlsx');
const puppeteer = require('puppeteer');

var workbook = XLSX.readFile('articole-romstal.xlsx');
var worksheet = workbook.Sheets[workbook.SheetNames[0]];

const headers = ['id-extern', 'nume-articol-scurt', 'nume-articol-lung', 'unitate-masura', 'divizie-interna', 'gama-interna', 'clasa-interna', 'subclasa-interna']
var data = XLSX.utils.sheet_to_json(worksheet, {header: headers});

(async () => {
    const browser = await puppeteer.launch();
    // first 5000 products for testing - TODO: data variable to be split in multiple chunks of 5000 elements
    for(let i = 1; i < 5000; i++) {    
        const page = await browser.newPage();
        let id = data[i]["id-extern"];
        console.log(`Articol ${id} - verificare romstal`);
        await page.goto(`https://www.romstal.ro/index.php?page=search&sn.q=${id}`);
        // if its first time consent to gdpr
        if(i == 1) {
            const gdpr = await page.$('.gdpr_new_version');
            await gdpr.click();
        }
        // await page.screenshot({path: `example-${id}.png`});
        const productsWrapper = await page.$$eval('div.box-products > div.normal-products > .product > .inner', (products) => products.map((product) => product.innerText));
        const result = await productsWrapper;
        console.log(result);
    }
    await browser.close();
  })();