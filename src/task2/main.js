const fs = require('fs'); 
const csv = require('csvtojson');

const csvFile = 'src/task2/csv/node_mentoring_t1_2_input_example.csv';
const txtFile = 'src/task2/result/result.txt';

const readStream = fs.createReadStream(csvFile);
const writeStram = fs.createWriteStream(txtFile, {
    flag: 'a'
})

readStream.on('error', function(error){
    console.log(error);
})
writeStram.on('error', function(error){
    console.log(error);
})

csv()
    .fromStream(readStream)
    .subscribe((json)=>{
        return new Promise((resolve,reject)=>{
            const string = JSON.stringify(json);
            writeStram.write(string + '\n'); 
            resolve();
        })
    });
