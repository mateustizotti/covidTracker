const url = 'https://covid19.mathdro.id/api';
const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];
const countries = [];
const confirmedRank = [];
var dates = [];
var dailyConfirmed = [];
var dailyDeaths = [];
var cases = [];
var countryNumbers = [];
var countryUpdated = [];

globalChartData = {
    labels: dates,
    datasets: [{
            label: 'Confirmed',
            data: dailyConfirmed,
            backgroundColor: 'rgba(54, 162, 235, 0.3)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        },
        {
            label: 'Deaths',
            data: dailyDeaths,
            backgroundColor: 'rgba(255, 99, 132, 0.3)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }
    ]
}

dummyData = {
    labels: [],
    datasets: [{
            label: 'Confirmed',
            data: [0],
            backgroundColor: 'rgba(54, 162, 235, 0.3)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        },
        {
            label: 'Deaths',
            data: [0],
            backgroundColor: 'rgba(255, 99, 132, 0.3)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }
    ]
}

var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: dummyData
});

chartIt();
cardIt();
getDataPicker();
populateRanks()

async function getDataChart() {
    const responseDaily = await fetch(`${url}/daily`);
    const dataDaily = await responseDaily.json();
    if (dates.length > 0) {
        dates = [];
    }
    for (let i = 0; i < dataDaily.length; i++) {
        let date = new Date(dataDaily[i].reportDate);
        let monthName = months[date.getMonth()];
        let day = date.getDate();
        let finalDate = `${monthName} ${day}`;

        dates.push(finalDate);
        dailyConfirmed.push(dataDaily[i].confirmed.total);
        dailyDeaths.push(dataDaily[i].deaths.total);
    }
};

async function getDataCards() {
    const response = await fetch(url);
    const data = await response.json();

    const responseDay = await fetch(`${url}/daily`);
    const dataDay = await responseDay.json();

    const totalConfirmed = data.confirmed.value;
    const totalRecovered = data.recovered.value;
    const totalDeaths = data.deaths.value;
    const updated = data.lastUpdate;

    const percRec = (totalRecovered * 100) / totalConfirmed;
    document.getElementById('recPerc').textContent = percRec.toFixed(2);

    const percDeath = (totalDeaths * 100) / totalConfirmed;
    document.getElementById('deathPerc').textContent = percDeath.toFixed(2);

    const outsideChina = dataDay[dataDay.length - 1].confirmed.outsideChina;
    const percOutChina = (outsideChina * 100) / totalConfirmed;
    document.getElementById('outChina').textContent = percOutChina.toFixed(2);

    document.getElementById('updatedConf').textContent = new Date(updated).toDateString();
    document.getElementById('updatedRec').textContent = new Date(updated).toDateString();
    document.getElementById('updatedDeaths').textContent = new Date(updated).toDateString();

    cases.push(totalConfirmed);
    cases.push(totalRecovered);
    cases.push(totalDeaths);

    return cases;
};

async function getDataPicker() {
    const response = await fetch(`${url}/countries`);
    const data = await response.json();
    const picker = document.getElementById('picker');

    for (let i = 0; i < data.countries.length; i++) {
        let newOption = new Option(data.countries[i].name, data.countries[i].iso2);
        picker.add(newOption, undefined);
    }
}

async function cardIt() {
    const data = await getDataCards();

    for (let i = 0; i < data.length; i++) {
        if (i == 0) {
            let el = document.getElementById('conf')
            el.textContent = data[i];
        } else if (i == 1) {
            let el = document.getElementById('rec')
            el.textContent = data[i];
        } else if (i == 2) {
            let el = document.getElementById('deaths')
            el.textContent = data[i];
        }
    }

}

async function chartIt(countryData) {
    if (countryData) {
        myChart.destroy();
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Confirmed', 'Recovered', 'Deaths'],
                datasets: [{
                    label: [],
                    data: countryNumbers,
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.3)',
                        'rgba(75, 192, 192, 0.3)',
                        'rgba(255, 99, 132, 0.3)'
                    ],

                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                legend: {
                    display: false
                }
            }
        });
    } else {
        myChart.destroy();
        await getDataChart();
        myChart = new Chart(ctx, {
            type: 'line',
            data: globalChartData
        });
    }
};

async function changeCountry() {
    let value = document.getElementById('picker').value;
    if (value != 'global') {

        const response = await fetch(`${url}/countries/${value}`);
        const data = await response.json();

        if (countryNumbers.length > 0) {
            countryNumbers = [];
        }

        countryNumbers.push(data.confirmed.value);
        countryNumbers.push(data.recovered.value);
        countryNumbers.push(data.deaths.value);

        const countryData = {
            countryNumbers
        }

        updateCards();
        chartIt(countryData);
    } else {
        chartIt();
        cardIt();
    }

}

function updateCards() {
    const confirmed = countryNumbers[0];
    const recovered = countryNumbers[1];
    const deaths = countryNumbers[2];

    let percRec = (recovered * 100) / confirmed;
    document.getElementById('recPerc').textContent = percRec.toFixed(2);

    let percDeath = (deaths * 100) / confirmed;
    document.getElementById('deathPerc').textContent = percDeath.toFixed(2);

    document.getElementById('conf').textContent = confirmed;
    document.getElementById('rec').textContent = recovered;
    document.getElementById('deaths').textContent = deaths;
}

function compare(a, b) {
    const valueA = a.confirmed;
    const valueB = b.confirmed;

    let comparison = 0;
    if (valueA > valueB) {
        comparison = 1
    } else if (valueA < valueB) {
        comparison = -1;
      }
      return comparison;
  }

async function getDataRank() {
    const response = await fetch(`${url}/countries/`);
    const data = await response.json();

    for (let i = 0; i < data.countries.length; i++) {
        countries.push(data.countries[i].name);
    }

    for (let i = 0; i < countries.length; i++) {
        let name = countries[i];
        try {
            let response = await fetch(`${url}/countries/${name}`);
            let data = await response.json();
            confirmedRank.push({
                'country': name,
                'confirmed': data.confirmed.value
            });
        } catch (error) {
            console.error(error);
        }
    }

    confirmedRank.sort(compare);
    confirmedRank.reverse();
    console.log(confirmedRank);
}

async function populateRanks() {
    await getDataRank();

    for (let i = 0; i < 5; i++) {
        document.getElementById(`${i+1}countryConfirmedName`).textContent = confirmedRank[i].country;
        document.getElementById(`${i+1}confirmedValue`).textContent = confirmedRank[i].confirmed;
    }
}