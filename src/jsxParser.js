const fs = require("fs");

let fileData='';

fs.readFile('./App.js',function(err,data){
    if(err){
        console.log(err);
        return;
    }
    fileData=data.toString();
    const regexp = /(?<=(className\s*=\s*"))\s*[\w|-]+\s*(?=")/gi;
    let result = fileData.match(regexp);
    let outputData='';
    for(let item of result){
        let str ='';
        str = `.${item}{\n}\n`;
        outputData=outputData+str;
    }
    fs.writeFile('output.css',outputData,function(err){
        if(err) throw err;
        console.log('css done');
    });
});

