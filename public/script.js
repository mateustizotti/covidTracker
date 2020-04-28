const url = 'https://covid19.mathdro.id/api';
const cases = [];

chartIt();

async function getData() {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    const confirmed = data.confirmed.value;
    const recovered = data.recovered.value;
    const deaths = data.deaths.value;

    console.log(confirmed, recovered, deaths);

    cases.push(confirmed);
    cases.push(recovered);
    cases.push(deaths);
};

async function chartIt() {
    await getData();
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Confirmed', 'Recovered', 'Deaths'],
            datasets: [{
                label: 'Confirmed',
                data: cases,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            },
            {
                label: 'Recovered',
                data: cases,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1
            }]
        },
        
    });
}