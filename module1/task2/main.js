import fs from 'fs'; 
import csv from 'csvtojson';
import { PassThrough } from 'stream';

const writeInDB = (data) => {
    return new Promise((resolve) => {
        setTimeout(() => { resolve(data) }, 1000) 
    })
}

const csvFile = './task2/csv/node_mentoring_t1_2_input_example.csv';
const txtFile = './task2/result/result.txt';

const readStream = fs.createReadStream(csvFile);
const parseCsvStream = readStream.pipe(csv({ ignoreColumns: /amount/ig }));

const writeInBDStream = new PassThrough();

writeInBDStream.on('data', async function(data) {
    await writeInDB(data);
})

const writeToFileStream = fs.createWriteStream(txtFile, { flag: 'a' });

parseCsvStream.pipe(writeInBDStream);
parseCsvStream.pipe(writeToFileStream);
