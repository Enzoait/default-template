import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {Input, ButtonGroup,} from 'reactstrap';
import {
	EmptyPane, WaitingPane,
	DataTable
}
from '_components/_common';
import {EmailTemplateDetails} from '_components/_admin';
import { connect } from 'react-redux';
import { enTemplateService } from '_services/entemplates.services';
import { containerService } from '_services/container.services';
import { Form } from 'react-bootstrap'
import {contentHolderService} from '_services/contentHolder.services'
import Button from 'react-bootstrap/Button'
import queryString from 'query-string';
import {coreUri} from '_helpers/CoreUri'
import EmailTemplatesAdd from "_components/_admin/EmailTemplates/EmailTemplatesAdd";
import {commons} from "_helpers/commons";

const mapStateToProps = store => ({
	emailTemplatesNavCriterias: store.applicationConfig.emailTemplatesNavCriterias,
})

const mapDispatchToProps = (disptach) => ({
	updateEmailTemplatesNavCriteriasRX: (e) => disptach(updateEmailTemplatesNavCriterias(e)),
})


/**
 * Email templates page
 */
class EmailTemplates extends Component {

	constructor(props){
		super(props);
		this.state = {
			items: [],
			metaData: '',
			loading: true,
			queryFilters:{
				rowPerPage: 14,
				page: 0,
				includeParentsItem: true,
				name: ''
			},

			viewMode: 'viewList'
		}

		this.goToPage = this.goToPage.bind(this)
		this.loadDatas = this.loadDatas.bind(this)
		this.includeParentsItemCheck = this.includeParentsItemCheck.bind(this)
		this.viewPrimaryContent = this.viewPrimaryContent.bind(this)
		this.switchToView = this.switchToView.bind(this)
		this.refreshView = this.refreshView.bind(this)
	}

	refreshView(){
		this.componentDidMount()
	}

	switchToView(e, name){
		if(e) e.preventDefault()
		this.setState({viewMode: name})
	}

	setNavCriteriasPage(page, name){
		let payload = {};
		payload.page = page;
		payload.name = name;
		this.props.updateEmailTemplatesNavCriteriasRX(payload)
	}

	goToPage(i){
		let queryFilters = {...this.state.queryFilters}
		queryFilters.page = i
		this.setNavCriteriasPage(i, queryFilters.name)
		this.loadDatas(queryFilters)
	}

	viewPrimaryContent(e, item){
		e.preventDefault()
		contentHolderService.downloadPrimaryContent(item.id, this.props.containerId).then( response => {
			let blob = new Blob([response], { type: 'text/plain' });
			let blobUrl = URL.createObjectURL(blob);
			let w = window.open(blobUrl)
		})
	}

	moreActions = (val,item) => {
			return <td className="dt-center" width={'5%'}>
				<div className={'btn-toolbar'}>
					<Link onClick={e=>this.selectTemplate(e, item.attributes.id)}>
						<i className={'fa fa-chevron-right fa-lg'}></i>
					</Link>
				</div>
			</td>
	}

	componentDidUpdate(prevProps, prevState){
		if(this.props.emailTemplatesNavCriterias.name
			&& this.props.emailTemplatesNavCriterias.name.length > 0){
			if(this.props.emailTemplatesNavCriterias.name !== this.state.searchTerm){
				this.setState({searchTerm: this.props.emailTemplatesNavCriterias.name})
			}
		}

		if(prevState.queryFilters !== this.state.queryFilters){

		}

		if(prevState.viewMode !== this.props.viewMode){
			this.setState({viewMode: this.props.viewMode})
		}
	}

	componentDidMount(){
		this.setNavCriteriasPage(0, '');
		let queryFilters = {...this.state.queryFilters};
		this.getAllEnTemplates(queryFilters)
    }

	getRootObjectForDetailsId(){
			const queryUrlParams = queryString.parse(this.props.location.search);
			let objectforDetailsId = queryUrlParams.rootId;
			return objectforDetailsId
	}

	loadDatas(queryFilters){
		let containerId = this.props.containerId;
		let params = {name: queryFilters.name,
			page: queryFilters.page,
			containerId: containerId,
			pageSize: queryFilters.rowPerPage,
			includeParentItems: false
		};

		this.setNavCriteriasPage(queryFilters.page, queryFilters.name);
		this.setState({loading: true});

		enTemplateService.seartTemplateByNameLike(containerId, params).then(json => {
        	this.setState({
        		items: json.data,
        		loading:false,
        		metaData: json.metaData,
        		queryFilters: queryFilters,
        		viewMode: 'viewList'
        	})
        })
        .catch(error => {
        	console.error(error);
        	this.setState({
        		loading:false,
        		viewMode: 'viewList'
        	})
        });
	}

	getAllEnTemplates(){
		let queryFilters = {...this.state.queryFilters}
		containerService.getAllEmailTemplates(queryFilters.page, queryFilters.rowPerPage, queryFilters.includeParentsItem, this.props.containerId).then(json => {
        	this.setState({
        		items: json.data,
        		loading:false,
        		metaData: json.metaData,
        		viewMode: 'viewList',
        		searchTerm: queryFilters.name
        	})
        })
        .catch(error => {
        	console.error(error);
        	this.setState({
        		loading:false,
        		viewMode: 'viewList'
        	})
        });
	}

	includeParentsItemCheck(e){
		let queryFilters = {...this.state.queryFilters}
		queryFilters.includeParentsItem = e.target.checked
		this.setState({
			queryFilters: queryFilters
		})
	}

	tableHeader(){
		return(
			<div>
				<h1 className="katappult-h1">Email templates</h1>
				<div className={'btn-toolbar'}>
						<ButtonGroup>
							<Button className="katappult-btn" onClick={e=>this.switchToView(e, 'synch')}><i className="fa fa-md fa-cloud-upload"></i> Upload</Button>
							<Button className="katappult-btn" onClick={e=>this.switchToView(e, 'viewList')}><i className="fa fa-md fa-th-list"></i> Navigate</Button>
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
				</div>
				<div className={'btn-toolbar-right'}>
					<Button className="katappult-btn" onClick={e=>this.refreshView()}><i className="fa fa-md fa-refresh"></i> Recharger</Button>
				</div>
		    </div>
		)
	}

	getDetailsViewsUrl(id){
		let link
		if(this.props.detailsViewUriProvider){
			link = this.props.detailsViewUriProvider(id)
		}
		else {
			const uri = this.props.location.pathname
			link = uri + '/' + id
		}
		return link
	}

	selectTemplate(e, id){
		if(e) e.preventDefault();
		let tabName = commons.getValueFromUrl('tab');
		const url = coreUri.backOfficeViewURL(tabName, "emailTemplates", ["rootId=" +  id]);
		this.props.history.push(url);
	}

	linkTo = (val, item) => {
		return <>
			<div className={'table-list-admin-root-list-div'}>
				<span className={'table-link'}>{val.displayName}</span>
				<div className={'table-list-admin-root-list-desc1'}>{item.attributes.messageTitle}</div>
				<div className={'table-list-admin-root-list-desc2'}>{item.attributes.description}</div>
			</div>
		</>
	}

	searchTermUpdated(e){
		let queryFilters = {...this.state.queryFilters}
		queryFilters.name = e.target.value;
		this.loadDatas(queryFilters)
		this.setState({
			queryFilters: queryFilters,
			loading: true,
			viewMode: 'viewList',
			searchTerm: e.target.value
		})
	}

	onCreateSuccess(wizardCloseFunction){
		wizardCloseFunction()
		this.componentDidMount()
	}

	newWizardContent(wizardCloseFunction){
		return <>
			<EmailTemplatesAdd onCreateSucess={()=>this.onCreateSuccess(wizardCloseFunction)}{...this.props}/>
		</>
	}


	render() {
		let items = this.state.items,
        metaData = this.state.metaData,
        content, headerActions;

		let rootObjectForDetailsId = this.getRootObjectForDetailsId()
		if(!rootObjectForDetailsId){
					if(this.state.loading){
							content = <WaitingPane />
					}
					else if(items !== null && items.length > 0) {
			        	const tableConfig = {
							onRowClick : (e, itemId) => this.selectTemplate(e, itemId),
			        		columnsConfig: [
			        		    {name:'Nom', displayComponent: (v, i) => this.linkTo(v,i), dataField: 'attributes', defaultSortOrder: 'asc' },
			        		    { displayComponent: (v, i) => this.moreActions(v, i) },
			        	],
			        }

					content = <div className={'table-list-admin-root-list'}>
						<DataTable items={JSON.stringify(items)}
									paginate={true}
									displayTotalElements={true}
									goToPage={this.goToPage}
									metaData={JSON.stringify(metaData)}
									tableConfig={tableConfig}/>
					</div>
	        }
	        else {
	        		content = <EmptyPane mainMessage='No email templates in current container' />
	        }
		}
		else {
			content = <EmailTemplateDetails {...this.props}/>
		}

    return <div className="">
			    <div className="portlet-content">
					 <div className="main-data-table ">{content}</div>
			    </div>
  		</div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (EmailTemplates)

export const updateEmailTemplatesNavCriterias = (payload) => ({
    type: 'APPLICATION_UPDATE_EMAIL_TEMPLATES_NAV_CRITERIAS',
    payload: payload
});
