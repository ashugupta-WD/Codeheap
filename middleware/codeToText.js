const fs = require('fs/promises')

let readData;
exports.readCodeFile = async function readCodeFile(path, callback) {
    let data = await fs.readFile(path, 'utf8', (res, err) => {
        if (err) { console.log(err) }
        else {
            return callback(res);
        }
    });
    readData = callback(data);
    data = readData.replace(/</g, '&lt;')
    data = data.replace(/>/g, '&gt;');
    return data;
}