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

var dates = [];
var dailyConfirmed = [];
var dailyDeaths = [];
var cases = [];
var countryConfirmed = [];
var countryRecovered = [];
var countryDeaths = [];
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

countryChartData = {
    labels: ['Confirmed', 'Recovered', 'Deaths'],
    datasets: [{
            label: 'Confirmed',
            data: [countryConfirmed],
            backgroundColor: 'rgba(54, 162, 235, 0.3)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        },
        {
            label: 'Recovered',
            data: [countryRecovered],
            backgroundColor: 'rgba(54, 162, 235, 0.3)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        },
        {
            label: 'Deaths',
            data: [countryDeaths],
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

async function getDataChart() {
    const responseDaily = await fetch(`${url}/daily`);
    const dataDaily = await responseDaily.json();
    console.log(dataDaily);
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
            data: countryChartData
        });

    } else {
        await getDataChart();
        myChart.destroy();
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

        const countryConfirmed = [];
        const countryRecovered = [];
        const countryDeaths = [];

        countryConfirmed.push(data.confirmed.value);
        countryRecovered.push(data.recovered.value);
        countryDeaths.push(data.deaths.value);
        const countryUpdated = new Date(data.lastUpdate).toDateString();

        const countryData = {
            countryConfirmed,
            countryRecovered,
            countryDeaths,
            countryUpdated
        }

        updateCards(countryData);
        chartIt(countryData);
    } else {
        chartIt();
        cardIt();
    }

}

function updateCards(countryData) {
    const confirmed = countryData.countryConfirmed;
    const recovered = countryData.countryRecovered;
    const deaths = countryData.countryDeaths;
    const updated = countryData.countryUpdated;

    let percRec = (recovered * 100) / confirmed;
    document.getElementById('recPerc').textContent = percRec.toFixed(2);

    let percDeath = (deaths * 100) / confirmed;
    document.getElementById('deathPerc').textContent = percDeath.toFixed(2);

    document.getElementById('conf').textContent = confirmed;
    document.getElementById('rec').textContent = recovered;
    document.getElementById('deaths').textContent = deaths;

    document.getElementById('updatedConf', 'updatedRec', 'updatedDeaths').textContent = updated;
}

function updateChart(countryData) {

}