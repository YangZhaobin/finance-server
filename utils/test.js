

let segmentation = require('./segmentation');

let str = '特朗普口中的不会发生贸易战：我充满爱意的鞭笞你 你却甘之如饴';

// segmentation.segText(str, (arr) => {
//     console.info(arr);
// });

segmentation.segText(str).then(arr => {
    console.info(arr);
});

