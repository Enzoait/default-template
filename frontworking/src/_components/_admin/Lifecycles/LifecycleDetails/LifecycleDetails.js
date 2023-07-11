import React, { Component } from 'react';
import { connect } from 'react-redux';
import {ButtonToolbar} from 'reactstrap';
import { AllIterations } from '_components/_common';
import { lifecycleService } from '_services/lifecycle.services';
import { contentHolderService } from '_services/contentHolder.services';
import { commons } from '_helpers/commons';
import {
	AttributeListGroup,
	WorkInfo,
	PersistenceInfo,
	WorkableAction,
	RevControlledAction,
	WaitingPane,
}
from '_components/_common';
import
	RevControlledDetailsHeader from '_components/_common/RevControlled/RevControlledDetailsHeader';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button'
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/themes/prism-dark.css';
import queryString from 'query-string';
import {LifecycleTransitions} from "_components/_admin/Lifecycles";
import {Accordion} from "_components/_common";

const mapStateToProps = store => ({

});

const mapDispatchToProps = (disptach) => ({

})

class LifecycleDetails extends Component {

	constructor(props){
		super(props);
		this.state = {
			loading: true,
			item: {},
			detailsMode: 'details',
			xml: '<PleaseWait>Loading...</PleaseWait>',
			itemId: this.getRootObjectForDetailsId(),
		}

		this.doRefreshListView = this.doRefreshListView.bind(this)
		this.updateMasterDatas = this.updateMasterDatas.bind(this)
		this.loadDatas = this.loadDatas.bind(this)
		this.renderItemActions = this.renderItemActions.bind(this)
		this.saveEditorContent = this.saveEditorContent.bind(this)
		this.setXMLContent = this.setXMLContent.bind(this)
		this.setLoading = this.setLoading.bind(this)
		this.onAllIterationsSelected = this.onAllIterationsSelected.bind(this)
		this.onDetailsSelected = this.onDetailsSelected.bind(this)
		this.getRootObjectForDetailsId = this.getRootObjectForDetailsId.bind(this)
		this.switchOriginFromToWorkingCopy = this.switchOriginFromToWorkingCopy.bind(this)
	}

	showXML(){
		this.setState({detailsMode: 'xml'})
	}

	showDetails(){
		this.setState({detailsMode: 'details'})
	}

	onDetailsSelected(){
		this.setState({subviewMode: 'details'})
	}

	onAllIterationsSelected(){
		this.setState({subviewMode: 'allIterations'})
	}

	onAfterUndoCheckout(response){

	}
	getBreadCrumbLabel(responseJson){
		return responseJson.data.masterAttributes.name;
	}
	componentDidUpdate(prevProps, prevstate){
				const prevQueryUrlParams = queryString.parse(prevProps.location.search);
				const queryUrlParams = queryString.parse(this.props.location.search);
				let rootId = queryUrlParams.rootId;
				let prevId = prevQueryUrlParams.rootId;
				if(prevId !== rootId && rootId){
					this.loadDatas(rootId, false)
				}
	}

	componentDidMount(){
		let itemId = this.getRootObjectForDetailsId();
		this.loadDatas(itemId, false);
	}

	loadDatas(itemId, updateBreadCrumb){
		if(itemId){
			this.setState({loading: true, item:null});

			lifecycleService.details(itemId, this.props.containerId).then(responseJson => {

				let iterationId = responseJson.data.attributes.id
				if(updateBreadCrumb === true){
					let location = responseJson.data.masterAttributes.name;
					if(this.props.pushBreadCrumb){
						let item = {'href': '#', title: location}
						this.props.pushBreadCrumb(item)
					}
				}

				this.setState({
					item: responseJson,
					loading: false
				});

				return iterationId
	        }).then(iterationId => {
				contentHolderService.downloadPrimaryContent(iterationId, this.props.containerId).then(blob => {
					this.setState({xml: blob})
				});
			}).catch(error => {
	        	console.error(error);
	        	this.setState({loading: false});
	        });


		}
	}

	updateMasterDatas(formData){
		lifecycleService.updateMasterAttributes(formData.attributes.id, formData, this.props.containerId).then(response => {
			this.loadDatas(this.getRootObjectForDetailsId(), false)
		})
	}
	setLoading(){
		this.setState({loading: true})
	}
	renderItemSummary(data){
		return <RevControlledDetailsHeader
			containerId={this.props.containerId}
			displayName={data.masterAttributes.name}
			description={data.masterAttributes.description}
			lifecycleCurrentState="VALID"
			businessTypeDisplayName="Standard Lifecycle"
			versionInfo={data.attributes.versionInfo}
			iterationInfo={data.attributes.iterationInfo}
			workInfo={data.attributes.workInfo}
			headerActionsProvider={() => this.renderItemActions(data)}
			headerClassName="admin-details-header"
		/>
	}

	doRefreshListView(){
		//this.props.refreshListView('viewDetails')
	}

	switchOriginFromToWorkingCopy(currentItemIdParam){
    	this.props.history.replace('/admin?v=lifecycles&rootId=' + currentItemIdParam)
	}

	renderItemActions(data){
		if(this.state.subviewMode === 'allIterations') {
			return <>
				<Button onClick={this.onDetailsSelected}>
					<i className="fa fa-arrow-left fa-sm"></i>&nbsp;BACK</Button>
			</>
		}

		return <>
			{(this.state.detailsMode === 'details') && <button onClick={this.showXML.bind(this)}>XML</button>}
			{(this.state.detailsMode === 'xml')&& <button onClick={this.showDetails.bind(this)}>DETAILS</button>}
			<RevControlledAction
				containerId={this.props.containerId}
				loadDatas={this.loadDatas}
				onAllIterationsSelected={() => this.onAllIterationsSelected()}
				revControlledId={data.attributes.id}
				iterationInfo={data.attributes.iterationInfo}
				revControlledId={data.attributes.id}/>
			<WorkableAction
				containerId={this.props.containerId}
				workInfo={data.attributes.workInfo}
				iterationInfo={data.attributes.iterationInfo}
				workableId={data.attributes.id}
				loadDatas={this.loadDatas}
				refreshListView={this.doRefreshListView}
				originalItemId={this.props.itemId}/>
		</>
	}
	renderAttributes(){
		const lifecycleStatusAttributesList = {
			    onSubmit: (formData) => this.updateMasterDatas(formData),
			    attributes: [
			    	{name: 'Name', dataField: 'masterAttributes_name'},
			        {name: 'Number', dataField: 'masterAttributes_number', readOnly: true},
			        {name: 'Description', dataField: 'masterAttributes_description'},
			        {name: 'Initial state',  dataField: 'attributes.initialState', readOnly: true},
			        {name: 'Terminal state',  dataField: 'attributes.terminalState', readOnly: true},
			    ]
		}

		const data = this.state.item.data;
		const d = commons.toJSONObject(data);
		let canUpload = d.attributes.workInfo.isWorkingCopy === true;
		return <div className={'lifecycle-details'}>
					<AttributeListGroup
						containerId={this.props.containerId}
						attributesListConfig={lifecycleStatusAttributesList}
						data={d}
						canEdit={canUpload}
						addHeaderMargin="true"
						standardFooterActions={canUpload}
						displayHeader={true}/>

					<WorkInfo {...this.props} data={d}
						containerId={this.props.containerId}
						displayHeader={true}
						addHeaderMargin='true'
						displayActions='false'/>

					<PersistenceInfo
						{...this.props} data={d}
						containerId={this.props.containerId}
						displayHeader={true}
						addHeaderMargin="true"/>
		</div>
	}

	saveEditorContent(){
    	let rawcontent = this.state.xml;

    	let contentHolderId = this.state.item.data.attributes.id;
    	let file = new Blob([rawcontent], {type: 'text/plain'});
		let formData = new FormData();
		formData.append('file', file);

		contentHolderService.setPrimaryContentFile(contentHolderId, formData, this.props.containerId).then( response => {
			let errors = [];
			if(response.status === 'error'){
				toast.success(commons.toastError(response))
	    		this.setState({
    				errors: errors,
    				loading: false
    			})
	    	}
	    	else {
				toast.success("Le contenu a été enregistré");
				this.setState({
    				errors: [],
    				loading: false,
    			})
	    	}
    	})
    }

    setXMLContent(contentXml){
    	this.setState({
    		xml: contentXml
    	})
    }

	getRootObjectForDetailsId(){
			const queryUrlParams = queryString.parse(this.props.location.search);
			let objectforDetailsId = queryUrlParams.rootId;
			return objectforDetailsId
	}

	getXmlContent(){
		const data = this.state.item?.data;
		const d = commons.toJSONObject(data);
		let canUpload = d.attributes.workInfo.isWorkingCopy === true

		if(this.state.detailsMode === 'xml'){
			return <>
				<div className="lifecycle-pane">
						<Editor onValueChange={this.setXMLContent}
								value={this.state.xml}
								highlight={code => highlight(code, languages.markup, 'markup')}
								padding={10}
								style={{
									fontFamily: '"Fira code", "Fira Mono", monospace',
									fontSize: 12,
								}}
						/>
				</div>

				{ canUpload && <ButtonToolbar style={{
					marginTop: '2rem'
				}}>
						<Button onClick={this.saveEditorContent}>Enregistrer</Button>
					</ButtonToolbar>
				}
			</>
		}

		return <></>
	}

	getDetailsContent(){
		if(this.state.detailsMode === 'details'){
			return <>
				<Accordion title={'Métadonnées'} content={this.renderAttributes()} expanded={false}/>
				<Accordion title={'Transitions'} content={this.getTransitionsContent()} expanded={true}/>
			</>
		}

		return <></>
	}

	getTransitionsContent(){
		const data = this.state.item.data;
		return <LifecycleTransitions {...this.props}
					 lifecycleId={data.attributes.id}
					 lifecycleName={data.attributes.masterAttributes_name}/>
	}

	render() {

		if(this.state.loading === true){
			return <WaitingPane />
		}

		const data = this.state.item?.data;
		if(data){
			let content;
			if(this.state.subviewMode === 'allIterations'){
				content =  <AllIterations
								containerId={this.props.containerId}
								name={data.masterAttributes.name}
								description={data.masterAttributes.description}
								revControlledId={data.attributes.id}/>
			}
			else {
				content = <>
					{this.getXmlContent()}
					{this.getDetailsContent()}
				</>
			}

			return <>
					{this.renderItemSummary(data)}
					{content}
			</>
		}

		return <></>
	}
}

export default connect(mapStateToProps, mapDispatchToProps) (LifecycleDetails);
