import React, { Component } from 'react';
import {
	Button,
	ButtonGroup,
	Input,
	Label,
	Table
} from 'reactstrap';
import {commons} from '_helpers/commons';
import PropTypes from 'prop-types';

const propTypes = {
	items: PropTypes.array.isRequired,
	attribute: PropTypes.array.object,
	firstRowLabel: PropTypes.bool,
	newObjectFormData: PropTypes.object.isRequired,
};

const defaultProps = {
	items: [],
	firstRowLabel: false
};
/**
 *
 */
class AttributeArrayGroup extends Component {

	constructor(props){
		super(props);
		this.state = {
			'mode': 'view',
			'items': props.items,
			'initalItems': props.items
		}

		this.moveDown = this.moveDown.bind(this)
		this.moveUp = this.moveUp.bind(this)
		this.delete = this.delete.bind(this)
		this.save = this.save.bind(this)
		this.footerActions = this.footerActions.bind(this)
		this.add = this.add.bind(this)
		this.edit = this.edit.bind(this)
		this.cancel = this.cancel.bind(this)
		this.handleFormChange = this.handleFormChange.bind(this)
		this.isEditing = this.isEditing.bind(this)
	}

	handleFormChange(event){
		let name = event.target.name.split('_')[0]
		let index = event.target.name.split('_')[1]
		let items = this.state.items.slice();

		//console.log('change : ' + event.target.name	 + ' , ' + event.target.value)
		//console.log('index : ' + index)
		//console.log('1 : ' + JSON.stringify(items))
		//console.log('2 : ' + JSON.stringify(this.state.items))

		let d = items[index]
		d[name] = event.target.value
		this.setState({
			items: items,
		})
	}

	cancel(e){
		e.preventDefault();
		let items = this.state.initalItems.slice();
		this.setState({
			items: items,
			mode: 'view'
		})

		// THIS ACTION IS VALID ONLY IN INDIVIDUAL FORM
		// IN OTHER CASE, OT IS THE RESPONSABILITY OF THE
		// WRAPPER
		if(this.props.wrapInform){
			let form = document.getElementById(this.props.wrapInform)
			if(form) form.reset();
		}
	}

	save(e){
		e.preventDefault();
		let items = this.state.items.slice();
		this.setState({
			mode: 'view',
			initalItems: items
		})
		this.props.attributesListConfig.onSubmit(items)
	}

	add(e){
		e.preventDefault();
		let newItems = this.state.items.slice();
		newItems[newItems.length] = commons.clone(this.props.newObjectFormData)
		this.setState({
			items: newItems
		})
	}

	moveUp(e, item){
		e.preventDefault();

		let newItems = this.state.items.slice();
		let a = newItems.indexOf(item);
		newItems.splice(a, 1);

		let newplace = a - 1;
		if(newplace < 0) {
			newItems.splice(newItems.length + 1, 0, item);
		}
		else {
			newItems.splice(newplace, 0, item);
		}

		this.setState({
			items: newItems,
		})
	}

	moveDown(e, item) {
		e.preventDefault();

		let newItems = this.state.items.slice();
		let a = newItems.indexOf(item);
		newItems.splice(a, 1);

		let newplace = a + 1;
		if(newplace === newItems.length) {
			newItems.splice(newItems.length, 0, item);
		}
		else if(newplace > newItems.length) {
			newItems.splice(0, 0, item);
		}
		else {
			newItems.splice(newplace, 0, item);
		}

		this.setState({
			items: newItems,
		})
	}

	delete(e, item){
		e.preventDefault();
		let newItems = this.state.items.slice();
		let a = newItems.indexOf(item);

		newItems.splice(a, 1);
		this.setState({
			items: newItems,
		})
	}

	edit(e){
		e.preventDefault();
		this.setState({
			mode: 'edit'
		})
	}

	isEditing(){
		return this.state.mode && this.state.mode ===  'edit'
	}

	rowActions(item, colspan){
		if(this.isEditing()){
			return (
				<React.Fragment>
					<tr>
						<td align="right" colspan={colspan ?  colspan:4}>
							<table width="100%">
								<tbody>
									<tr>
										<td align="right" colspan="2">
											<ButtonGroup className="btn-toolbar-right">
												<Button onClick={(e) => this.moveUp(e, item)} ><i className="fa fa-arrow-circle-up"></i></Button>
												<Button onClick={(e) => this.moveDown(e, item)}><i className="fa fa-arrow-circle-down"></i></Button>
												<Button onClick={(e) => this.delete(e, item)}><i className="fa fa-trash"></i> Supprimer</Button>
											</ButtonGroup>
										</td>
									</tr>
								</tbody>
							</table>
						</td>
					</tr>
				</React.Fragment>
			)
		}
		else {
			return (<React.Fragment><tr></tr></React.Fragment>)
		}
	}

	footerActions() {
		if(this.isEditing()){
			return <React.Fragment>
				<div className="btn-toolbar-right">
					<Button onClick={(e) => this.save(e)}><i className="fa fa-save"></i> Sauvegarder</Button>
					<Button onClick={(e) => this.cancel(e)}><i className="fa fa-undo"></i> Annuler</Button>
					<Button onClick={(e) => this.add(e)}><i className="fa fa-plus"></i> Ajouter</Button>
				</div>
	        </React.Fragment>
		}
		else {
			if(this.props.canEdit === true){
				return (
					<div className="btn-toolbar-right">
						<Button onClick={(e) => this.edit(e)}><i className="fa fa-edit"></i>&nbsp;MODIFIER</Button>
					</div>
				)
			}
			else {
				return ''
			}
		}
	}

	render(){
		let rows = [];
		// if empty
		if(this.state.items && this.state.items.length === 0){
			return (
				<React.Fragment>
					<tr>
						<td colspan="3">
							<div className="empty-pane">
								<strong>Pas d'éléments</strong>
								{this.footerActions(this.props.attribute)}
							</div>
						</td>
					</tr>
				</React.Fragment>
			)
		}

		// if having data to display
		else {
			let childRows = [], colspan = 0,  index = 0

			if(this.props.firstRowLabel === 'true'){
				this.props.attribute.items.attributes.map(rowDef => {
					let label = rowDef.name;
					childRows.push(<td><strong>{label}</strong></td>);
				});
			}

			if(this.state.items){
				this.state.items.map(data => {
					let cols = [], colspan = 0;
					this.props.attribute.items.attributes.map(rowDef => {
						let datakey = rowDef.dataField + "_" + index
						let value = commons.getPropByString(data, rowDef.dataField);
						let editor = commons.getInputType(rowDef);

						if(this.isEditing()){
							cols.push(
								<td><Input type={editor} defaultValue={value} name={datakey} onChange={(e) => this.handleFormChange(e)}/></td>
							);
						}
						else {
							cols.push(
								<td><Label>{value}</Label></td>
							);
						}
					});

					childRows.push(<tr>{cols}</tr>);
					childRows.push(this.rowActions(data, colspan, this.props.attribute));
					index++
				})
			}


			// footer actions
			childRows.push(
				<tr>
					<td colSpan={colspan === colspan ? 4 : colspan}>
						{this.footerActions(this.props.attribute)}
					</td>
				</tr>
			)

			if(this.props.wrapInform) {
				let formId = this.props.wrapInform
				return (
					<React.Fragment>
						<tr>
							<td colSpan={colspan + 1}>
								<form id={formId}>
									<Table size="sm" borderless className="noBorder">
										<tbody>
											{childRows}
										</tbody>
									</Table>
								</form>
							</td>
						</tr>
					</React.Fragment>
				)
			}
			else {
				return (
					<React.Fragment>
						<tr>
							<td colSpan={colspan + 1}>
								<Table size="sm" borderless className="noBorder">
									<tbody>
										{childRows}
									</tbody>
								</Table>
							</td>
						</tr>
					</React.Fragment>
				)
			}
		}
	}
}

AttributeArrayGroup.propTypes = propTypes;
AttributeArrayGroup.defaultProps = defaultProps;


/**
 * Get the first key of the json data.
 * Ex: {'dod':'toto'} => dod
 * @param {*} json
 */
const getJsonKey = (json) => {
	for(let k in json){
		return k
	}
}
const getJsonValue = (json) => {
	for(let k in json){
		return json[k]
	}
}

export default AttributeArrayGroup;
