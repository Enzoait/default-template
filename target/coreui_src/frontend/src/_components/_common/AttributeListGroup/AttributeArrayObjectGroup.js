import React, { Component } from 'react';
import { 
	Button, 
	ButtonGroup,
	Input,
} from 'reactstrap';
import {commons} from '_helpers/commons';
import PropTypes from 'prop-types';

const propTypes = {
	items: PropTypes.array.isRequired,
	attribute: PropTypes.array.object,
};

const defaultProps = {
	items: [],
};
/**
 * Remarques :
 * 1. mode hide label (afficher que les inputs)
 * 2. layout horizontal 
 */
class AttributeArrayObjectGroup extends Component {

	constructor(props){
		super(props);
		this.state = {
			'editingItems': [],
			'items': props.items,
			'initalItems': props.items,
			'addingNewItem': false
		}

		this.delete = this.delete.bind(this)
		this.save = this.save.bind(this)
		this.footerActions = this.footerActions.bind(this)
		this.add = this.add.bind(this)
		this.edit = this.edit.bind(this)
		this.cancel = this.cancel.bind(this)
		this.isEditingThisItem = this.isEditingThisItem.bind(this)

		this.handleFormChange = this.handleFormChange.bind(this);
	}

	handleFormChange(event, item){
		let editingItems = this.state.editingItems.slice();
		let editingindex = commons.indexOfItemInArray(item, editingItems);
		let editingItem = editingItems[editingindex]

		editingItem[event.target.name] = event.target.value
		this.setState({
			'editingItems': editingItems,
		})
	}

	cancel(e, item, formId){
		e.preventDefault();

		if(item.id){
			// REPLACE EDITING ITEM BY INITIAL ITEM VALUE
			// AND RESET FORM
			let editingItems = this.state.editingItems.slice();
			let initalItems = this.state.initalItems.slice();
			let items = this.state.items.slice();
			
			let initialindex = commons.indexOfItemInArray(item, initalItems);
			let editingindex = commons.indexOfItemInArray(item, editingItems);
			let currentIndex = commons.indexOfItemInArray(item, items);

			editingItems.splice(editingindex, 1)
			items[currentIndex] = initalItems[initialindex]

			this.setState({
				'editingItems': editingItems,
			})

			document.getElementById(formId).reset();
		}
	}

	save(e, item, formId){
		e.preventDefault();

		// REPLACE INITIAL ITEM BY EDITING ITEM VALUE
		// AND UPDATE ITEMS
		let editingItems = this.state.editingItems.slice();
		let initalItems = this.state.initalItems.slice();
		let items = this.state.items.slice();
		
		let initialindex = commons.indexOfItemInArray(item, initalItems);
		let editingindex = commons.indexOfItemInArray(item, editingItems);
		let currentIndex = commons.indexOfItemInArray(item, items);

		let newItem = JSON.parse(JSON.stringify(editingItems[editingindex]));
		items[currentIndex] = newItem;
		initalItems[initialindex] = newItem;

		editingItems.splice(editingindex, 1)
		this.setState({
			'editingItems': editingItems,
			'initalItems': initalItems,
			'items': items,
			'addingNewItem': false
		})

	}

	add(e){
		e.preventDefault();
		let editingItems = this.state.editingItems.slice();
		let items = this.state.items.slice();

		let clone = commons.clone(this.props.newObjectFormData)
		editingItems[editingItems.length] = clone
		items[items.length] = clone
		this.setState({
			'editingItems': editingItems,
			'items': items,
			'addingNewItem': true
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

	edit(e, item){
		e.preventDefault();
		
		let isEditingThisItem = this.isEditingThisItem(item)
		if(!isEditingThisItem){
			let editingItems = this.state.editingItems.slice()
			const clone = JSON.parse(JSON.stringify(item));
			editingItems.push(clone)
			this.setState({
				'editingItems': editingItems
			})
		}
	}

	isEditingThisItem(item){
		let res = false
		this.state.editingItems.map(m => {
			if(m.id === item.id){
				res = true
			}
		})
		return res
	}

	rowActions(item, formId){
		if(!this.isEditingThisItem(item)){
			return (
				<React.Fragment>
					<tr>
						<td align="right" colspan="2">
							<table width="100%">
								<tbody>
									<tr>
										<td align="right" colspan="2">
											<ButtonGroup>
												<Button className="katappult-btn" color="warning" size="xs" onClick={(e) => this.edit(e, item)} ><i className="fa fa-edit"></i> Modifier</Button>
												<Button className="katappult-btn" color="warning" size="xs" onClick={(e) => this.delete(e, item)}><i className="fa fa-trash"></i> Supprimer</Button>
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
			return (
				<React.Fragment>
					<tr>
						<td align="right" colspan="2">
							<table width="100%">
								<tbody>
									<tr>
										<td align="right" colspan="2">
											<ButtonGroup>
												<Button className="katappult-btn" color="warning" size="xs" onClick={(e) => this.cancel(e, item, formId)}><i className="fa fa-rotate-left"></i> Annuler</Button>
												<Button className="katappult-btn" color="warning" size="xs" onClick={(e) => this.save(e, item)} ><i className="fa fa-save"></i> Sauvegarder</Button>
												<Button className="katappult-btn" color="warning" size="xs" onClick={(e) => this.delete(e, item)}><i className="fa fa-trash"></i> Supprimer</Button>
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
	}

	footerActions() {
		if(this.state.addingNewItem){
			return <React.Fragment>
				<div></div>
			</React.Fragment>
		}

		return (
			<React.Fragment>
				<Button block className="katappult-btn" color="white" size="md" onClick={(e) => this.add(e)}><i className="fa fa-plus"></i> AJouter</Button>
			</React.Fragment>
		)
	}

	render() {
		// FOOTER ACTIONS IS COMMON TO ALL BLOCS
		let footerActions = ( 
			<tr>
				<td colspan="3" align='right'>
					{this.footerActions(this.props.attribute)}
				</td>
			</tr>
		)

		if(this.state.items && this.state.items.length === 0){
			let rows = [];
			rows.push(
				<div>
					<strong>This section is empty.</strong>
				</div>
			)
			rows.push(footerActions)
			return rows
		}
		else {
			let blocs = []
			if(this.props.attribute.items && this.props.attribute.items.attributes) {
				let indexdata = 11
				this.state.items.map(data => {

					// FORM ID IS NEED TO RESET EACH BLOC
					let formId = 'katappult_array_form_' + indexdata
					indexdata++

					// EACH BLOC OF DATA IS A FORM
					// SUBMITTED ALONE
					let rows = [];

					// generates title of group here because it may depend
					// on some datas
					let headerActions;
					if(this.props.attribute.headerActions) headerActions = this.props.attribute.headerActions();
					let title =  this.props.attribute.title;
					if(this.props.attribute.arrayTitleProvider){
						title = this.props.attribute.arrayTitleProvider(data)
					}

					// THE HEADER AND HEADER ACTION OF THE BLOC
					rows.push(
						<React.Fragment>
							<tr>
								<td colspan="3">
										<label className="katappult-form-title-level-1">{title}</label>
										{headerActions}
								</td>
							</tr>
						</React.Fragment>  
					)

					// EACH ROW OF DATA
					this.props.attribute.items.attributes.map(rowDef => {
						let label = rowDef.name
						let value = commons.getPropByString(data, rowDef.dataField);
						let editor = commons.getInputType(this.props.attribute);
						rows.push(
							<tr>
								<td><label>{label}</label></td> 
								<td>
									<Input type={editor} defaultValue={value} name={rowDef.dataField} 
										id={rowDef.dataField}
										onChange={(e) => this.handleFormChange(e, data)}/>
								</td>
							</tr>
						);
					});

					// action on the row (group)
					rows.push(this.rowActions(data, formId));

					blocs.push(
						<tr>
							<td>
								<form id={formId}>
									<table width="100%">
										<tbody>
											{rows}
										</tbody>
									</table>
								</form>
							</td>
						</tr>
					)
				})

				// FOOTER ACTIONS IS COMMON TO ALL BLOCS
				blocs.push(footerActions)
			}	

			return (<React.Fragment>
				{blocs}
			</React.Fragment>)
		}
	}
}

AttributeArrayObjectGroup.propTypes = propTypes;
AttributeArrayObjectGroup.defaultProps = defaultProps;

export default AttributeArrayObjectGroup;


