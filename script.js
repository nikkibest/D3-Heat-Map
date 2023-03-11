const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

function heatMap(data) {
    console.log(data)
    const margin = {top: 50, right: 50, left: 70, bottom: 50},
    width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom,
    padding_top = 50;

    let dataset = data.monthlyVariance;

    let minYear =(d3.min(dataset,(d)=>d.year))
    let maxYear =(d3.max(dataset,(d)=>d.year))
    console.log([minYear, maxYear])
    const xArrYears = dataset.map((d) => {
        return new Date("" + d.year + "-01-01")
    });
    xArrYears[xArrYears.length] = new Date("" + Number(maxYear+1) + "-01-01")
    xArrYears[xArrYears.length] = new Date("" + Number(minYear-1) + "-01-01")
    
    const yArrMonths = dataset.map((d) => {
        return new Date("" + d.month + "-01-01")
    });
    // Axes time
    let xTime = d3.scaleTime().domain(d3.extent(xArrYears)).range([0, width])
    let yTime = d3.scaleTime().domain(d3.extent(yArrMonths)).range([0, height])

    // Axes:
    let timeFormat = d3.timeFormat('%B');
    let xAxis = d3.axisBottom(xTime).ticks(19);
    let yAxis = d3.axisLeft(yTime).tickFormat(timeFormat);

    // Add an svg object to the body of the page
    let svg = d3.select('.container')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom + padding_top)
    .append('g')
    .attr("transform", "translate(" + margin.left + "," + margin.right + ")");

    // Add x-axis
    svg.append("g")
        .attr("transform", "translate(0, " + (height + padding_top) +")")
        .classed('axis', true)
        .attr('id','x-axis')
        .call(xAxis)

    // Add y-axis
    svg.append("g")
        .attr("transform", "translate(" + (0) +", "+ (padding_top) +" )")
        .classed('axis', true)
        .attr('id','y-axis')
        .call(yAxis);

    // Add datapoints as rectangles
    svg.append('g')
        .attr("fill", "none")
        .selectAll('rect')
        .data(dataset)
        .enter().append('rect')
            .classed("rectangle",true)
            .attr('x', 0)
            .attr('y', 0)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", 'red')
            // .attr("data-xvalue", (d,i) => yearData[i])   	
            // .attr("data-yvalue", (d,i) =>  timeData[i])
            // .style('pointer-events', 'all')
}


async function heatMapAsync(dataURL) {
    try {
        await fetch(dataURL)
            .then(response => response.json())
            .then(json => {
                heatMap(json);
            })
            .catch(err => {
                console.log(err);
            });
    } catch (error) {
        console.log(error)
    }
}

heatMapAsync(url);