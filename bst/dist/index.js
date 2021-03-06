"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
dotenv_1.config();
const puppeteer = require("puppeteer");
const baseUrl = 'https://bannedsextapes.com/members';
const loginUrl = `${baseUrl}/login/login.php?setupname=setup1&request=/members/?`;
const celebsUrl = `${baseUrl}/?page=celebs`;
(() => __awaiter(this, void 0, void 0, function* () {
    const browser = yield puppeteer.launch();
    const page = yield browser.newPage();
    yield page.goto(loginUrl);
    yield page.type('input[name="username"]', process.env.USERNAME, { delay: 100 });
    yield page.type('input[name="password"]', process.env.PASSWORD, { delay: 100 });
    yield page.click('input[name="send"]');
    yield page.goto(celebsUrl);
    yield page.screenshot({ path: 'results/screenshots/celebs.png' });
    const celebs = yield page.$$('.thumb-title > a');
    celebs.forEach(celeb => {
        console.log(celeb.toString());
    });
    yield browser.close();
}))();
//# sourceMappingURL=index.js.map