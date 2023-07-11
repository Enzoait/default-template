import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup} from 'reactstrap';
import {
	DataTable,
	WaitingPane,
	EmptyPane
}
from '_components/_common';
import {BusinessRuleDetails} from '_components/_admin';
import { businessRulesService } from '_services/business.rule.services';
import { commons } from '_helpers/commons';
import { RiBriefcase4Line } from "react-icons/ri";
import queryString from 'query-string';
import {coreUri} from '_helpers/CoreUri'
import {WizardConfirm} from "_components/_common";
import {toast} from "react-toastify";
import {connect} from "react-redux";

const mapStateToProps = store => ({
	searchBusinessRulesRX : store.searchBusinessRules,
})

const mapDispatchToProps = (disptach) => ({
})


class BusinessRulesAll extends Component {

	constructor(props){
		super(props)
		this.state = {
			errors: '',
			processing: false,
			selectedRuleId : null,
		}

		this.disactivateRule = this.disactivateRule.bind(this)
		this.activateRule = this.activateRule.bind(this)
		this.switchToView = this.switchToView.bind(this)
		this.refreshView = this.refreshView.bind(this)
		this.displayListView = this.displayListView.bind(this)
		this.getRootObjectForDetailsId = this.getRootObjectForDetailsId.bind(this)
		this.goToPage = this.goToPage.bind(this)
		this.deleteRow = this.deleteRow.bind(this)
	}

	displayListView(update){
		this.setState({viewMode: 'viewList',});
		if(update){
			this.refreshView();
		}
	}
	refreshView(){
		this.componentDidMount();
	}

	switchToView(e, name){
		e.preventDefault()
		this.setState({
			viewMode: name
		})
	}
	
	disactivateRule(e, i){
		e.preventDefault();
		let id = i.attributes.id;

		businessRulesService.desactivate(id, this.props.containerId).then(response => {
			let curformqueryFilters = {...this.state.queryFilters}
			this.loadDatas(curformqueryFilters);
        }).catch(error => {
        	console.error(error);
        })
	}

	activateRule(e, i){
		e.preventDefault()
		let id = i.attributes.id;

		businessRulesService.activate(id, this.props.containerId).then(response => {
			let curformqueryFilters = {...this.state.queryFilters}
			this.loadDatas(curformqueryFilters);
        }).catch(error => {
        	console.error(error);
        })
	}

	componentDidMount(){
		this.loadDatas(0);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if(prevProps.searchBusinessRulesRX.searchTerm !== this.props.searchBusinessRulesRX.searchTerm) {
			this.loadDatas(0);
		}
	}

	loadDatas(page){
		this.setState({processing: true});
		const searchTerm = this.props.searchBusinessRulesRX.searchTerm;
		businessRulesService.getAllBusinessRules(page, 10, this.props.containerId, searchTerm).then(response => {
			this.setState({
				rules: response.data,
				metaData: response.metaData,
				errors: '',
				processing: false,
			})
		}).catch(error =>{
			this.setState({processing: false})
		})
	}

	goToPage(i){
		this.loadDatas(i);
	}

    selectRule(e, id){
    	if(e) e.preventDefault();
    	const url = coreUri.backOfficeViewURL("platform", "businessRules", ["rootId=" + id]);
		this.props.history.push(url);
    }

	goDetails (item, i) {
		const id = i.attributes.id
		return <td width={'5%'}>
			<Link onClick={e => this.selectRule(e,id)} style={{padding: '0.8rem'}}>
				<i className={'fa fa-chevron-right fa-lg'}></i>
			</Link>
		</td>
	}

    name(v, i){
		let className = v.businessClass.split('.').pop();
		return <>
			<div className={'table-list-admin-root-list-div'}>
				<Link className={'table-link'} onClick={e=>this.selectRule(e, i.attributes.id)}>
					{className} - {v.description}
				</Link>
				<div style={{padding: '0rem 0 0.2rem 0'}}>
					<div  className={'table-list-admin-root-list-desc1'}>{v.identifier}</div>
				</div>
			</div>
		</>
    }

	icon(v,i){
		return <td width={'5%'}>
			<div  className={'table-list-admin-root-list-desc2'}>{vetoableIcon(i)}</div>
		</td>
	}

    actions(v,i){
    	let currentContaineName = commons.getWorkingContainerName(this.props.userContext),
    		objContainerName = i.container.name,
    		inherited = currentContaineName !== objContainerName;

    	let actions;
    	if(inherited === true){
    		actions = <i className='fa fa-lg fa-arrow-circle-o-up'></i>;
    	}

    	if(!inherited){
    		actions = <ButtonGroup>
				{i.attributes.active && <Button color="primary" size="sm">ON</Button>}
				{!i.attributes.active  && <Button color="primary" size="sm">OFF</Button>}
			</ButtonGroup>
    	}

    	return <td className="dt-center">{actions}</td>;
    }

	actionsRight(v,i){
		return <td width={'5%'}>
			<div className={'btn-toolbar'}>
				<WizardConfirm
					buttonTitle='Supprimer'
					onConfirm={() => this.deleteRow(i.attributes.id)}
					dialogMessage="Supprimer la règle?"
					dialogTitle='Supprimer une règle'
					/>
			</div>
		</td>
	}

	deleteRow(row){
		businessRulesService.deleteRule(row, this.props.containerId).then(response => {
			if(response.ok){
				this.loadDatas(0)
			}
			else {
				toast.error("impossible de supprimer la règle")
			}
		})
	}

	order(v,item){
		return <td width={'5%'}>
			{item.attributes.order}
		</td>
	}

	buildResultDatatable(){
		const tableConfig = {
				columnsConfig: [
					{name:'Identification', dataField: 'attributes',  displayComponent: (v, i) => this.name(v, i)},
					{displayComponent: (v,i) => this.icon(v, i)},
					{displayComponent: (v,i) => this.order(v, i)},
					{displayComponent: (v,i) => this.goDetails(v, i)},
				],
		}

    	let datatable;
		if(this.state.processing === true){
			datatable = <div><WaitingPane /></div>
		}
		else {
			if(this.state.rules && this.state.rules.length > 0) {
				datatable = <DataTable
								items={JSON.stringify(this.state.rules)}
								tableConfig={tableConfig}
								goToPage={this.goToPage}
								metaData={JSON.stringify(this.state.metaData)}
								displayTotalElements={true}
								paginate={true}/>
			}
			else {
		    	return this.state.processing ?
		    		<WaitingPane /> :
		    		<EmptyPane mainMessage="No business rules found"/>
			}
		}

		return datatable;
    }

	getRootObjectForDetailsId(){
			const queryUrlParams = queryString.parse(this.props.location.search);
			let objectforDetailsId = queryUrlParams.rootId;
			return objectforDetailsId
	}

    render() {
			let objectforDetailsId = this.getRootObjectForDetailsId()
			if(!objectforDetailsId){
				return this.buildResultDatatable()
			}

	     	return <div>
					<BusinessRuleDetails
						{...this.props}
						refreshListView={this.refreshView}
						displayListView={this.displayListView}
						pushBreadCrumb={this.props.pushBreadCrumb}
						popBreadCrumb={this.props.popBreadCrumb} />
	  		</div>
   }
}

export default connect(mapStateToProps, mapDispatchToProps) (BusinessRulesAll);

const vetoableIcon = (rule) => {
	let content;
	if(rule.attributes.vetoable){
		content = <i className={'fa fa-flash fa-lg'}></i>
	}

	if(!rule.attributes.vetoable && !rule.attributes.transactionPhase){
		content = <i></i>
	}

	if(!rule.attributes.vetoable && rule.attributes.transactionPhase === 'AFTER_COMMIT'){
		content = <i className={'fa fa-lg fa-check'}></i>
	}

	if(!rule.attributes.vetoable && rule.attributes.transactionPhase === 'AFTER_ROLLBACK'){
		content = <i className={'fa fa-lg fa-reply'}></i>
	}

	return <div style={{margin: '0.5rem 0rem 0rem 0.5rem'}}>{content}</div>
}