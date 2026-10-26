import {copyFileSync,readdirSync,mkdirSync} from 'node:fs';
mkdirSync('dist/vendor',{recursive:true});
for(const file of ['tesseract.min.js','worker.min.js','tesseract.min.js.LICENSE.txt','worker.min.js.LICENSE.txt'])copyFileSync('node_modules/tesseract.js/dist/'+file,'dist/vendor/'+file);
for(const file of readdirSync('node_modules/tesseract.js-core'))if(file.endsWith('.wasm.js')||file.endsWith('.wasm')||file==='LICENSE')copyFileSync('node_modules/tesseract.js-core/'+file,'dist/vendor/'+file);
copyFileSync('node_modules/@tesseract.js-data/eng/4.0.0/eng.traineddata.gz','dist/vendor/eng.traineddata.gz');
