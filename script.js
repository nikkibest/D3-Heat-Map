const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

function heatMap(data) {
    console.log(data)
    const margin = {top: 50, right: 50, left: 120, bottom: 150},
    width = 1500 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom,
    padding_top = 50,
    padding_bot = 50;
    let fontSize = 16;
    let padding = {
        left: 9 * fontSize,
        right: 9 * fontSize,
        top: 1 * fontSize,
        bottom: 8 * fontSize
      };
    // Dataset
    let dataset = data.monthlyVariance;
    // Calculate arrays for the axis
    let minMonth =(d3.min(dataset,(d)=>d.month))
    let maxMonth =(d3.max(dataset,(d)=>d.month))
    let minYear =(d3.min(dataset,(d)=>d.year))
    let maxYear =(d3.max(dataset,(d)=>d.year))
    // Datetime arrays, X
    const xArrYears = dataset.map((d) => {
        return new Date("" + d.year + "-01-01")
    });
    xArrYears[xArrYears.length] = new Date("" + Number(maxYear+1) + "-01-01")
    xArrYears[xArrYears.length] = new Date("" + Number(minYear-1) + "-01-01")
    // Datetime arrays, Y
    const yArrMonths = dataset.map((d) => {
        return new Date(minYear + "-" + d.month +"-01")
    });
    // yArrMonths[yArrMonths.length] = new Date(minYear-1 + "-" + maxMonth +"-01")
    // yArrMonths[yArrMonths.length] = new Date(minYear+1 + "-" + minMonth +"-01")
    console.log(d3.extent(yArrMonths))

    // Axes time
    let xTime = d3.scaleTime().domain(d3.extent(xArrYears)).range([0, width])
    let yTime = d3.scaleTime().domain(d3.extent(yArrMonths)).range([0, height])

    // Axes:
    let timeFormat = d3.timeFormat('%B');
    let xAxis = d3.axisBottom(xTime).ticks(19);
    let yAxis = d3.axisLeft(yTime).tickFormat(timeFormat);

    // Calculate arrays for scales
    let xValues = dataset.map(d => d.year);
    let yValues = dataset.map(d => d.month);

    // Scales:
    let xScale = d3.scaleLinear().domain([d3.min(xValues), d3.max(xValues)]).range([0, width]);
    let yScale = d3.scaleLinear().domain([d3.min(yValues), d3.max(yValues)]).range([0, height]);
    let xWidth = 5;
    console.log(xWidth)

    // Color scale
    let colorArr = dataset.map(d => d.variance);
    clrMinMax = d3.extent(colorArr),
    clrDiff = clrMinMax[1]-clrMinMax[0],
    clrArr = []
    for (let i = 0; i < 9; i++) {
        clrArr[i] = clrMinMax[0] + (clrDiff / 8)*i;
    }
    console.log(clrMinMax)
    console.log(clrArr)
    let darkblue="rgb(0,43,255)", blue="rgb(62,93,252)", lightblue="rgb(135,154,250)",
    gray="rgb(174,174,174)", yellow="rgb(255,255,102)", darkyellow="rgb(204,204,0)",
    orange="rgb(255,119,0)", lightred="rgb(255,91,91)", red="rgb(255,0,0)";
    let colorsLegend = [darkblue,blue,lightblue,gray,darkyellow,yellow,orange,lightred,red];
    
    let colorScale = d3.scaleLinear()
    .domain(clrArr)
    .range(colorsLegend)

    let toolTip = d3.select('.container')
        .append("div")
        .classed('tooltip',true)
        .style("position","absolute")
        .style("background","black")
        .style("border-radius","5px")
        .style("width","150px")
        .style("padding","9px")
        .style("display","none")

    // Add an svg object to the body of the page
    let svg = d3.select('.container')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom + padding_top)
    .append('g')
    .attr("transform", "translate(" + margin.left + "," + margin.right + ")")

    // Add x-axis
    svg.append("g")
        .attr("transform", "translate(0, " + (height + padding_top + 45) +")")
        .classed('axis', true)
        .attr('id','x-axis')
        .call(xAxis)

    // Add y-axis
    svg.append("g")
        .attr("transform", "translate(" + (0) +", "+ (padding_top) +" )")
        .classed('axis', true)
        .attr('id','y-axis')
        .call(yAxis)
        .selectAll("text")
            .attr("transform", "translate(-10,10)rotate(-45)")
            .style("text-anchor", "end")
            .style("font-size", 15)
            .style("fill", "#69a3b2")
    
    // Add datapoints as rectangles
    svg.append('g')
        .attr("fill", "none")
        .selectAll('rect')
        .data(dataset)
        .enter().append('rect')
            .classed("rectangle",true)
            .classed("cell",true)
            .attr('x', d => xScale(d.year))
            .attr('y', d => yScale(d.month)+padding_top)
            .attr("width", 5)
            .attr("height", 45)
            .attr("fill", d => colorScale(d.variance))
            .attr("data-month", d => d.month)
            .attr("data-year", d => d.year)
            .attr("data-temp", d => data.baseTemperature+d.variance)
            // .attr("data-yvalue", (d,i) =>  timeData[i])
        .on("mouseover", function(d) {
            let data = d.target.__data__;
            let date = new Date(data.year, data.month);
            let trueTemp = (data.variance+8.66).toFixed(1);
            let varTemp = (data.variance).toFixed(1);
            toolTip
                .style('display','block')
                .style('opacity',0.9)
                .style('left', (d.pageX-75)+'px')
                .style('top', (d.pageY-100)+'px')
                .html(() => d3.timeFormat('%Y - %B')(date) +
                '<br>' + (trueTemp) + '℃ <br>' +
                varTemp + '℃')
                .style('background','black')
                .style('color','white')
                .style('font-size', '1.1em')
                .style('font-weight', 'bold')
                .attr("id","tooltip")
                .attr("data-year", data.year)

            d3.select(this)
                .attr("stroke", "black")
                .attr("stroke-width", "2")
        })
        .on("mouseout", function(d) {
            // Remove tooltip
            toolTip
                .style("opacity", 0)
            
            d3.select(this)
            .attr("stroke-width", "0")
        });

    // Ylabel
    d3.select('svg')
        .append('text')
            .classed('ylabelText', true)
            .text('Months')
            .attr('transform', 'translate(' + (margin.left - 80) + ', ' + (height+margin.top+margin.bottom)/2 + ') rotate(-90)')
            .style('text-anchor', 'end')
    d3.select('svg')
        .append('text')
            .classed('xlabelText', true)
            .text('Years')
            .attr('transform', 'translate(' + ((width+ margin.right + margin.left)/2) + ', ' + (height+margin.top+margin.bottom) + ')')
            .style('text-anchor', 'end')
    // Titles
    d3.select('svg')
        .append('text')
        .classed('titleText', true)
        .attr("id","title")
        .text('Monthly Global Land-Surface Temperature')
        .attr('transform', 'translate(' + ((width+ margin.right + margin.left)/2) + ', ' + (margin.top-20) + ')')
        .style('text-anchor', 'middle')
    d3.select('svg')
        .append('text')
        .classed('supTitleText', true)
        .text("1753 - 2015: base temperature 8.66℃")
        .attr("id","description")
        .attr('transform', 'translate(' + ((width+ margin.right + margin.left)/2) + ', ' + (margin.top+20) + ')')
        .style('text-anchor', 'middle')

    // Legend Axis
    let legendWidth = 400;
    let legendHeight = 50;
    let clrFcn = function(min,max,length) {
        let array = [];
        let step = (max - min) / length;
        let base = min;
        for (let i = 1; i < length; i++) {
            array.push(base + i*step);
        }
        console.log({array})
        return array;
    };

    let legendThreshold = d3.scaleThreshold()
    .domain(clrFcn(clrMinMax[0]+data.baseTemperature, clrMinMax[1]+data.baseTemperature, colorsLegend.length+2))
    .range(colorsLegend);

    let legendX = d3
    .scaleLinear()
    .domain([clrMinMax[0]+data.baseTemperature, clrMinMax[1]+data.baseTemperature])
    .range([0, legendWidth]);

    let legendXAxis = d3
    .axisBottom()
    .scale(legendX)
    .tickSize(10, 0)
    .tickValues(legendThreshold.domain())
    .tickFormat(d3.format('.1f'));

    let legend = svg.append('g')
        .classed('legend', true)
        .attr('id', 'legend')
        .attr(
            'transform',
            'translate(' +
            10 +
            ',' +
            (height + padding_top + padding.top + padding.bottom - 1 * legendHeight - 15) +
            ')'
        );
    console.log([clrMinMax[0]+data.baseTemperature, clrMinMax[1]+data.baseTemperature])
    console.log(legendThreshold(2.7))
    console.log(legendThreshold(11.669))
    console.log(legendThreshold(12.778))
    console.log(legendThreshold.domain())
    console.log(legendThreshold.range())
    
    let legendData2 = []
    for (let i = 0; i < legendThreshold.domain().length; i++) {
        let d = [];
        if (i === 0) {
            d[0] = null;
        } else {
            d[0] = legendThreshold.domain()[i-1];
        }
        if (i === legendThreshold.domain().length) {
            d[1] = null;
        } else {
            d[1] = legendThreshold.domain()[i];
        }
        legendData2[i] = d;
    }

    console.log(legendData2)

    legend
        .append('g')
        .selectAll('rect')
        .data(legendData2)
        .enter()
        .append('rect')
        .style('fill', function (d) {
            return legendThreshold(d[0]-1);
        })
        .attr('x', (d) => legendX(d[0]))
        .attr('y', 0)
        .attr('width', (d) =>
            d[0] && d[1] ? legendX(d[1]) - legendX(d[0]) : legendX(null)
        )
        .attr('height', legendHeight)
        .on("mouseover", function(d) {
            d3.select(this)
                .attr("stroke", "black")
                .attr("stroke-width", "2")
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .attr("stroke-width", "0")
        });
    legend
        .append('g')
        .attr('transform', 'translate(' + 0 + ',' + legendHeight + ')')
        .call(legendXAxis);
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