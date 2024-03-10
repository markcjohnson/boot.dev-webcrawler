function printReport(pages) {
    console.log('Report is starting...')
    let newPages = Object.entries(pages)
    newPages.sort((a, b) => b[1] - a[1]);
    for (const newPage of newPages) {
        console.log(`Saw ${newPage[1]} instances of the URL ${newPage[0]}`)
    }
}

module.exports = {
    printReport
  }