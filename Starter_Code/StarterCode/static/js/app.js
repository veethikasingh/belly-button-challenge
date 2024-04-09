// The url with data
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"
const dataPromise = d3.json(url)
console.log("Data Promise: ", dataPromise)

// Fetch the JSON data 
d3.json(url).then(function(data) {
  console.log("data", data)
})

// Save the drop down
let dropdownMenu = d3.select("#selDataset")

//build data use index values

var demo_data
var chart_data

d3.json(url).then(function(data) {
  let selector = d3.select("#selDataset");
  demo_data = data.metadata;
  chart_data = data.samples;
  data.names.forEach((id) => {
    selector.append("option").text(id).property("value",id);
  })
  getmetaData(demo_data[0]);
  gethbarChart(chart_data[0]);
  getbubbleChart(chart_data[0]);
}); 

//for updating value from index 
function optionChanged(value){
  const selection = demo_data.find((item) => item.id === value);
  const demoinfo = chart_data.find((item) => item.id == value);

  //demographic data function
  getmetaData(demoinfo);
  // Bar chart function
  gethbarChart(selection);
  //Bubble function
  getbubbleChart(selection)

}
// function for demo data
function getmetaData(demoinfo){
  let demoselect = d3.select("#sample-metadata");
  demoselect.html(
    `id:${demoinfo.id} <br>
    ethnicity:${demoinfo.Ethnicity} <br>
    gender:${demoinfo.gender} <br>
    age: ${demoinfo.age} <br>
    location: ${demoinfo.location} <br>
    bbtype: ${demoinfo.bbtype} <br>
    wfreq: ${demoinfo.wfreq}`

  )
}
// function for bar chart use plotly
function gethbarChart(selection){
  let x_axis = selection.sample_values.slice(0,10).reverse();
  let y_axis = selection.otu_ids.slice(0,10).reverse()
  .map((item) => `OTU ${item}`);
  let text = selection.otu_labels.slice(0,10).reverse();

  barChart = {
    x:x_axis,
    y:y_axis,
    text:text,
    type:"bar",
    orientation: "h",
};
let chart = [barChart];

let layout = {
  margin:{l:100,r:100,t:0,b:100,},
  height:500,width:600,
}
Plotly.newPlot("bar",chart,layout)
}
// function for bubble chart use plotly
function getbubbleChart(selection){
  let x_axis = selection.otu_ids;
  let y_axis = selection.sample_values;
  let marker_size = selection.sample_values;
  let color = selection.otu_ids;
  let text = selection.otu_labels;

  bubble = {
    x: x_axis, y: y_axis,text: text,
    mode: "markers",
    marker: {
        color: color,
        colorscale: "Pastel",
        size: marker_size,
    },
    type: "scatter",
};
let chart = [bubble];

let layout = {
    xaxis: {title: { text: "OTU ID" },
    },
};
Plotly.newPlot("bubble", chart, layout);
}