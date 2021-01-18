const graphData = JSON.parse(document.getElementById("app").dataset.graph);

console.log(graphData);

let ACTIVE_INDEX = 0;

initCharts();

$("#dropdown").on("change", function (event) {
  ACTIVE_INDEX = event.target.value;
  initCharts();
});

function initCharts() {
  for (let check of graphData[ACTIVE_INDEX].nodes[0].checks) {
    switch (check.name) {
      case "Server Free Disk Space":
        addChartToDom(check.name, "200/400");

        break;
      default:
        console.log("default");
    }
  }
}

function addChartToDom(name, data) {
  const element = document.createElement("div");
  element.className = name.toLowerCase().split(" ").join("-");
  element.innerText = data;

  document.body.appendChild(element);

  $("." + name.toLowerCase().split(" ").join("-")).peity("donut", {
    radius: 100,
    innerRadius: 70,
  });
}
