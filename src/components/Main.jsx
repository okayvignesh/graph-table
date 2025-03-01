import React, { useEffect, useState } from 'react';
import Chart from './Chart';
import { data, data1, data2, data3 } from '../data';

function Main() {
	const [selectedTab, setSelectedTab] = useState('data1');
	const [currentData, setCurrentData] = useState(data1);
	const [totalValue, setTotalValue] = useState(0);

	useEffect(() => {
		calculateTotalValues(currentData);
	}, [currentData]);

	const getTotalValue = (values) =>
		values.reduce((sum, value) => sum + value, 0);

	const calculatePercentage = (values, total) => {
		const sum = values.reduce((sum, value) => sum + value, 0);
		if (total === 0) return 0;
		return ((sum / total) * 100).toFixed(2);
	};

	const calculateTotalValues = (data) => {
		const totals = Array(data.xAxisLabels.length).fill(0);
		data.keys.forEach((key) => {
			key.values.forEach((value, index) => {
				totals[index] += value;
			});
		});
		const final = totals.reduce((sum, value) => sum + value, 0);
		setTotalValue(final);
	};

	const dataSets = {
		data,
		data1,
		data2,
		data3,
	};

	const handleTabChange = (tab) => {
		setSelectedTab(tab);
		setCurrentData(dataSets[tab] || data1);
	};

	return (
		<>
			{/* Tabs */}
			<div className="tabs">
				<button
					className={selectedTab === 'data1' ? 'active' : ''}
					onClick={() => handleTabChange('data1')}>
					Data 1
				</button>
				<button
					className={selectedTab === 'data2' ? 'active' : ''}
					onClick={() => handleTabChange('data2')}>
					Data 2
				</button>
				<button
					className={selectedTab === 'data3' ? 'active' : ''}
					onClick={() => handleTabChange('data3')}>
					Data 3
				</button>
				<button
					className={selectedTab === 'data' ? 'active' : ''}
					onClick={() => handleTabChange('data')}>
					Data 4
				</button>
			</div>
			<div className="main-container">
				{/* Left Panel */}
				<div className="left-panel">
					<div className="left-panel-row">
						<p className="item-name-final">Total </p>
						<p>{totalValue}</p>
					</div>
					{currentData.keys.map((key) => (
						<div className="left-panel-row" key={key.name}>
							<div className="d-flex align-items-center column-gap-2">
								<div
									className="color-box"
									style={{ backgroundColor: key.color }}></div>
								<p className="item-name">{key.name}</p>
							</div>
							<div className="d-flex justify-content-between align-items-center">
								<p>{getTotalValue(key.values)}</p>
								<p>{calculatePercentage(key.values, 1000000)} %</p>
							</div>
						</div>
					))}
				</div>

				{/* Chart Component */}
				<Chart dataProp={currentData} />
			</div>
		</>
	);
}

export default Main;
