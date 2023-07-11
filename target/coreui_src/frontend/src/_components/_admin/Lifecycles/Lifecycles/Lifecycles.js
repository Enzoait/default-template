import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {ButtonToolbar, ButtonGroup, Input} from 'reactstrap';
import { DataTable, EmptyPane, WaitingPane } from '_components/_common';
import { LifecycleDetails } from '_components/_admin';
import { containerService } from '_services/container.services';
import { connect } from 'react-redux';
import { workableService } from '_services/workable.services';
import {contentHolderService} from '_services/contentHolder.services'
import { Form } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import queryString from 'query-string';
import {coreUri} from '_helpers/CoreUri'
import {WizardConfirm} from "_components/_common";
import LifecycleAdd from "_components/_admin/Lifecycles/LifecycleAdd";
import {lifecycleService} from "_services/lifecycle.services";
import {toast} from "react-toastify";

const mapStateToProps = store => ({
	lifecycleNavCriterias: store.applicationConfig.lifecycleNavCriterias,
})

const mapDispatchToProps = (disptach) => ({
	updateLifecyclesCriteriasRX: (e) => disptach(updateLifecyclesCriterias(e)),
})

/**
 * Lifecycles management page
 */
class Lifecycles extends Component {

	constructor(props){
		super(props);

		let page = 0;
		let includeParentsItem = true;

		if(this.props.lifecycleNavCriterias){
			page = this.props.lifecycleNavCriterias.page
		}

		this.state = {
			loading: true,
			items: [],
			metaData: '',

			queryFilters:{
				rowPerPage: 20,
				page: page,
				includeParentsItem: includeParentsItem,
			},
		}

		this.loadData = this.loadData.bind(this)
		this.goToPage = this.goToPage.bind(this)
		this.edit = this.edit.bind(this)
		this.includeParentsItemCheck = this.includeParentsItemCheck.bind(this)
		this.switchToView = this.switchToView.bind(this)
		this.refreshView = this.refreshView.bind(this)
		this.getRootObjectForDetailsId = this.getRootObjectForDetailsId.bind(this)
		this.onCreateSuccess = this.onCreateSuccess.bind(this)
	}

	refreshView(viewMode){
		this.loadData(viewMode)
	}

	switchToView(e, name){
		e.preventDefault()
		this.setState({
			viewMode: name
		})
	}

	setNavCriteriasPage(i){
		let payload = {}
		payload.page = i;
		payload.includeParentsItem = this.state.includeParentsItem;
		this.props.updateLifecyclesCriteriasRX(payload);
	}

	edit(e, lifecycleId){
		e.preventDefault();
		workableService.workingCopy(lifecycleId).then(response => {
			if(response && response.data){
				let wcId = response.data.attributes.id, link;
				if(this.props.detailsViewUriProvider){
					link = this.props.detailsViewUriProvider(wcId);
				}
				else {
					const uri = this.props.location.pathname
					link = uri + wcId
				}

				this.props.history.push(link)
			}
		})
	}

	setObsolete(lifecycleId){
		this.setState({loading: true})
		lifecycleService.archive(lifecycleId, this.props.containerId).then(response => {
			this.setState({loading: false})
			if(response.ok){
				toast.success("Le cycle de vie a été archivé")
				this.componentDidMount()
			}
			else {
				toast.error("Le cycle de vie n'a pas été archivé")
			}
		})
	}

	moreActions = (val) => {
		return (
			<td className="td-left">
				<div className={'btn-toolbar'}>
					<WizardConfirm
						buttonTitle={"Archiver".toUpperCase()}
						onConfirm={() => this.setObsolete(val.id)}
						dialogMessage="Archiver le cycle de vie?"
						dialogTitle={"Archiver le cycle de vie".toUpperCase()}/>
				</div>
			</td>
		)
	}

	moreActions2 = (val) => {
		return (
			<td className="td-left" width={'5%'}>
				<div className={'btn-toolbar'}>
					<Link onClick={e => this.selectLifecycle(e, val.id)}>
						<i className={'fa fa-chevron-right fa-lg'}></i>
					</Link>
				</div>
			</td>
		)
	}

	/**
	 * Generates context menu
	 */
	editAction = (val) => {
		if(val.workInfo.lockedSince !== null && val.workInfo.lockedSince !== ''){
			return (
					<td className="td-left">
						<Button onClick={e => this.edit(e, val.id)}><i className="fa fa-edit"></i>&nbsp;EDIT</Button>
					</td>
			)
		}
		return <td></td>
	}

	selectLifecycle(e, id){
		if(e) e.preventDefault();
		const url = coreUri.backOfficeViewURL("platform", "lifecycles", ["rootId=" +  id]);
		this.props.history.push(url)
	}

	 /**
	 * Generates href with link to details view
	 */
	linkTo = (val, item) => {
		let link = this.url(item.attributes.id)
		return <td>
				<Link className={'table-link'} onClick={e=>this.selectLifecycle(e,item.attributes.id)}>{val.name}</Link>
		</td>
	}

	url(itemId){
		let link = null
		if(this.props.detailsViewUriProvider){
			link = this.props.detailsViewUriProvider(itemId);
		}
		else {
			const uri = this.props.location.pathname
			link = uri + itemId
		}
		return link
	}

	goToPage(i){
		let queryFilters = {...this.state.queryFilters}
		queryFilters.page = i
		this.setNavCriteriasPage(i)
		this.setState({
			queryFilters: queryFilters
		})
	}

	viewPrimaryContent(e, item){
		e.preventDefault()
		contentHolderService.downloadPrimaryContent(item.id, this.props.containerId).then( response => {
			let blob = new Blob([response], { type: 'text/plain' });
			let blobUrl = URL.createObjectURL(blob);
			let w = window.open(blobUrl)
		})
	}

	loadData(viewMode){

		let currentViewMode = this.state.viewMode;
		this.setState({
			loading: true,
			viewMode: viewMode ? viewMode : currentViewMode
		})

		let queryFilters = {...this.state.queryFilters}
			containerService.getAllLifecycles(this.props.containerId, queryFilters.page, queryFilters.rowPerPage, queryFilters.includeParentsItem).then(json => {
				this.setState({
					items: json && json.data ? json.data : [],
					metaData:  json && json.data ? json.metaData : {},
					loading: false,
					viewMode: viewMode ? viewMode : currentViewMode
				})
			})
			.catch(error => {
				console.error(error);
				this.setState({loading: false,})
			})
	}

	includeParentsItemCheck(e){
		let queryFilters = {...this.state.queryFilters}
		queryFilters.includeParentsItem = e.target.checked
		this.setState({
			queryFilters: queryFilters
		})
	}

	componentDidUpdate(prevprops, prevState){
		if(prevState.queryFilters !== this.state.queryFilters){
			this.loadData()
		}

		if(prevState.viewMode !== this.props.viewMode){
			this.setState({viewMode: this.props.viewMode})
		}
	}

	componentDidMount(){
		this.setNavCriteriasPage(0)
		this.loadData()
	}

	commonHeader(){
		return ( <div className="katappult-admin-header shadowed-pane">
			<div>
			    <ButtonToolbar  className="justify-content-between">
					<ButtonGroup>
						<Button  onClick={e=>this.switchToView(e, 'synch')}><i className="fa fa-md fa-cloud-upload"></i> Upload</Button>
						<Button  onClick={e=>this.refreshView()}><i className="fa fa-md fa-refresh"></i> Refresh</Button>
						<Button  onClick={e=>this.switchToView(e, 'viewList')}><i className="fa fa-md fa-th-list"></i> Navigate</Button>
					</ButtonGroup>
					<ButtonGroup>
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
		</div>
	 )
	}

	getRootObjectForDetailsId(){
			const queryUrlParams = queryString.parse(this.props.location.search);
			let objectforDetailsId = queryUrlParams.rootId;
			return objectforDetailsId
	}

	onCreateSuccess(wizardCloseFunction){
		wizardCloseFunction()
		this.componentDidMount()
	}

	newLifecycleWizardContent(wizardCloseFunction){
		return <>
			<LifecycleAdd onCreateSucess={()=>this.onCreateSuccess(wizardCloseFunction)}{...this.props}/>
		</>
	}

	render() {
		let content,headerActions, header = this.commonHeader();

		let objectforDetailsId = this.getRootObjectForDetailsId()
		if(!objectforDetailsId){
				const items = this.state.items;
				const metaData = this.state.metaData;
				const tableConfig = {
						columnsConfig: [
						  	{ name: 'Nom', displayComponent: (v, i) => this.linkTo(v,i), dataField: 'attributes', defaultSortOrder: 'asc', headerClassName: 'td-left', className: 'td-left' },
						  	{ name:'Description', dataField: 'attributes.description', headerClassName: 'td-left', className: 'td-left'},
		        		    { name:'Modification', dataField: 'attributes.lastModifiedDate', dateFormat: 'DD/MMM/YYYY', headerClassName: 'td-left', className: 'td-left' },
						  	{ displayComponent: (e, v) => this.moreActions(e, v.id), dataField: 'attributes', headerClassName: 'td-left', className: 'td-left'},
							{ displayComponent: (e, v) => this.moreActions2(e, v.id), dataField: 'attributes', headerClassName: 'td-left', className: 'td-left'},
						],
				}

				if(this.state.loading === true){
					content = <WaitingPane />
				}
				else if(items !== null && items.length > 0){
					content = <DataTable items={JSON.stringify(items)}
								tableClassName="data-table"
								goToPage={this.goToPage}
								pagination={true}
								displayTotalElements={true}
								metaData={JSON.stringify(metaData)}
								tableConfig={tableConfig}/>
				}
				else {
					content = <EmptyPane mainMessage="Pas de cycle de vie dans le conteneur courant" />
				}

			return <div className="portlet-box lifecycles">
    			  <div className="portlet-content">
					  {content}
    			  </div>
    		</div>
		}

		return <LifecycleDetails
					{...this.props}
					refreshListView={this.refreshView}
					pushBreadCrumb={this.props.pushBreadCrumb}/>

	}
}

export default connect(mapStateToProps, mapDispatchToProps) (Lifecycles)

export const updateLifecyclesCriterias = (payload) => ({
    type: 'APPLICATION_UPDATE_LIFECYCLE_NAV_CRITERIAS',
    payload: payload
});
