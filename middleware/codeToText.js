const fs = require('fs')

let readData;
exports.readCodeFile = async function readCodeFile(path) {
    return await fs.promises.readFile(path, 'utf8').then((data)=>{
        data = data.replace(/</g, '&lt;')
        data = data.replace(/>/g, '&gt;');
        return data;
    });
}