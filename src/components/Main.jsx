import React, { useEffect, useState } from 'react';
import Chart from './Chart';
import Table from './Table';
import { data, data1, data2, data3 } from '../data';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { PiDotsThreeCircleLight } from 'react-icons/pi';
import { IoClose } from 'react-icons/io5';
import { GiNetworkBars } from 'react-icons/gi';
import { BsList } from 'react-icons/bs';

function Main() {
	const [selectedTab, setSelectedTab] = useState('data1');
	const [currentData, setCurrentData] = useState(data1);
	const [totalValue, setTotalValue] = useState(0);
	const [popOverData, setpopOverData] = useState(null);
	const [viewMode, setViewMode] = useState('chart');

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

	const handleSelect = (item) => {
		setCurrentData({
			...currentData,
			keys: currentData.keys.map((key) =>
				key.name === item.name ? { ...key, selected: !key.selected } : key
			),
		});
	};

	const handlePopOverData = (item) => {
		if (popOverData && popOverData.name === item.name) {
			setpopOverData(null);
			return;
		}
		let popOverObj = {
			name: item.name,
			total: 0,
			items: [],
		};
		currentData.xAxisLabels.forEach((label, index) => {
			const newItem = { [label]: item.values[index] };
			popOverObj.items.push(newItem);
			popOverObj.total += item.values[index];
		});
		setpopOverData(popOverObj);
	};

	const clearPopOverData = () => {
		setpopOverData(null);
	};

	const clearSelections = () => {
		setCurrentData({
			...currentData,
			keys: currentData.keys.map((key) => ({
				...key,
				selected: false,
			})),
		});
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
				<div className="wrapper">
					<div className="left-panel">
						<div className="left-panel-row">
							<p className="item-name-final">Total </p>
							<p>{totalValue}</p>
						</div>
						{currentData.keys.map((key) => (
							<div
								className={`left-panel-row ${key.selected ? 'active' : ''}`}
								key={key.name}>
								<div className="d-flex align-items-center justify-content-between">
									<div className="d-flex align-items-center column-gap-2">
										<div
											className="color-box"
											style={{ backgroundColor: key.color }}></div>
										<p className="item-name" onClick={() => handleSelect(key)}>
											{key.name}
											<MdKeyboardArrowRight size={20} />
										</p>
									</div>
									<PiDotsThreeCircleLight
										color="#1d6dc3"
										size={20}
										className="cursor"
										onClick={() => handlePopOverData(key)}
									/>
								</div>
								<div className="d-flex justify-content-between align-items-center">
									<p>{getTotalValue(key.values)}</p>
									<p>{calculatePercentage(key.values, 1000000)} %</p>
								</div>
							</div>
						))}
					</div>
					{popOverData && (
						<div className="left-popover">
							<div className="d-flex justify-content-end">
								<IoClose
									onClick={() => clearPopOverData()}
									className="cursor"
								/>
							</div>
							<div className="popover-header">
								<p>{popOverData.name}</p>
								<p>{popOverData.total}</p>
							</div>
							<hr />
							{popOverData.items &&
								popOverData.items.map((item, index) => {
									return Object.entries(item).map(([key, value], subIndex) => (
										<div className="popover-item" key={`${index}-${subIndex}`}>
											<p>{key}</p>
											<p>{value}</p>
										</div>
									));
								})}
						</div>
					)}
				</div>

				<button className="clear-selection" onClick={() => clearSelections()}>
					Clear selections
				</button>

				<div className="toggle-buttons">
					<button
						className={`toggle-button ${viewMode === 'chart' ? 'active' : ''}`}
						onClick={() => setViewMode('chart')}>
						<GiNetworkBars color="#1d6dc3" size={18} />
					</button>
					<button
						className={`toggle-button ${viewMode === 'list' ? 'active' : ''}`}
						onClick={() => setViewMode('list')}>
						<BsList color="#1d6dc3" size={18} />
					</button>
				</div>

				{/* Chart Component / Table component */}
				{viewMode == 'chart' ? (
					<Chart dataProp={currentData} />
				) : (
					<Table products={currentData.xAxisLabels} keys={currentData.keys} />
				)}
			</div>
		</>
	);
}

export default Main;
