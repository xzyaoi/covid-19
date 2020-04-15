import Papa from 'papaparse'

/** Constants */
const CONFIRMED_URL = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"
const RECOVERED_URL = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv"
const DEATHS_URL = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv"

function series_sum(a, b) {
    return a.map(function (item, index) {
        return parseInt(item) + parseInt(b[index])
    })
}

function parse_data(datatype, withRegion) {
    if (datatype === "CONFIRMED") {
        return _parse_data(CONFIRMED_URL, withRegion)
    } else if (datatype === "DEATHS") {
        return _parse_data(DEATHS_URL, withRegion)
    } else {
        return _parse_data(RECOVERED_URL, withRegion)
    }
}

function _parse_data(url, withRegion) {
    return new Promise((resolve, reject) => {
        Papa.parse(url, {
            download: true,
            error: function (err, file, inputElem, reason) {
                const message = 'error csv downloader & parser: ' + reason;
                console.error(message);
                reject(message);
            },
            complete: function (results) {
                const remoteData = results.data
                const remoteHeader = remoteData[0];
                const data = remoteData;
                const fullHeader = remoteHeader;
                let countries = new Set()
                const result = {
                    fullHeader,
                    data: [],
                    dayHeader: fullHeader.slice(4),
                };
                let sum = Array(fullHeader.slice(4).length).fill(0)
                for (let rowIdx = 1; rowIdx < data.length; ++rowIdx) {
                    const row = data[rowIdx];
                    if (row[0]==="") {
                        row[0]="All"
                    }
                    if (withRegion) {
                        countries.add(row[1])                        
                    }
                    const count = row.slice(4);
                    result.data.push(row)
                    sum = series_sum(count, sum)
                }
                countries.add("WorldWide")
                let global_count = ["All","WorldWide","",""]
                global_count = global_count.concat(sum)
                result.data.push(global_count)
                resolve({"result":result, "countries": countries})
            }
        })
    })
}

export {
    series_sum,
    parse_data
}