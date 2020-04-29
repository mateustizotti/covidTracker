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
]

chartIt();
cardIt();

async function getDataChart() {
    const dates = [];
    const dailyConfirmed = [];
    const dailyDeaths = [];

    const responseDaily = await fetch(`${url}/daily`);
    const dataDaily = await responseDaily.json();


    for (let i = 0; i < dataDaily.length; i++) {
        let date = new Date(dataDaily[i].reportDate);
        let monthName = months[date.getMonth()];
        let day = date.getDate();
        let finalDate = `${monthName} ${day}`;

        dates.push(finalDate);
        dailyConfirmed.push(dataDaily[i].confirmed.total);
        dailyDeaths.push(dataDaily[i].deaths.total);
    }

    return {
        dates,
        dailyConfirmed,
        dailyDeaths
    };
};

async function getDataCards() {
    const cases = [];

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

async function chartIt() {
    const data = await getDataChart();
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.dates,
            datasets: [{
                    label: 'Confirmed',
                    data: data.dailyConfirmed,
                    backgroundColor: 'rgba(54, 162, 235, 0.3)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Deaths',
                    data: data.dailyDeaths,
                    backgroundColor: 'rgba(255, 99, 132, 0.3)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
    });
};