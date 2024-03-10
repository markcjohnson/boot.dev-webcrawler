const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function normalizeURL(url){
    const urlObj = new URL(url)
  let fullPath = `${urlObj.host}${urlObj.pathname}`
  if (fullPath.length > 0 && fullPath.slice(-1) === '/'){
    fullPath = fullPath.slice(0, -1)
  }
  return fullPath
}

function getURLsFromHTML(htmlBody, baseURL){
    const urls = []
    const dom = new JSDOM(htmlBody)
    const aElements = dom.window.document.querySelectorAll('a')
    for (const aElement of aElements){
      if (aElement.href.slice(0,1) === '/'){
        try {
          urls.push(new URL(aElement.href, baseURL).href)
        } catch (err){
          console.log(`${err.message}: ${aElement.href}`)
        }
      } else {
        try {
          urls.push(new URL(aElement.href).href)
        } catch (err){
          console.log(`${err.message}: ${aElement.href}`)
        }
      }
    }
    return urls
}

async function crawlPage(baseURL, currentURL, pages){
    const currentUrlObj = new URL(currentURL)
    const baseUrlObj = new URL(baseURL)
    if (baseUrlObj.hostname !== currentUrlObj.hostname) {
        return pages
    }
    const currentNormalizedURL = normalizeURL(currentUrlObj)
    if (currentNormalizedURL in pages) {
            pages[currentNormalizedURL] += 1
            return pages
    }
    else {
            pages[currentNormalizedURL] = 1
    }
    const fetchURL = await fetch(currentURL)
    const contentType = fetchURL.headers.get('content-type')
    console.log(`crawling ${currentURL}!`)
    if (fetchURL.status >= 400) {
        console.log('No access!!!!')
        return pages
    } else if (!contentType.includes('text/html')){
        console.log('Non-HTML content detected; skipping crawl.')
        return pages
    } else {
        try {
            const fetchURL = await fetch(currentURL)
            const newURLs = getURLsFromHTML(await fetchURL.text(), baseURL)
            for (const newURL of newURLs){
            pages = await crawlPage(baseURL, newURL, pages)
            }
            return pages   
        } catch (error) {
            console.log(`Unable to crawl ${currentURL}: ${error.message}`);
            return pages;
        }
        
    }
}   

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
  }