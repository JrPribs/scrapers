import { config } from 'dotenv';
config();
import * as puppeteer from 'puppeteer';

const baseUrl = 'https://bannedsextapes.com/members';
const loginUrl = `${baseUrl}/login/login.php?setupname=setup1&request=/members/?`;
const celebsUrl = `${baseUrl}/?page=celebs`;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(loginUrl);

  await page.type('input[name="username"]', process.env.USERNAME, { delay: 100 });
  await page.type('input[name="password"]', process.env.PASSWORD, { delay: 100 });

  await page.click('input[name="send"]');

  await page.goto(celebsUrl);

  await page.screenshot({ path: 'results/screenshots/celebs.png' });

  const celebs = await page.$$('.thumb-title > a');

  celebs.forEach(celeb => {
    console.log(celeb.toString());
  });

  await browser.close();
})();
