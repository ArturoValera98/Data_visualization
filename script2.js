plotData();

// FUNCTION TO GET DATA
// choose values from specific column you want for the argument
async function getData() {
  const yearArr = [];
  const globalArr = [];
  const northernArr = [];
  const southernArr = [];

  const response = await fetch("nasa.csv");
  const data = await response.text();
  const table = data.split("\n").slice(1);

  table.forEach((row) => {
    const column = row.split(",");

    const year = column[0];
    yearArr.push(year);

    const global = column[1];
    globalArr.push(parseFloat(global) + 14);

    const northern = column[2];
    northernArr.push(parseFloat(northern) + 14);

    const southern = column[3];
    southernArr.push(parseFloat(southern) + 14);
  });

  return { yearArr, globalArr, northernArr, southernArr };
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// FUNCTION TO PLOT DATA
async function plotData() {
  const Data = await getData();
  const ctx = document.getElementById("chart").getContext("2d");

  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: Data.yearArr,
      datasets: [
        {
          label:
            "Combined Land-Surface Air and Sea-Surface Water Temperature in C°",
          data: Data.globalArr,
          backgroundColor: "red",
          borderColor: "red",
          borderWidth: 1,
          fill: false,
          hidden: false,
        },
        {
          label: "Northern Hemisphere in C°",
          labelColor: "white",
          data: Data.northernArr,
          backgroundColor: "blue",
          borderColor: "blue",
          borderWidth: 1,
          fill: false,
          hidden: true,
        },
        {
          label: "Southern Hemisphere in C°",
          data: Data.southernArr,
          backgroundColor: "green",
          borderColor: "green",
          borderWidth: 1,
          fill: false,
          hidden: true,
        },
      ],
    },
    options: {
      legend: {
        labels: {
          fontColor: "white",
          fontSize: 12,
        },
      },
      scales: {
        yAxes: [
          {
            ticks: {
              callback: function (value, index, values) {
                return value + "°";
              },
              fontColor: "white",
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              fontColor: "white",
            },
          },
        ],
      },
    },
  });
  return myChart;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// BUTTONS
document.getElementById("hide_northern").addEventListener("click", function () {
  let btn = document.getElementById("hide_northern");
  let bool = myChart.data.datasets[1].hidden;
  bool == false ? (bool = true) : (bool = false);
  myChart.data.datasets[1].hidden = bool;
  if (bool == false) {
    btn.innerHTML = "Hide Northern Hemisphere";
  } else {
    btn.innerHTML = "View Northern Hemisphere";
  }
  myChart.update();
});

document.getElementById("hide_southern").addEventListener("click", function () {
  let btn = document.getElementById("hide_southern");
  let bool = myChart.data.datasets[2].hidden;
  bool == false ? (bool = true) : (bool = false);
  myChart.data.datasets[2].hidden = bool;
  if (bool == false) {
    btn.innerHTML = "Hide Southern Hemisphere";
  } else {
    btn.innerHTML = "View Southern Hemisphere";
  }
  myChart.update();
});

document.getElementById("update_years").addEventListener("click", function () {
  let user_input = document.getElementById("user_input").value;
  bestUpdate(user_input);
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// UPDATE YEARS

async function bestUpdate(lastYearShown) {
  let values = myChart.data.labels;
  let targetYearIndex;
  let Data = await getData();
  let lastYear = myChart.data.labels.filter(Number).slice(-1)[0];
  let index = Data.yearArr.indexOf(lastYear);
  let ourIndex = Data.yearArr.indexOf(lastYearShown);

  if (lastYearShown < 1880 || lastYearShown > 2019) {
    alert("Year out of range");
  }

  if (values.includes(lastYearShown)) {
    for (let i = 0; i < values.length; i++) {
      if (values[i] == lastYearShown) {
        targetYearIndex = i + 1;
      }
    }
    myChart.data.labels.splice(targetYearIndex);
    myChart.update();
  } else {
    for (let i = index; i < ourIndex + 1; i++) {
      myChart.data.labels.push(Data.yearArr[i]);
      console.log(Data.yearArr[i]);
    }
    myChart.update();
  }
}
