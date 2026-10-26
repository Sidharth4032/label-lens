import {createWorker} from 'tesseract.js';
import {performance} from 'node:perf_hooks';
const start=performance.now();
const w=await createWorker('eng',1,{langPath:'./dist/vendor',cacheMethod:'none'});
await w.setParameters({tessedit_pageseg_mode:'11'});
console.log('Model initialization milliseconds:',Math.round(performance.now()-start));
for(let i=0;i<2;i++){const t=performance.now();const {data}=await w.recognize(process.argv[2]);console.log(JSON.stringify({run:i+1,elapsedMs:Math.round(performance.now()-t),confidence:data.confidence,text:data.text}));}
await w.terminate();
