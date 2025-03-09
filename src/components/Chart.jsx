import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const Chart = ({ dataProp }) => {
	const svgRef = useRef();
	const tooltipRef = useRef();
	const [data, setData] = useState(null);

	useEffect(() => {
		if (!dataProp || !dataProp.xAxisLabels) {
			console.error('Data not loaded or invalid:', dataProp);
			return;
		}
		setData(dataProp);
	}, [dataProp]);

	useEffect(() => {
		if (!data) return;

		const width = 900,
			height = 600,
			margin = { top: 20, right: 30, bottom: 50, left: 50 };

		let filteredKeys = data.keys.filter((item) => item.selected);

		if (filteredKeys && !filteredKeys.length) filteredKeys = data.keys;

		const transformedData = data.xAxisLabels.map((label, i) => {
			let obj = { label };
			filteredKeys.forEach((key) => {
				obj[key.name] = key.values[i] ?? 0;
			});
			return obj;
		});

		const keys = filteredKeys.map((k) => k.name);
		const colors = filteredKeys.reduce(
			(acc, k) => ({ ...acc, [k.name]: k.color }),
			{}
		);

		const svg = d3
			.select(svgRef.current)
			.attr('width', width)
			.attr('height', height);

		svg.selectAll('*').remove();

		const x = d3
			.scaleBand()
			.domain(transformedData.map((d) => d.label))
			.range([margin.left, width - margin.right])
			.padding(0.3);

		const y = d3
			.scaleLinear()
			.domain([
				0,
				d3.max(transformedData, (d) => d3.sum(keys, (key) => d[key])),
			])
			.nice()
			.range([height - margin.bottom, margin.top]);

		const colorScale = d3
			.scaleOrdinal()
			.domain(keys)
			.range(Object.values(colors));

		const stack = d3.stack().keys(keys);
		const stackedData = stack(transformedData);

		const tooltip = d3
			.select(tooltipRef.current)
			.style('opacity', 0)
			.style('position', 'absolute')
			.style('background', 'white')
			.style('color', 'black')
			.style('font-size', '12px')
			.style('padding', '15px')
			.style('border-radius', '5px')
			.style('pointer-events', 'none')
			.style('box-shadow', '4px 4px 10px rgba(0, 0, 0, 0.2)');

		svg
			.append('g')
			.selectAll('g')
			.data(stackedData)
			.join('g')
			.attr('fill', (d) => colorScale(d.key))
			.selectAll('rect')
			.data((d) => d)
			.join('rect')
			.attr('x', (d) => x(d?.data?.label) || 0)
			.attr('y', (d) => y(d[1]))
			.attr('height', (d) => y(d[0]) - y(d[1]))
			.attr('width', x.bandwidth());

		svg
			.selectAll('.bar-overlay')
			.data(transformedData)
			.enter()
			.append('rect')
			.attr('class', 'bar-overlay')
			.attr('x', (d) => x(d.label))
			.attr('y', margin.top)
			.attr('width', x.bandwidth())
			.attr('height', height - margin.top - margin.bottom)
			.attr('fill', 'transparent')
			.on('mouseover', (event, d) => {
				const totalValue = d3.sum(keys, (key) => d[key]);
				let tooltipContent = `
        <div style="
          text-align: end; 
          font-size: 14px;
        ">
          <strong style="font-size: 16px;">${d.label}</strong><br/>
           <hr style="border: none; border-top: 1px solid lightgray; margin: 5px 0;">
        </div>`;

				keys.forEach((key) => {
					tooltipContent += `<div style="
          display: flex; 
          align-items: center; 
          font-size: 12px;
          justify-content: space-between; 
          gap: 5px;
          width: 100%;
        ">
          <div style="
            width: 12px; 
            height: 12px; 
            background-color: ${colors[key]}; 
            border-radius: 3px;
            display: inline-block;
          "></div>
          <span style="flex: 1; text-align: start;">${key}</span>
          <span style="text-align: end;">${d[key]}</span>
        </div>`;
				});

				tooltip
					.style('opacity', 1)
					.html(tooltipContent)
					.style('left', `${event.pageX + 10}px`)
					.style('top', `${event.pageY - 20}px`);
			})
			.on('mousemove', (event) => {
				tooltip
					.style('left', `${event.pageX + 10}px`)
					.style('top', `${event.pageY - 20}px`);
			})
			.on('mouseleave', () => {
				tooltip.style('opacity', 0);
			});

		svg
			.append('g')
			.attr('transform', `translate(0,${height - margin.bottom})`)
			.call(d3.axisBottom(x).tickSize(0))
			.selectAll('text')
			.attr('transform', 'rotate(-45)')
			.style('text-anchor', 'end');

		svg
			.append('g')
			.attr('transform', `translate(${margin.left},0)`)
			.call(d3.axisLeft(y));
	}, [data]);

	return (
		<>
			<svg ref={svgRef}></svg>
			<div ref={tooltipRef}></div>
		</>
	);
};

export default Chart;
