//making of chloropleth
let countyUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
let educationUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";


let countyData
let educationData
//Dimensions
let width = 1200
let height = 625
let padding = 10

let colors = ['#edf2f4','#7df9ff','#40e0d0', '#6495ed', '#4169e1','#0047ab']
let percent = [5, 15, 30, 45, 60, 75, 100]


let svg = d3.select('svg');
let tooltip = d3.select('#tooltip');

let canvas = d3.select('#canvas')
                .attr('width', width)
                .attr('height', height)
 

let drawMap = ( ) => {
    canvas.selectAll('path')
            .data(countyData)
            .enter()
            .append('path')
            .attr('d', d3.geoPath())
            .attr('class', 'county')
            .attr('fill', (countyDataItem) => {
                let id = countyDataItem['id']
                let county = educationData.find((item) => {
                    return item['fips'] === id
                })
                let percentage = county['bachelorsOrHigher']
                return percentage <= percent[0] ? colors[0]
                            : percentage <= percent[1] ? colors[1]
                            : percentage <= percent[2] ? colors[2]
                            : percentage <= percent[3] ? colors[3]
                            : percentage <= percent[4] ? colors[4]
                            : colors[5]
            })
            .attr('data-fips', (countyDataItem) => {
                return countyDataItem['id']
            })
            .attr('data-education', (countyDataItem) => {
                let id = countyDataItem['id']
                let county = educationData.find((item) => {
                    return item['fips'] === id
                })
                let percentage =  county['bachelorsOrHigher'];
                return percentage
                
            })
            .on('mouseover', (countyDataItem) => {
                tooltip.transition()
                        .style('visibility', 'visible')
                
                let id = countyDataItem['id']
                let county = educationData.find((item) => {
                    return item['fips'] === id
                })
                tooltip.text(county['fips'] + ' - ' + county['area_name'] + ', ' +
                county['state'] + ' : ' + county['bachelorsOrHigher'] + '%')
                tooltip.attr('data-education', county['bachelorsOrHigher'])
            })
             .on('mouseout', (countyDataItem)  => {
                tooltip.transition()
                        .style('visibility', 'hidden');
            });
            
}
let createLegend = ( ) => {

    let legendContainer  = svg.append('g').attr('id', 'legend');
    let legend = legendContainer
                .selectAll('#legend')
                .data(colors)
                .enter()
                .append('g')
                .attr('class', 'legend-label')
                
                
  
    for(let i = 0 ; i <= colors.length -1; i++){
  
        legend.append('rect')      
              .attr('width', 25)
              .attr('height', 25)
              .style('fill', colors[i])
              .attr('y', height/2 - 50 *i)
              .attr('x', width - 150)
              .attr('transform', function (d, i) {
                return 'translate(15,55)';})
              
                  
        legend.append('text')
                .attr('y', height/2 - 50*i + 75)             
              .attr('dy', '.13em')
              .attr('x', width - 100)                       
              .text(`  ${percent[i]}` )
  
    }
} 

d3.json(countyUrl).then(
    (data,error) => {
        if(error){
            console.log(error)
        }else{
            countyData = topojson.feature(data, data.objects.counties).features

            console.log(countyData)

            d3.json(educationUrl).then(
                (newData,error) => {
                    if(error){
                        console.log(error)
                    }else{
                        educationData = newData
                        console.log(educationData)
                        createLegend();
                        drawMap();
                        
                    }
                }
            )
        }
    }
)