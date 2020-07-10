const path = require('path');
const PORT = process.env.PORT || 3000;
const $ = require('cheerio');
const express = require('express');
const ejs = require('ejs');
const app = express();
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
require('events').EventEmitter.defaultMaxListeners = 100;
const github_repos_list = ["devboilerplate", "github-dashboard", "twitter-user-profile", "gif-searcher", "popupkit", "workout-maker", "madlibs-game", "monthfoodplan", "blockscheduleplanner"];

if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));
  app.use('/', express.static(path.join(__dirname, '../client/build')));
}

let userstats = {
  github_followers: 0,
  github_stars: 0,
  github_contributions: 0,
  github_repos: 0
};

// GITHUB STARS ----------------------------------------------
for (let i = 0; i < github_repos_list.length; i++) {
  (async() => {
    const browser = await puppeteer.launch({
      'args' : [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });
    const page = await browser.newPage();
    await page.goto("https://github.com/BraydenTW/" + github_repos_list[i] + "/stargazers").then(function() {
      return page.content();
    }).then(function(html) {
      userstats.github_stars += parseInt($("#repos > div > nav > a.js-selected-navigation-item.selected.tabnav-tab > span", html).text());
    })
    await browser.close();
  })();
}

// GITHUB FOLLOWERS ----------------------------------------------

  (async() => {
    const browser = await puppeteer.launch({
      'args' : [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });
    const page = await browser.newPage();
    await page.goto("https://github.com/BraydenTW/").then(function() {
      return page.content();
    }).then(function(html) {
      userstats.github_followers += parseInt($("#js-pjax-container > div.container-xl.px-3.px-md-4.px-lg-5 > div > div.flex-shrink-0.col-12.col-md-3.mb-4.mb-md-0 > div > div.d-flex.flex-column > div.js-profile-editable-area.d-flex.flex-column.d-md-block > div.flex-order-1.flex-md-order-none.mt-2.mt-md-0 > div > a:nth-child(1) > span", html).text());
    })
    await browser.close();
  })();

  // GITHUB FOLLOWERS ----------------------------------------------
(async() => {
  const browser = await puppeteer.launch({
    'args' : [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });
  const page = await browser.newPage();
  await page.goto("https://github.com/BraydenTW?tab=repositories&q=&type=public&language=").then(function() {
    return page.content();
  }).then(function(html) {
    userstats.github_repos += parseInt($("#user-repositories-list > div > div.user-repo-search-results-summary.TableObject-item.TableObject-item--primary.v-align-top > strong:nth-child(1)", html).text());
  })
  await browser.close();
})();

// DRIBBBLE FOLLOWERS --------------------------------------------------
(async() => {
  const browser = await puppeteer.launch({
    'args' : [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });
  const page = await browser.newPage();
  await page.goto("https://github.com/braydentw").then(function() {
    return page.content();
  }).then(function(html) {
    userstats.github_contributions += parseInt($("#js-pjax-container > div.container-xl.px-3.px-md-4.px-lg-5 > div > div.flex-shrink-0.col-12.col-md-9.mb-4.mb-md-0 > div:nth-child(2) > div > div.mt-4.position-relative > div > div.col-12.col-lg-10 > div.js-yearly-contributions > div:nth-child(1) > h2", html).text());
  }).finally(function() {
    browser.close()
    console.log(userstats);
    app.get('*', (req, res) => {
      res.render('dashboard', {
        stats: userstats
      });
      res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
  })
})();

app.listen(PORT, () => {
  console.log(`Our app is running on port ${ PORT }`);
});