function fetchData(callback) {
    setTimeout(() => {
        callback('peanut butter');
    }, 1000);
}
module.exports = fetchData;