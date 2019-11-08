function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel

  var sample_endpoint = '/metadata/' + sample;

  d3.json(sample_endpoint)
    .then(function (response) {
      console.log('response from d3.json:', response);

      // Response: 
      // {"AGE":51.0,"BBTYPE":"I","ETHNICITY":"Caucasian","GENDER":"F","LOCATION":"Durham/NC","WFREQ":3.0,"sample":949}

    
      var metaDataElement = d3.select('#sample-metadata');

      // Use `.html("") to clear any existing metadata
      metaDataElement.html("");


      for (key in response) {
        // 'key' is a key and 'reponse[key]' is the value in the dictionary for said key
        var text = key + ': ' + response[key];
        metaDataElement.append('p').text(text);
      }

    })

}

function buildCharts(sample) {

  let sample_endpoint = '/samples/' + sample;

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(sample_endpoint)
    .then(function (response) {

      // get the three arrays(lists) separately
      let ids = response["otu_ids"];
      let labels = response["otu_labels"];
      let values = response["sample_values"];

      // create the chart data for Plotly BUBBLE Chart
      var bubbleChartData = [
        {
          'x': ids,
          'y': values,
          'text': labels,
          'mode': 'markers',
          'marker': {
            size: values,
            color: ids
          }
        }
      ];
      
      var pieLayout = {
        margin: { t: 0, l: 0 }
      };

      // plot the chart
      Plotly.plot('bubble', bubbleChartData, pieLayout);

     
      let pieChartData = [
        {
          values: values.slice(0, 10),
          labels: ids.slice(0, 10),
          type: 'pie'
        }
      ]

     
      Plotly.plot('pie', pieChartData)

    })


}

function init() {
  
  var selector = d3.select("#selDataset");


  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {

  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();