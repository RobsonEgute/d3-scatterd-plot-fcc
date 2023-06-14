// code written by Egute Robson. visit my git profile @ RobsonEgute

let width, height, padding, xAxis, yAxis, xScale, heightScale, xAxisScale, yAxisScale, genAxis, svg, genScale, link, fetchData, newData, dates, genDots, genLegend, genToolTip;
link = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
width = 800;
height = 600;
padding = 40;

svg = d3.select('body')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background-color', 'grey')

genScale = () => {
    //dates = newData.map(item => new date (item.))
    xScale = d3.scaleLinear()
                .domain([d3.min(newData, d => d.Year) - 1, d3.max(newData, d => d.Year) + 1])
                .range([padding, width - padding])

    // heightScale =  d3.scaleLinear()
    //             .domain([1990, 2018])
    //             .range([padding, height - padding])

    yAxisScale = d3.scaleTime()
                    .domain([new Date(2190 * 1000), d3.max(newData, d => new Date((d.Seconds + 10) * 1000))])
                    .range([padding, height - padding])

}

genAxis = () => {
    xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'))
    yAxis = d3.axisLeft(yAxisScale).tickFormat(d3.timeFormat('%M:%S'))
    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr("transform", "translate(0," + (height - padding) + ")")
    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr("transform", "translate(" + padding + ",0)")
}
genDots = () => {
svg.selectAll('circle')
    .data(newData)
    .enter()
    .append('circle')
    .attr('r', 7)
    .attr('cx', d => xScale(d['Year']))
    .attr('cy', d => yAxisScale(new Date(d.Seconds * 1000)))
    .attr('class', 'dot')
    .attr('data-xvalue', d => d.Year)
    .attr('data-yvalue', d => new Date(d.Seconds * 1000))
    .attr('data-name', d => d.Name)
    .attr('data-doping', d => d.Doping)
    .attr('data-minutes', d => d.Time)
    .style('fill', (d, i) => {
        if(d.Doping){
            return 'red'
        } else {
            return 'blue'
        }
    })
    .on('mouseover', function(d, i) {
        let val = d3.select(this);
        
        //let targetNode = document.querySelector('#tooltip');
        toolTip.transition().style('visibility', 'visible');
        toolTip.attr('data-year', val.attr('data-xvalue'))
        if (val.attr('data-doping')) {
            //return
            toolTip.text(
            `Name: ${val.attr('data-name')}
            Year: ${val.attr('data-xvalue')}, time: ${val.attr('data-minutes')}
            ${val.attr('data-doping')}
            `)
        } else {
            toolTip.text(
            `Name: ${val.attr('data-name')}
            Year: ${val.attr('data-xvalue')}, time: ${val.attr('data-minutes')}
            `)
        }

    })
    .on('mouseout', function() {
        toolTip.transition().style('visibility', 'hidden')
    })

}
genLegend = () => {
        d3.select('body')
        .append('div')
        .attr('id', 'legend')
        .attr('width', 200)
        .attr('height', 200)
        .text(`
        Legend|
        red color: Dopers|
        blue color: non-Dopers
        `)
}
genToolTip = () => {
 toolTip = d3.select('body')
            .append('div')
            .attr('id', 'tooltip')
            .attr('width', 200)
            .attr('height', 200)
            .style('visibility', 'hidden')
}

(async function() {
data = await fetch(link)
        .then(res => res.json())
        .then(data => newData = data)
console.log(newData);
genToolTip();
genScale();
genAxis();
genDots();
genLegend();
})();
