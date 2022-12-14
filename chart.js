function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);
    // 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples;
     console.log(sampleArray)
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var chartArray = sampleArray.filter(sampleObj => sampleObj.id == sample);
    console.log(chartArray)

    //  5. Create a variable that holds the first sample in the array.
    var result = chartArray[0];
    console.log(result)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids= result.otu_ids;
    console.log(otu_ids)
    var otu_labels = result.otu_labels;

    var values = result.sample_values;
    console.log(values)
 
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0,10).reverse().map(function (elem) {return `OTU ${elem}`});
    var xticks = values.slice(0,10).reverse();
    var labels = otu_labels.slice(0,10).reverse();

    
    var trace1 = {
      x: xticks,
      y: yticks,
      type: 'bar',
      orientation: 'h',
      text: labels
    };
    
  

    // 8. Create the trace for the bar chart. 
   var barData = [trace1];

    // 9. Create the layout for the bar chart. 
  var barLayout = {

      title: "Top 10 Bacteria Cultures Found"
     
      };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

//-------------------------------------------------------------------------------------------//

    // Bar and Bubble charts

    var trace2 = {
      x: otu_ids,
      y: values,
      text: labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size:values
      }
      
    };

    // 1. Create the trace for the bubble chart.
    var bubbleData = [trace2];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {

      title: 'Bacteria Cultures Per Sample', font:{size:20},
      showlegend: false,
      xaxis: {title: "OTU ID"}

    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout); 

//-----------------------------------------------------------------------------------------------------------//
      var gaugedata = data.metadata;
      var gaugeArray = gaugedata.filter(sampleObj => sampleObj.id == sample);
      var gaugeResult = gaugeArray[0];

      var wfreq = gaugeResult.wfreq;
      console.log(wfreq);
      var otu_ids = gaugeResult.otu_ids

       // 4. Create the trace for the gauge chart.
      var trace3 = {
        //domain: {otu_ids, wfreq},
        value: wfreq,
        title: { text: "Scrubs per Week" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {range: [0,10], tickwidth: 1, tickcolor: "black" },
          bar:{color:"black"},
          steps: [
            {range: [0,2], color:"red"},
            {range: [2,4], color:"orange"},
            {range: [4,6], color:"yellow"},
            {range: [6,8], color:"lightgreen"},
            {range: [8,10], color:"darkgreen"}
          ]
        }

      };

       var gaugeData = [trace3];
      
      // 5. Create the layout for the gauge chart.
      var gaugeLayout = { 
        title: 'Belly Button Washing Frequency',font:{size:20},
  
    

      };
  
      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot('gauge', gaugeData, gaugeLayout); 


    
 });

 };

 
  

