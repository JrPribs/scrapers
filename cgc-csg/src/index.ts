import { config } from 'dotenv';
import { padStart } from 'lodash';
import * as puppeteer from 'puppeteer';

config();

const baseURL = 'https://www.csgcards.com/certlookup';

const options = {
  headless: false,
  defaultViewport: null
};

(async () => {

  /* uncomment when main logic is completed

    const submissionNumber = await prompt({
      type: 'input',
      name: 'submissionNumber',
      message: 'What is the submission number?'
    });

    const totalCards = await prompt({
      type: 'input',
      name: 'totalCards',
      message: 'What is the submission numberHow many cards are in the submission?'
    });

  */

  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  /* TEMPORARY VARIABLES */
  const submissionNumber = '1020060';
  const cardNumber = '1';

  /* For each card in submission get the images */
  const certLookupURL = `${baseURL}/${submissionNumber}${padStart(cardNumber, 3, '0')}`;
  await page.goto(certLookupURL);
  await page.content();
  await timeout(500000);
  await page.screenshot({ path: 'results/screenshots/certPage.png' });

  const certInfo = await page.$$('div.related-info');
})();

function timeout(millis: number = 1000): Promise<any> {
  return new Promise(resolve => setTimeout(resolve, millis));
}
