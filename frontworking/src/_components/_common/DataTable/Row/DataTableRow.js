import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {commons} from '_helpers/commons.js';
import moment from 'moment'
import localization from 'moment/locale/fr';
import './DataTableRow.css';

const propTypes = {
	columns: PropTypes.array,
};

const defaultProps = {
	columns:[],
};

/**
 * Simple Datatable Row
 */
class DataTableRow extends Component {

	constructor(props){
		super(props);
	}

	toRow(columns, item) {
		const cells = [];
		columns.map(col => {
			const className = col.className ? col.className : 'dt-center'
			const type = col.type;
			if(this.isDateCol(col)){
				const dateFormat = col.dateFormat;
				const field = col.dataField;
				const d = commons.getPropByString(item, field);

				if(d && d !== ''){
					const date = moment(d,  'YYYY-MM-DD hh:mm:ss S').locale('fr', localization).format(dateFormat);
					cells.push(this.dateRow(date, className));
				}
				else {
					cells.push(<td className={className}></td>);
				}
			}
			else if(this.isDisplayableCol(col)){
				let field = col.dataField;
				let val = commons.getPropByString(item, field);
				if(col.dataField){
					cells.push(col.displayComponent(val, item));
				}
				else {
					cells.push(col.displayComponent(val, item));
				}
			}
			else if(col.enumProvider){
				let val = commons.getPropByString(item, col.dataField);
				val = val ? val.split(';') : []
				let selectValue = []
				col.enumProvider().map(value => {
					if(val.includes(value.key)) {
						selectValue.push(value.value)
					}
				})
				cells.push(<td className={className}>{selectValue}</td>);
			}
			else {
				let field = col.dataField;
				const value = commons.getPropByString(item, field);
				if(type === 'yesno'){
					if(String(value) === "true"){
						cells.push(<td className={col.className ? col.className : "dt-center"}>
								<input type={'checkbox'} checked disabled/>
							</td>
						);
					}
					else{
						cells.push(<td className={col.className ? col.className : "dt-center"}>
								<input type={'checkbox'} disabled/>
							</td>
						);
					}
				}
				else {
					cells.push(this.stringRow(item, field, col));
				}

			}
		});

		return cells;
	}

	isDateCol(col){
		return col.dateFormat !== undefined;
	}

	isDisplayableCol(col) {
		return col.displayComponent !== undefined;
	}

	dateRow(value, classname){
		const colclass = classname ? classname : 'dt-center'
		return <td className={colclass}>{value}</td>
	}

	stringRow(item, field, col) {
		let suffix = col.suffix ? col.suffix : ''
		return <td className={col.className ? col.className : "dt-center"}>
			{col.contentClassName && <span className={'col.contentClassName'}>{String(commons.getPropByString(item, field))}{suffix}</span>}
			{!col.contentClassName && <>{String(commons.getPropByString(item, field))}{suffix}</>}
		</td>
	}

	render() {
		const item = this.props.item;
		const { columns, ...attributes } = this.props;
		const row = this.toRow(columns, item);

		let id;
		if(item.attributes){
			id = item.attributes.id.toString()
		}
		else {
			id = item.id.toString()
		}

		if(this.props.tableConfig.onRowClick){
			return (
				<React.Fragment>
					<tr key={id} className={this.props.rowClassName}
						onClick={(e ) => this.props.tableConfig.onRowClick(e, id, item)}>
						{row}
					</tr>
				</React.Fragment>
			);
		}

		return (
			<React.Fragment>
				<tr key={id} className={this.props.rowClassName}>
					{row}
				</tr>
			</React.Fragment>
		);
	}
}

DataTableRow.propTypes = propTypes;
DataTableRow.defaultProps = defaultProps;

export default DataTableRow;
