// Not ideal, but getting the data we need from a data attr on the top level DOM element
const graphData = JSON.parse(document.getElementById("app").dataset.graph);

// A global index for switching data
let ACTIVE_INDEX = 0;
// The DOM element that will contain our charts
const CHART_CONTAINER = document.getElementById("charts");
// Show the charts on initial load
initCharts();
// When the dropdown changes, re-init the corresponding charts
$("#dropdown").on("change", function (event) {
  ACTIVE_INDEX = event.target.value;
  initCharts();
});

function initCharts() {
  // Empty the chart container
  CHART_CONTAINER.innerHTML = "";

  // Show a chart for each check
  for (let i = 0; i < graphData[ACTIVE_INDEX].nodes[0].checks.length; i++) {
    const check = graphData[ACTIVE_INDEX].nodes[0].checks[i];

    let data;

    // Feels clunky to do this, but moving ahead for lack of time
    switch (check.name) {
      case "Server Free Disk Space":
        data = {
          labels: ["Space Used", humanizeNumberInString(check.name)],
          dataset: [
            100 - roundNumber(getNumberFromString(check.message)),
            roundNumber(getNumberFromString(check.message)),
          ],
          // Determines green (I chose blue instead) or red based on state
          background:
            check.state && check.state === "green" ? "#00aeff" : "#c41f1f",
        };
        renderChartContainer(check);
        renderDonutChart(createIdFromName(check.name), data);
        break;
      case "Server Free System Memory":
        // Let's assume full capacity is 50,000 and work out a percentage
        data = {
          labels: ["Space Used", check.name],
          dataset: [
            50000 - roundNumber(getNumberFromString(check.message)),
            roundNumber(getNumberFromString(check.message)),
          ],
          background:
            check.state && check.state === "green" ? "#00aeff" : "#c41f1f",
        };
        renderChartContainer(check);
        renderDonutChart(createIdFromName(check.name), data);
        break;

      default:
    }
  }
}

// Simply renders the necessary DOM elements for rendering chart content
function renderChartContainer(checkData) {
  // I realise theres some bloat that could be avoided here with jQuery
  // Ironically did it this way for speed :/
  const singleChartElement = document.createElement("div");
  singleChartElement.classList.add("chart");

  const chartTitleElement = document.createElement("h3");
  chartTitleElement.innerText = checkData.name;
  singleChartElement.appendChild(chartTitleElement);

  const chartDescriptionElement = document.createElement("p");
  chartDescriptionElement.innerText = humanizeNumberInString(checkData.message);
  singleChartElement.appendChild(chartDescriptionElement);

  const chartCanvasContainer = document.createElement("div");
  chartCanvasContainer.id = createIdFromName(checkData.name);
  singleChartElement.appendChild(chartCanvasContainer);

  CHART_CONTAINER.appendChild(singleChartElement);
}

// Renders the chart itself in to the DOM
function renderDonutChart(containerId, chartData) {
  // We expect chartData to contain data according to Chart JS spec

  const chartCanvas = document.createElement("canvas");
  chartCanvas.id = `chart-${containerId}`;
  chartCanvas.width = "200";
  chartCanvas.height = "200";

  // Add chart canvas to the chart container
  const chartContainer = document.getElementById(containerId);
  chartContainer.appendChild(chartCanvas);

  var ctx = document.getElementById(chartCanvas.id).getContext("2d");

  // This seemed to be the easiest way to adjust the spacing between chart and legend
  // Reference:
  // https://stackoverflow.com/questions/42585861/chart-js-increase-spacing-between-legend-and-chart
  Chart.Legend.prototype.afterFit = function () {
    this.height = this.height + 30;
  };

  // Chart Js instance
  var myDoughnutChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: chartData.dataset,
          backgroundColor: [chartData.background],
        },
      ],

      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: chartData.labels,
    },
  });
}

// A helper to get the number we want, according to the unit
function getNumberFromString(string) {
  let number;
  // First split the string
  const arrayOfStrings = string.split(" ");
  // Here's an array of units to look for
  const arrayOfUnits = ["MB", "%", "ms"];
  // Loop the strings to look for units
  for (let string of arrayOfStrings) {
    for (let unit of arrayOfUnits) {
      if (string.includes(unit)) {
        const stringAsArray = string.split(unit);
        number = parseInt(stringAsArray[0]);
        break;
        // When the first unit is found, break out
      }
    }
  }
  return number;
}

// HELPERS

// Rounds a number with a decimal
function roundNumber(number) {
  return Math.round(number);
}

// Creates an id string from a name
function createIdFromName(string) {
  return string
    .replace(/\s{2,}/g, " ")
    .toLowerCase()
    .split(" ")
    .join("-");
}

// This is too similar to getNumberFromString and should be broken up
// Rounds the number within a string (message)
function humanizeNumberInString(string) {
  // First split the string
  const arrayOfStrings = string.split(" ");
  // Here's an array of units to look for
  const arrayOfUnits = ["MB", "%", "ms"];
  // Loop the strings to look for units
  const newStringArray = arrayOfStrings.map((string) => {
    for (let unit of arrayOfUnits) {
      if (string.includes(unit)) {
        const stringAsArray = string.split(unit);
        stringAsArray[0] = roundNumber(parseInt(stringAsArray[0])).toString();
        stringAsArray[1] = unit;
        string = stringAsArray.join("");
      }
    }
    return string;
  });

  return newStringArray.join(" ");
}
