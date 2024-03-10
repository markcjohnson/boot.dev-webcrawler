const { crawlPage } = require('./crawl.js');
const { printReport } = require ('./report.js')

async function main(){
    const baseURL = process.argv[2]
    if (process.argv.length < 3 ) {
        throw new Error('Where is the url?');
    } else if (process.argv.length > 3) {
        throw new Error('Too many objects!');
    }
    else {
        const pages = await crawlPage(baseURL, baseURL, {});
        printReport(pages);
    }
  }
  
  main()