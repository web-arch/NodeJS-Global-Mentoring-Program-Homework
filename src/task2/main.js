import fs from 'fs'; 
import csv from 'csvtojson';
import { pipeline } from 'stream';

const csvFile = 'src/task2/csv/node_mentoring_t1_2_input_example.csv';
const txtFile = 'src/task2/result/result.txt';

const readStream = fs.createReadStream(csvFile);
const writeStream = fs.createWriteStream(txtFile, { flag: 'a' });

pipeline(
    readStream,
    csv({ ignoreColumns: /amount/ig }),
    writeStream,
    (err) => {
        if(err) {
            console.error(err);
        } else {
            console.log('Success')
        }
        
    }
);
