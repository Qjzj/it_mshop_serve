/**
 * @Author QJ
 * @date 2019--18 10:50
 * @desc reptile.js
 */
const express = require('express');
const superagent = require('superagent');
const charset = require('superagent-charset');
charset(superagent);
const Nightmare = require('nightmare');      // 等待js加载之后爬取内容
const nightmare = Nightmare({show: true});
const cheerio = require('cheerio');   // 处理爬出来的dom操作
const eventProxy = require('eventproxy');
const ep = eventProxy();
const async = require('async');
// superagent.buffer({
//     mime: true
// });

const router = express.Router();

const allNewMovies = [];

router.get('/', (req, res, next) => {
    const baseUrl = 'https://www.dytt8.net/';

    superagent.get(baseUrl).charset('gb2312').end((err, resource) => {
        const content = resource.text;
        const $ = cheerio.load(content);
        getAllNewMovies($);

        ep.emit('get_top', allNewMovies);
    });

    ep.after('get_top', 1, (allNewMovies) => {

    });



    /**
     * 使用nightmare 来爬取需要js加载的内容
     */
    // nightmare.goto('http://news.baidu.com/').wait().evaluate(()=>document.querySelector('body').innerHTML).end().then((res) => {
    //     getData(res)
    // }).catch((err) => console.log(err));






    res.end('<h2>Hello</h2>')
});

/**
 * 获取加载内容
 * @param res
 */
function getData(res) {
    const hotNews = [];
    const localNews = [];
    const $ = cheerio.load(res);
    $('#pane-news li a').each((index, item) => {
        const ITEM = {
            link: $(item).attr('href'),
            title: $(item).text()
        };

        hotNews.push(ITEM);
    });

    $('#localnews-focus li a').each((index, item) => {
        const ITEM = {
            link: $(item).attr('href'),
            title: $(item).text()
        };

        localNews.push(ITEM);
    });
    console.log(hotNews);
    console.log(localNews);

    console.log(hotNews.length);
    console.log(localNews.length);
}

function getAllNewMovies($) {
    const $moviesItem = $('.bd3l .co_area2:last-child .co_content2 ul a');
    console.log($moviesItem.length);
    // const hrefArr = [];
    for(let i=1, len=$moviesItem.length; i<len; i++) {
        let href = $moviesItem.eq(i).attr('href');
        let title = $moviesItem.eq(i).text();
        if(!allNewMovies.some(value => value.href === href)) {
            allNewMovies.push({
                title,
                href
            });
        }
    }
}




module.exports = router;
