import { config } from 'dotenv';
config();
import * as puppeteer from 'puppeteer';
import axios from 'axios';
import { get } from 'lodash-es';
import { timer, from, Observable, of } from 'rxjs';
import { switchMap, catchError, map, skipWhile, take } from 'rxjs/operators';

const baseUrl = 'https://www.publicnoticevirginia.com/Search.aspx';

(async () => {

  const options = {
    headless:false,
    defaultViewport: null,
    slowMo: 10
  };

  const browser = await puppeteer.launch(options);

  const page = await browser.newPage();

  await page.goto(baseUrl);

  // await timeout(1000);
``
  await page.type('.wsTextBox', 'auction storage', { delay: 100 });

  await page.click('#ctl00_ContentPlaceHolder1_as1_divDateRange');

  await page.click('#ctl00_ContentPlaceHolder1_as1_rbLastNumDays');

  const params = {
    method: 'userrecaptcha',
    key: process.env.CAPTCHA_API_KEY,
    googlekey: process.env.GOOGLE_SITEKEY,
    pageurl: 'https://www.publicnoticevirginia.com/Search.aspx',
    json: 1
  };

  const captchaResult = await from(axios.post('http://2captcha.com/in.php', {}, { params }))
    .pipe(
      map(({ data }) => {
        const requestId = get(data, 'request');

        if (requestId) {
          console.log('requestId', requestId);
          return requestId;
        } else {
          throw new Error(data);
        }
      }),
      switchMap(checkCaptchaStatus),
      catchError(err => {
        console.error('AWW NAW SOMETHING HAPPENED:', err);
        return of();
      })
    ).toPromise();

  await page.evaluate(`document.getElementById("g-recaptcha-response").innerHTML="${captchaResult}";`);

  // click the search button
  await page.click('#ctl00_ContentPlaceHolder1_as1_btnGo');

  await timeout(5000);

  await page.select('#ctl00_ContentPlaceHolder1_WSExtendedGridNP1_GridView1_ctl01_ddlPerPage', '50');

  await timeout(5000);

  const notices = await page.evaluate(() => [ ...document.querySelectorAll('table.nested')]
    .reduce(buildNoticeCollection, []));

  console.log('notices', notices);

})();

function buildNoticeCollection(noticeObjs, noticeEl): any[] {
  const link = noticeEl.querySelector('.viewButton')
    .getAttribute('onclick')
    .replace(/.*.href='(.*)'.*/, '$1');

  const id = link.split('&ID=')[1];

  let [ publication, date ] = (<any>noticeEl.querySelector('.left')).innerText.split('\n');

  const postDate = new Date(date).toISOString();

  noticeObjs.push({ content: '', postDate, id, link, publication });

  return noticeObjs
}

function checkCaptchaStatus(requestId: string): Observable<string> {
  return timer(0, 2500)
    .pipe(
      switchMap(() => axios.get(`http://2captcha.com/res.php?key=${process.env.CAPTCHA_API_KEY}&action=get&id=${requestId}&json=1`)),
      skipWhile(({ data: { status } }) => status === 0),
      map(({ data }) => data.request),
      take(1)
    );
}

function timeout(millis: number = 1000): Promise<any> {
  return new Promise(resolve => setTimeout(resolve, millis));
}
