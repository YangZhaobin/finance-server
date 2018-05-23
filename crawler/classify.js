/*
 * @Author: yangzhaobin 
 * @Date: 2018-03-09 16:07:56 
 * @Last Modified by: yangzhaobin
 * @Last Modified time: 2018-05-14 16:18:11
 */

const EventProxy = require('eventproxy');
const ep = new EventProxy();

const Classification = require('../db/model/classification');
const Artical = require('../db/model/artical');
const segmentation = require('../utils/segmentation');

var result = [];

let tagsCount = 0;
let maxTagCount = 30;

// async function classify() {
//     let articals = await Artical.findAllArticalsNoPage();
//     let titles = articals.rows.map(item => {
//         return item.title;
//     });

//     let pos = {};
//     titles.forEach((title, index) => {
//         let arr = segmentation.segText(title);


//         arr.forEach(word => {
//             if (pos[word] !== undefined) {
//                 pos[word]++;
//             } else {
//                 result.push(word);
//                 pos[word] = 0;
//             }
//         });        
//     });


//     let chars = [];
//     for (let i = 0;i < tagsCount;i++) {
//         let max = getObjMax(pos);
//         chars.push(max);
//         pos[max['word']] = 0;
//     }
//     return chars;
// }

function getObjMax(obj) {
    let arr = [];
    for (let key in obj) {
        arr.push(obj[key]);
    }
    let max = Math.max.apply(null, arr);
    for (let key in obj) {
        if (obj[key] === max) {
           return {
               'word': key,
               'count': obj[key]
           }; 
        }
    }
}


async function classify() {
    ep.all('over', async () => {
        // 获取热点词
        let chars = [];
        for (let i = 0; i < tagsCount && i < maxTagCount; i++) {
            let max = getObjMax(pos);
            chars.push(max);
            pos[max['word']] = 0;
        }
        await Classification.addMultiTags(chars);  // 将热点词存储至数据库中
    });

    await Classification.deleteAllTags(); // 删除数据库中原有热点词
    let articals = await Artical.findAllArticalsNoPage();  // 获取数据库中所有文章标题
    let titles = articals.rows.map(item => {
        return item.title;
    });

    let pos = [];
    await segTitles(titles, pos, 0); // 对文章标题逐个进行分词操作
    // return chars;
};

async function segTitles(titles, pos, count) {
    try {
        let len = titles.length;
        if (count >= len - 1) {
            ep.emit('over');
            return;
        }
        let title = titles[count];
        let arr = await segmentation.segText(title, count);
        console.info(arr, count);
        arr.forEach(word => {
            if (pos[word] !== undefined) {
                pos[word]++;
            } else {
                result.push(word);
                tagsCount++;
                pos[word] = 1;
            }
        });       
        await segTitles(titles, pos, ++count);
    }
    catch (err) {
        await segTitles(titles, pos, ++count);
    }
};

exports.classify = classify;
