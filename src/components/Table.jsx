import React, { useState, useEffect } from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

function Table({ products, keys }) {
	const [filteredKeys, setFilteredKeys] = useState([]);

	useEffect(() => {
		const selectedKeys = keys.filter((el) => el.selected);
		if (selectedKeys.length === 0) {
			// If no keys are selected, show all keys
			setFilteredKeys(keys);
		} else {
			setFilteredKeys(selectedKeys);
		}
	}, [keys]);

	const [sortConfig, setSortConfig] = useState({
		key: null,
		direction: 'ascending',
	});

	const handleSort = (key) => {
		let direction = 'ascending';
		if (sortConfig.key === key && sortConfig.direction === 'ascending') {
			direction = 'descending';
		}

		setSortConfig({ key, direction });
	};

	const sortedData = [...products]
		.map((product, index) => {
			const values = filteredKeys.map((key) => key.values[index]);
			return { product, values };
		})
		.sort((a, b) => {
			if (sortConfig.key === null) return 0;

			let aValue =
				sortConfig.key === 'name' ? a.product : a.values[sortConfig.key];
			let bValue =
				sortConfig.key === 'name' ? b.product : b.values[sortConfig.key];

			if (sortConfig.direction === 'ascending') {
				return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
			} else {
				return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
			}
		});

	const getSortIcon = (key) => {
		if (sortConfig.key === key) {
			return sortConfig.direction === 'ascending' ? (
				<FaSortUp size={12} className="cursor mx-2" />
			) : (
				<FaSortDown size={12} className="cursor mx-2" />
			);
		} else {
			return <FaSort size={12} className="cursor mx-2" />;
		}
	};

	const getTotalValue = (values) =>
		values.reduce((sum, value) => sum + value, 0);

	return (
		<main className="graph-table">
			<table className="table table-striped table-bordered">
				<thead>
					<tr>
						<th style={{ width: '150px' }} onClick={() => handleSort('name')}>
							Name
							{getSortIcon('name')}
						</th>
						{filteredKeys &&
							filteredKeys.map((key, index) => {
								return (
									<th key={index} onClick={() => handleSort(index)}>
										{key.name}
										{getSortIcon(index)}
									</th>
								);
							})}
						<th>Total</th>
					</tr>
				</thead>
				<tbody>
					{sortedData.map((data, rowIndex) => {
						return (
							<tr key={rowIndex}>
								<td>{data.product}</td>
								{data.values.map((value, colIndex) => {
									return <td key={`${rowIndex}-${colIndex}`}>{value}</td>;
								})}
								<td>{getTotalValue(data.values)}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</main>
	);
}

export default Table;
