import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button,
	ButtonGroup,
	ButtonToolbar,
	Input, Col
} from 'reactstrap';
import {
	DataTable,
	WizardConfirm,
	WaitingPane,
	EmptyPane
}
from '_components/_common';
import { businessRulesService } from '_services/business.rule.services';
import * as actions from '_actions/actions';
import { commons } from '_helpers/commons';
import { Form, } from 'react-bootstrap'
import { RiBriefcase4Line } from "react-icons/ri";
import queryString from 'query-string';
import {coreUri} from '_helpers/CoreUri'
import BusinessRuleClasses from "_components/_admin/BusinessRules/BusinessRuleClasses";
import BusinessRulesAll from "_components/_admin/BusinessRules/BusinessRulesAll";
import {BusinessRuleDetails} from "_components/_admin";
import BusinessRulesFilter from "_components/_admin/BusinessRules/BusinessRulesFilter";

const mapStateToProps = store => ({
	searchBusinessRulesRX : store.searchBusinessRules,
})

const mapDispatchToProps = (disptach) => ({
	updateSearchCriterias: (e) => disptach(actions.updateBusinessRulesSearchCriterias(e)),
})

/**
 *
 * Business rules
 */
class BusinessRules extends Component {

	constructor(props){
		super(props)

		let includeParentRules = commons.hasRoleSuperAdmin(this.props.userContext) ? true : false
		if(this.props.searchBusinessRules && this.props.searchBusinessRules.includeParentRules != undefined){
			includeParentRules = this.props.searchBusinessRules.includeParentRules
		}

		this.state = {
			queryFilters: {
				businessType: this.props.searchBusinessRulesRX.businessType ? this.props.searchBusinessRulesRX.businessType : '',
				businessClass: this.props.searchBusinessRulesRX.businessClass ? this.props.searchBusinessRulesRX.businessClass : '',
				vetoable: this.props.searchBusinessRulesRX.vetoable ? this.props.searchBusinessRulesRX.vetoable : true,
				includeParentRules: includeParentRules,
				eventKey: this.props.searchBusinessRulesRX.eventKey ? this.props.searchBusinessRulesRX.eventKey : '',
				phase: this.props.searchBusinessRulesRX.phase ? this.props.searchBusinessRulesRX.phase : '0',
			},

			rules: this.props.searchBusinessRulesRX.rules ? this.props.searchBusinessRulesRX.rules : {},
			errors: '',
			processing: false,

			viewMode: 'allRules',
			selectedRuleId : null,
		}

		this.updateBusinessTypeFunction = this.updateBusinessTypeFunction.bind(this)
		this.businessEventChange = this.businessEventChange.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.disactivateRule = this.disactivateRule.bind(this)
		this.activateRule = this.activateRule.bind(this)
		this.switchToView = this.switchToView.bind(this)
		this.refreshView = this.refreshView.bind(this)
		this.displayListView = this.displayListView.bind(this)
		this.loadDatas = this.loadDatas.bind(this)
		this.getRootObjectForDetailsId = this.getRootObjectForDetailsId.bind(this)
		this.doSearch = this.doSearch.bind(this)
	}

	displayListView(update){
		this.setState({viewMode: 'viewList',});

		if(update){
			this.refreshView();
		}
	}

	refreshView(){
		let currentFormQueryFilters = {...this.state.queryFilters};
		this.loadDatas(currentFormQueryFilters);
	}

	switchToView(e, name){
		e.preventDefault()
		this.setState({
			viewMode: name
		})
	}

	disactivateRule(e, i){
		e.preventDefault()
		let id = i.attributes.id

		businessRulesService.desactivate(id, this.props.containerId).then(response => {
			let currentFormQueryFilters = {...this.state.queryFilters}
			this.loadDatas(currentFormQueryFilters);
        }).catch(error => {
        	console.error(error);
        })
	}

	activateRule(e, i){
		e.preventDefault()
		let id = i.attributes.id

		businessRulesService.activate(id, this.props.containerId).then(response => {
			let currentFormQueryFilters = {...this.state.queryFilters}
			this.loadDatas(currentFormQueryFilters);
        }).catch(error => {
        	console.error(error);
        })
	}

	componentDidUpdate(prevProps, prevState){
		let prevformqueryFilters = {...prevState.queryFilters}
		let curformqueryFilters = {...this.state.queryFilters}

		if(JSON.stringify(prevformqueryFilters) !== JSON.stringify(curformqueryFilters)){
			if(this.state.queryFilters.businessClass === undefined ||
				(this.state.queryFilters.businessClass === '' && this.state.queryFilters.businessType === '')){
				this.setState({
					errors: true,
					processing: false
				})
			}
			else {
				this.loadDatas(curformqueryFilters)
			}
		}
	}

	loadDatas(params){
		if(params.phase !== '0'){
			params.vetoable = false
		}

		this.setState({processing: true})
		if(params.businessClass){
			businessRulesService.getApplicableRules(params, this.props.containerId).then(response => {
				this.setState({
					rules: response,
					errors: '',
					processing: false,
					queryFilters: params
				})
			}).catch(error =>{
				this.setState({processing: false})
			})
		}
		else {
			this.setState({
				rules: null,
				errors: '',
				processing: false,
				queryFilters: params
			})
		}
	}

	handleChange(e){
		let value = e.target.value
		let queryFilters = {...this.state.queryFilters}
		if(e.target.name === 'vetoable'){
			let vet = !this.state.queryFilters.vetoable
			queryFilters.vetoable = vet
		}
		else if(e.target.name === 'phase'){
			if(value === '1' || value === '2'){
				queryFilters.phase = value
				queryFilters.vetoable = false
			}
			else {
				queryFilters.phase = value
			}
		}
		else if(e.target.name === 'includeParentRules'){
			queryFilters.includeParentRules = e.target.checked
		}

		this.setState({queryFilters: queryFilters})
	}

	businessEventChange(e){
		let queryFilters = {...this.state.queryFilters}
		queryFilters.eventKey = e.target.value
		this.setState({
			queryFilters: queryFilters,
		})
	}

	updateBusinessTypeFunction(businessClass, businessType){
		let queryFilters = {...this.state.queryFilters}
		queryFilters.businessClass = businessClass ? businessClass : ''
		queryFilters.businessType = businessType ? businessType : ''
		this.loadDatas(queryFilters);
	}

    displaySelectFunction(businessClass, businessTypes){
        return (
        	<Form.Row>
                <Form.Group as={Col}>
                    <div>{businessClass}</div>
                </Form.Group>
                <Form.Group as={Col} style={{'margin-left':'0.5rem'}}>
                    <div>{businessTypes}</div>
                </Form.Group>
             </Form.Row>
        )
    }

    selectRule(e, id) {
    	if(e) e.preventDefault();
    	const backOfficeUrl = coreUri.backOfficeViewURL("platform", "businessRules", ["rootId=" + id]);
		this.props.history.push(backOfficeUrl);
    }

	name(v, i){
		let phase = v.transactionPhase ? v.transactionPhase : '', event = v.event;
		let d1 = <>
			{event +  (phase ? ', ' + phase : ' ')}
		</>

		let className = v.businessClass.split('.').pop()
		return <>
			<div className={'table-list-admin-root-list-div'}>
				<Link className={'table-link'} onClick={e=>this.selectRule(e, i.attributes.id)}>
					{v.identifier}
				</Link>
				<div style={{padding: '0rem 0 0.2rem 0'}}>
					<div  className={'table-list-admin-root-list-desc1'}>{v.description}</div>
					<div  className={'table-list-admin-root-list-desc2'}>{v.vetoable && <>
						<i className={'fa fa-flash fa-sm'}></i>&nbsp;{d1}&nbsp;{className}
					</>
					}
					</div>
				</div>
			</div>
		</>
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
					dialogTitle='Supprimer une règle'/>
			</div>
		</td>
	}

	goDetails (item, i) {
		const id = i.attributes.id
		return <td width={'5%'}>
			<Link onClick={e => this.selectRule(e,id)} style={{padding: '0.8rem'}}>
				<i className={'fa fa-chevron-right fa-lg'}></i>
			</Link>
		</td>
	}

    buildResultDatatable(){
    	const items = this.state.rules ? this.state.rules.data : [];
		const metaData = this.state.rules ? this.state.rules.metaData : {};
		const tableConfig = {
				columnsConfig: [
					{name:'Identification', dataField: 'attributes',  displayComponent: (v, i) => this.name(v, i)},
					{displayComponent: (v,i) => this.actionsRight()},
					{displayComponent: (v,i) => this.goDetails(v, i)},
				],
		}

    	let datatable;
		if(this.state.processing === true){
			datatable = <div className="mt-5"><WaitingPane /></div>
		}
		else {
			if(items && items.length > 0) {
				datatable = <DataTable items={JSON.stringify(this.state.rules.data)}
								tableClassName="data-table"
								metaData={JSON.stringify(metaData)}
								tableConfig={tableConfig}
								displayTotalElements={true}
								paginate={true}/>
			}
			else {
		    	return this.state.processing ?
		    		<WaitingPane /> :
		    		<EmptyPane hideMainMessage={true} secondaryMessage="No business rules found"/>
			}
		}

		return datatable;
    }

    header(){
    	return <div className="">
		    	<ButtonToolbar  className="justify-content-between">
		    		<ButtonGroup>
		    			<Button className="katappult-btn" onClick={e=>this.switchToView(e, 'synch')}><i className="fa fa-md fa-cloud-upload"></i> Upload</Button>
		    			<Button className="katappult-btn"  onClick={e=>this.switchToView(e, 'viewList')}><i className="fa fa-md fa-th-list"></i> Navigate</Button>
		    			<Button className="katappult-btn" onClick={e=>this.refreshView()}><i className="fa fa-md fa-refresh"></i> Refresh</Button>
		    		</ButtonGroup>
		    		<ButtonGroup style={{'padding-top':'0.5rem'}}>
		    			<Form.Check
	                		type="switch"
	                		id="custom-switch"
	                		checked={this.state.includeParentsItem}
	                		value={this.state.includeParentsItem}
	                		onChange={this.includeParentsItemCheck}
	                		label="Parent items"/>
				   </ButtonGroup>
				</ButtonToolbar>
		</div>
    }

	getRootObjectForDetailsId(){
			const queryUrlParams = queryString.parse(this.props.location.search);
			let objectforDetailsId = queryUrlParams.rootId;
			return objectforDetailsId
	}

	businessRulesListView(){
		this.setState({viewMode: 'businessRulesClassList'})
	}

	allRulesListView(){
		this.setState({viewMode: 'allRules'})
	}

	doSearch(event){
		let searchTerm = event.target.value;
		this.setState({viewMode: 'allRules'})

		const searchBusinessRulesRX = {...this.props.searchBusinessRulesRX}
		searchBusinessRulesRX.searchTerm = searchTerm
		this.props.updateSearchCriterias(searchBusinessRulesRX)
	}

	isSearching(){
		return this.props.searchBusinessRulesRX.searchTerm
			&& this.props.searchBusinessRulesRX.searchTerm .length > 0
	}

    render() {
    	let errors;
			if(this.state.errors !== ''){
				errors = <center><h6>Please select a business class</h6></center>
			}

			let objectforDetailsId = this.getRootObjectForDetailsId()
			if(!objectforDetailsId){

				let toolbar = <div className="admin-filters backend-root-panel">
							<Input type="text"
								   className="form-control"
								   name="input1-group2"
								   placeholder="Chercher une règle métier"
								   autocomplete="off"
								   onChange={this.doSearch}
								   value={this.props.searchBusinessRulesRX.searchTerm}/>
				</div>

				if(this.state.viewMode === 'businessRulesClassList'){
					return <div className="">
						<div className={'admin-filters-root'}>
							{toolbar}
						</div>

						<div className="portlet-content">
							<div className={'table-list-admin-root-list'}>
								<BusinessRuleClasses {...this.props}/>
							</div>
						</div>
					</div>
				}
				else if(this.state.viewMode === 'allRules'){
					if(!this.isSearching()) {
						return <BusinessRulesFilter {...this.props} toolbar={toolbar}/>
					}

					return <>
						<div className={'admin-filters-root'}>{toolbar}</div>
						<div className="portlet-content">
							<div className={'table-list-admin-root-list'}>
								<BusinessRulesAll {...this.props} searchTerm={this.props.searchBusinessRulesRX.searchTerm}/>
							</div>
						</div>
					</>
				}

				return <></>
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

export default connect(mapStateToProps, mapDispatchToProps) (BusinessRules);


