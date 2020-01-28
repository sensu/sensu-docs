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

puppeteer.launch({ headless: true }).then(async browser => {
  productPaths.forEach(p => {
    // Create output dir
    const outputDir = path.join('pdf', p);
    fs.mkdirSync(outputDir, { recursive: true });

    // Get versions
    const versions = dirs(path.join('public', p));
    versions.forEach(async v => {
      // const productVersionPath = path.resolve(path.join('public', p, v));

      const page = await browser.newPage();
      // Go to the product/version index.html (toc)
      await page.goto(`file://${path.resolve(path.join('public', p, v, 'index.html'))}`);
      // 
      const tocLinks = await page.$$eval('#toc li a', links => links.map(a => a.href));
      await page.emulateMedia('screen');
      await page.pdf({format: 'A4', path: `${outputDir}/${p}_${v}.pdf`});
      await page.close();
    });
  });
  // await browser.close();
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
