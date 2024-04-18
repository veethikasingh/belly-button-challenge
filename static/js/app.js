// The url with data
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"
const dataPromise = d3.json(url)
console.log("Data Promise: ", dataPromise);

// Fetch data from url
d3.json(url).then(function(data) {
  console.log("data", data);
});

// Set up variables and get data from JSON for charts 
//store charts data
var samples_chart;
//store demographic data
var meta_data_demo;
//store json data
d3.json(url).then(function (data) {
    let selector = d3.select("#selDataset");
    meta_data_demo = data.metadata;
    samples_chart = data.samples;
    data.names.forEach((id) => {
        selector.append("option").text(id).property("value", id);
    });
    //function call for demographic
    getmetaData(meta_data_demo[0]);
    //function call for hbar chart
    gethbarChart(samples_chart[0]);
    //function call for bubble chart
    getbubbleChart(samples_chart[0]);
});

function optionChanged(value) {
    const selectotuId = samples_chart.find((item) => item.id === value);
    const demographicInfo = meta_data_demo.find((item) => item.id == value);

    // Insterting Data for demographic
    getmetaData(demographicInfo);

    // refresh Bar Chart
    gethbarChart(selectotuId);

    // refresh Bubble Chart
    getbubbleChart(selectotuId);

}
//define function for demographic data
function getmetaData(demographicInfo) {
    let demoSelect = d3.select("#sample-metadata");

    demoSelect.html(
        `id: ${demographicInfo.id} <br> 
      ethnicity: ${demographicInfo.ethnicity} <br>
    gender: ${demographicInfo.gender} <br>
    age: ${demographicInfo.age} <br>
    location: ${demographicInfo.location} <br>
    bbtype: ${demographicInfo.bbtype} <br>
    wfreq: ${demographicInfo.wfreq}`
    );
}
//define hbar data function graph is shown using plotly
function gethbarChart(selectotuId) {
    let x_axis = selectotuId.sample_values.slice(0, 10).reverse();
    let y_axis = selectotuId.otu_ids
        .slice(0, 10)
        .reverse()
        .map((item) => `OTU ${item}`);
    let text = selectotuId.otu_labels.slice(0, 10).reverse();

    barChart = {
        x: x_axis,y: y_axis,text: text,
        type: "bar",
        orientation: "h",
    };

    let chart = [barChart];

    let layout = {
        margin: {
            l: 100,
            r: 100,
            t: 0,
            b: 100,
        },
        height: 500,
        width: 600,
    };

    Plotly.newPlot("bar", chart, layout);
}
//define bubble data function graph is shown using plotly
function getbubbleChart(selectotuId) {
    let x_axis = selectotuId.otu_ids;
    let y_axis = selectotuId.sample_values;
    let marker_size = selectotuId.sample_values;
    let color = selectotuId.otu_ids;
    let text = selectotuId.otu_labels;

    bubble = {
        x: x_axis,y: y_axis,text: text,
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
        xaxis: {
            title: { text: "OTU ID" },
        },
    };
    Plotly.newPlot("bubble", chart, layout);
}
