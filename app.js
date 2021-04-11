const axios = require('axios');
axios
    .get(
        'http://boxuntech.com/car/shhuafasiji/server.php?type=getallcare&zone=car1'
    )
    .then(({res, data}) => {
        const rawData = data.list;
        // queryNear39(rawData);
        // queryAll(rawData);
        // queryNear39TopStandard(rawData);
        queryNear39BottomStandardStandalone(rawData, 5);
        // queryNear39BottomStandard(rawData);
        // queryAllTop10Standard(rawData);
    });

function isNear39(code) {
    return code >= 157 && code <= 217;
}

function queryNear39(rawData) {
    let notRF = 0;
    let RF = 0;
    let standardNotRF = 0;
    let standardNotRFCode = [];
    for (const item of rawData) {
        const code = +item.code.replace('-', '.');
        if (!isNear39(code)) {
            continue;
        }
        if (item.exInfo.includes('(人防车位)')) {
            RF++;
        } else if (item.exInfo.includes('(非人防车位)')) {
            notRF++;
        }

        if (item.exInfo.includes('标准车位(非人防车位)')) {
            standardNotRF++;
            standardNotRFCode.push(item.code);
        }
    }
    console.log(`39附近：标准非人防:${standardNotRF}`, standardNotRFCode);
}
function queryAll(rawData) {
    let notRF = 0;
    let RF = 0;
    let standardNotRF = 0;
    let standardNotRFCode = [];
    for (const item of rawData) {
        const code = +item.code.replace('-', '.');

        if (isRF(item)) {
            RF++;
        } else {
            notRF++;
        }

        if (isStandard(item) && !isRF(item)) {
            standardNotRF++;
            standardNotRFCode.push(item.code);
        }
    }
    console.log(`全部：人防:${RF},非人防:${notRF},标准非人防:${standardNotRF}`);
}

// 39附近最多人选
function queryNear39TopStandard(rawData, rankTopNum = 10) {
    let arr = [];
    for (const item of rawData) {
        const code = +item.code.replace('-', '.');
        if (!isNear39(code)) {
            continue;
        }
        if (isStandard(item)) arr.push(item);
    }
    arr.sort((a, b) => (Number(a.cares) > Number(b.cares) ? -1 : 0));
    const sorted = arr
        .slice(0, rankTopNum)
        .map((item) => item.code + ':' + item.cares);
    console.log(`near 39 sorted standard:\n${sorted.join('\n')}`);
}

// 39附近最多人选独立
function queryNear39TopStandardStandalone(rawData, rankTopNum = 10) {
    let arr = [];
    for (const item of rawData) {
        const code = +item.code.replace('-', '.');
        if (!isNear39(code)) continue;
        if (!isStandalone(code)) continue;
        if (isStandard(item)) arr.push(item);
    }
    arr.sort((a, b) => (Number(a.cares) > Number(b.cares) ? -1 : 0));
    const sorted = arr
        .slice(0, rankTopNum)
        .map((item) => item.code + ':' + item.cares);
    console.log(`queryNear39TopStandardStandalone:\n${sorted.join('\n')}`);
}

// 39附近最少人选独立
function queryNear39BottomStandardStandalone(rawData, rankTopNum = 10) {
    let arr = [];
    for (const item of rawData) {
        const code = +item.code.replace('-', '.');
        if (!isNear39(code)) continue;
        if (!isStandalone(code)) continue;
        if (isStandard(item)) arr.push(item);
    }
    arr.sort((a, b) => (Number(a.cares) <= Number(b.cares) ? -1 : 0));
    const sorted = arr
        .slice(0, rankTopNum)
        .map((item) => item.code + ':' + item.cares);
    console.log(`queryNear39TopStandardStandalone:\n${sorted.join('\n')}`);
}

function isStandalone(code) {
    const targets = [157, 158, 161, 162, 163, 164, 167];
    return targets.includes(code);
}

// 39附近最少人选
function queryNear39BottomStandard(rawData) {
    let arr = [];
    for (const item of rawData) {
        const code = +item.code.replace('-', '.');
        if (!isNear39(code)) {
            continue;
        }
        if (isStandard(item)) arr.push(item);
    }
    arr.sort((a, b) => (Number(a.cares) <= Number(b.cares) ? -1 : 0));
    const sorted = arr.slice(0, 20).map((item) => item.code + ':' + item.cares);
    console.log(`near 39 bottom20 standard:\n${sorted.join('\n')}`);
}

function queryAllTop10Standard(rawData) {
    let arr = [];
    for (const item of rawData) {
        const code = +item.code.replace('-', '.');
        if (isStandard(item)) arr.push(item);
    }
    arr.sort((a, b) => (Number(a.cares) > Number(b.cares) ? -1 : 0));
    const top10 = arr.slice(0, 10).map((item) => item.code + ':' + item.cares);
    console.log(`All top10 standard:\n${top10.join('\n')}`);
}

// 标准车位
function isStandard(item) {
    return item.exInfo.includes('标准车位');
}

// 人防车位
function isRF(item) {
    return item.exInfo.includes('(人防车位)');
}
