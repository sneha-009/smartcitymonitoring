const csvFileUrl = "http://172.25.31.26:8000/sensor_data.csv";

let temperatureChart;
let labels = [];
let temperatureData = [];
let humidityData = [];

async function fetchData() {
    try {
        const response = await fetch(csvFileUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.text();
        const rows = data.split("\n").filter(row => row.trim() !== ""); // Filter out empty rows

        if (rows.length < 2) {
            console.error("CSV has no valid data rows!");
            return;
        }

        
        labels = [];
        temperatureData = [];
        humidityData = [];

        rows.forEach((row, index) => {
            if (index === 0) return; 

            const [timestamp, temperature, humidity] = row.split(",").map(field => field.trim());

            
            if (!timestamp || isNaN(temperature) || isNaN(humidity)) {
                console.warn("Invalid row skipped:", row);
                return;
            }

           
            if (index === 1) {
                document.getElementById("temperature").innerText = `${parseFloat(temperature).toFixed(1)}°`;
                document.getElementById("humidity").innerText = `${parseFloat(humidity).toFixed(1)}%`;
            }

           
            labels.push(timestamp);
            temperatureData.push(parseFloat(temperature));
            humidityData.push(parseFloat(humidity));
        });

       
        updateChart();
    } catch (error) {
        console.error("Error fetching or parsing CSV data:", error);
    }
}

function createChart() {
    const ctx = document.getElementById("temperatureChart").getContext("2d");
    temperatureChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Temperature (°C)",
                    data: temperatureData,
                    borderColor: "rgba(255, 99, 132, 1)",
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    fill: true,
                },
                {
                    label: "Humidity (%)",
                    data: humidityData,
                    borderColor: "rgba(54, 162, 235, 1)",
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    fill: true,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Timestamp",
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: "Value",
                    },
                },
            },
        },
    });
}

function updateChart() {
    if (!temperatureChart) {
        createChart(); 
    } else {
        
        temperatureChart.data.labels = [...labels];
        temperatureChart.data.datasets[0].data = [...temperatureData];
        temperatureChart.data.datasets[1].data = [...humidityData];
        temperatureChart.update(); 
}


fetchData();
setInterval(fetchData, 5000);
}
