const fs = require('fs'),
      path = require('path'),
      puppeteer = require('puppeteer'),
      { spawnSync } = require('child_process');

// Get array of directories in path `p`
const dirs = p => fs.readdirSync(p).filter(f => fs.statSync(path.join(p, f)).isDirectory());

// Get products
let re = /<a([^>]*?)href\s*=\s*(['"])([^\2]*?)\2\1*>/gi;
const indexPath = path.join(__dirname, 'public/index.html');
const indexContent = fs.readFileSync(indexPath, { encoding: 'utf8' });
const productPaths = indexContent.match(re).map(p => p.replace(re, "$3").match(/([\w-]+)\/?$/).pop());

productPaths.map(async product => {
  puppeteer.launch({ headless: true }).then(async browser => {
    // Create output dirs
    const outputDir = path.join('pdf', product);
    fs.mkdirSync(outputDir, { recursive: true });

    // Get versions and work on them sequentially to save system resources
    const versions = dirs(path.join('public', product));
    for (const version of versions) {
      const i = versions.indexOf(version);
      console.log(`Generating PDFs for ${product.replace('-', ' ')} ${version}`);

      // Create temporary output dirs
      const tmpDir = path.join(outputDir, 'tmp', version);
      fs.mkdirSync(tmpDir, { recursive: true });

      const page = await browser.newPage();
      // Go to the product/version index.html (toc)
      await page.goto(`file://${path.resolve(path.join('public', product, version, 'index.html'))}`);
      const tocLinks = await page.$$eval('#toc li a', links => links.map(a => a.href));
      await Promise.all(tocLinks.map(async (section, i) => {
        try {
          const page = await browser.newPage();
          await page.goto(section);
          await page.emulateMedia('screen');
          await page.pdf({format: 'A4', path: `${tmpDir}/${i + 1}_${product}_${version}.pdf`});
          await page.close();
        } catch (e) {
          console.log(e);
        }
      }));
      await page.emulateMedia('screen');
      await page.pdf({format: 'A4', path: `${tmpDir}/${i}_${product}_${version}.pdf`});
      await page.close();
    }
    await browser.close();
  });
});


// const wkhtmltopdf = spawnSync('wkhtmltopdf', ['--help']);

// Output any errors
// console.error(wkhtmltopdf.stderr.toString());
// console.log( `stdout: ${wkhtmltopdf.stdout.toString()}` )

// puppeteer.launch().then(async browser => {
//   const page = await browser.newPage();
//   await page.goto('https://example.com');
//   await page.emulateMedia('screen');
//   await page.pdf({format: 'A4', path: 'page.pdf'});
//   await browser.close();
// });
