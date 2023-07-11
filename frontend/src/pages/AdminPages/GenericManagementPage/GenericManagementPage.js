import React, { Component } from 'react';
import{
	AppVersions,
	BusinessRules,
	Lifecycles,
	EmailTemplates,
	FolderTemplates,
	TeamTemplates,
	Types,
	DataLoaderHistory,
	ContainerSwitcher,
}
	from '_components/_admin';
import{
	ManageContainerUsers,
	AppBreadcrumb,
	Enumerations,
	WaitingPane
}
	from '_components/_common';
import { connect } from 'react-redux';
import { commons } from '_helpers/commons';
import queryString from 'query-string';
import DataExportList from "_components/_admin/DataExport/DataExportList";
import CronTaskList from "_components/_admin/CronTask/CronTaskList";
import DataImport from "_components/_admin/Dataloader/DataImport";
import ErrorCodeList from "_components/_admin/ErrorCode/ErrorCodeList";
import PrimaryContextMenu from "pages/AdminPages/GenericManagementPage/PrimaryContextMenu";
import {coreUri} from "_helpers/CoreUri";
import BadgeList from "_generated/Badge/BadgeList";
import PointerList from "_generated/Pointer/PointerList";
import CardRequestList from "_generated/CardRequest/CardRequestList";
import ResourceAccessList from "_generated/ResourceAccess/ResourceAccessList";
// IMPORT

const mapStateToProps = store => ({
	managementPageSelectedTab: store.navigationConfig.config,
})

const mapDispatchToProps = (disptach) => ({
	setManagementPageSelectedTab: (e) => disptach(setManagementPageSelectedTab(e)),
})

class GenericManagementPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			sidebarOpen: true,
		}

		this.setDisplayedView = this.setDisplayedView.bind(this);
		this.pushBreadCrumb = this.pushBreadCrumb.bind(this);
		this.popBreadCrumb = this.popBreadCrumb.bind(this);
		this.popView = this.popView.bind(this);
		this.selectHomePage = this.selectHomePage.bind(this);
		this.popBreadCrumbAt = this.popBreadCrumbAt.bind(this);
	}

	selectHomePage(){
		this.setState({
			viewName: 'businessRules',
			location: 'Règles métiers',
			breadItems:[{href:'#', title:'Règles métiers'}],
			viewMode: 'viewList',
			menuGroup: 'platform'
		})
	}

	componentDidMount(){
		this.selectHomePage();
	}

	componentDidUpdate(prevProps, prevState) {
		// url is like this: /view?tab=xx&name=xy
		let tabName = commons.getValueFromUrl('tab');
		let viewName = commons.getValueFromUrl('name');

		if (viewName !== prevState.viewName) {
			const payload = this.getViewContentToDisplay(viewName, tabName);
			if (payload) {
				this.setState({
					viewName: payload.viewName,
					breadItems: payload.breadItems,
					location: payload.location,
					viewMode: payload.viewMode,
					menuGroup: tabName,
				})
			}
		}
	}

	popView(viewMode){
		this.setState({
			viewMode: viewMode
		})
	}

	setDisplayedView(e, viewName, tabName){
		e.preventDefault();
		e.stopPropagation()
		const url = coreUri.backOfficeViewURL(tabName, viewName);
		this.props.history.push(url);
	}

	loading(){
		return <WaitingPane />
	}

	pushBreadCrumb(item){
		let breadItems = this.state.breadItems ? this.state.breadItems.slice() : [];
		breadItems.push(item);
		this.setState({
			breadItems: breadItems,
			viewMode: 'viewDetails',
		})
	}

	popBreadCrumb(item){
		let index = this.state.breadItems.indexOf(item);
		if(index === 0 && this.state.breadItems.length > 1){
			let items = this.state.breadItems.slice();
			items.pop();
			this.setState({
				breadItems: items,
				viewMode: 'viewList'
			})
		}
	}
	popBreadCrumbAt(index){
		if(index === 0 && this.state.breadItems.length > 1){
			let items = this.state.breadItems.slice();
			items.pop();
			this.setState({
				breadItems: items,
				viewMode: 'viewList'
			})
		}
	}

	businessRules(){
		let comp = <BusinessRules
			{...this.props}
			viewMode={this.state.viewMode}
			pushBreadCrumb={this.pushBreadCrumb}
			popBreadCrumb={this.popBreadCrumbAt}/>
		return this.strechedPage(comp);
	}
	lifecycles(){
		let comp = <Lifecycles
			{...this.props}
			viewMode={this.state.viewMode}
			pushBreadCrumb={this.pushBreadCrumb}/>
		return this.strechedPage(comp);
	}
	types(){
		let comp = <Types {...this.props}/>
		return this.strechedPage(comp);
	}
	mailTemplates(){
		let comp = <EmailTemplates
			{...this.props}
			viewMode={this.state.viewMode}
			pushBreadCrumb={this.pushBreadCrumb}
		/>
		return this.strechedPage(comp);
	}
	members(){
		let comp = <ManageContainerUsers
			{...this.props}
			viewMode={this.state.viewMode}
			pushBreadCrumb={this.pushBreadCrumb}/>
		return this.strechedPage(comp);
	}
	switchContainer(){
		let comp = <ContainerSwitcher
			{...this.props}
			viewMode={this.state.viewMode}
			pushBreadCrumb={this.pushBreadCrumb}
			adminPageUrl ='/admin?tab=platform'/>
		return this.strechedPage(comp);
	}
	folderTemplates(){
		let comp =  <FolderTemplates
			{...this.props}
			viewMode={this.state.viewMode}
			pushBreadCrumb={this.pushBreadCrumb}/>
		return this.strechedPage(comp);
	}
	teamTemplates(){
		let comp =  <TeamTemplates
			{...this.props}
			viewMode={this.state.viewMode}
			pushBreadCrumb={this.pushBreadCrumb}/>
		return this.strechedPage(comp);
	}
	dataLoader(){
		let comp = <DataLoaderHistory
			{...this.props}
			viewMode={this.state.viewMode}
			pushBreadCrumb={this.pushBreadCrumb} />
		return this.strechedPage(comp);
	}
	enumerations(){
		let comp =  <Enumerations
			{...this.props}
			viewMode={this.state.viewMode}
			pushBreadCrumb={this.pushBreadCrumb} />
		return this.strechedPage(comp);
	}
	about() {
		let comp = <AppVersions
			{...this.props}
			viewMode={this.state.viewMode}
			pushBreadCrumb={this.pushBreadCrumb}/>
		return this.strechedPage(comp);
	}

	getAllMenuItems () {
		const tabName = commons.getValueFromUrl("tab");
		const menuContent = [];

		const allMenus = this.getSuperAdministratorMenu();
		allMenus.map(entry => {
			if(entry.menuGroup === tabName) {
				menuContent.push(entry);
			}
		})

		return menuContent;
	}

	getViewContentToDisplay(viewName, tabName){
		let menuConfig, allMenuContent = this.getAllMenuItems();

		if(tabName) {
			allMenuContent.map(config => {
				if(config.key === viewName && config.menuGroup === tabName){
					menuConfig = config;
				}
			})

			if(!menuConfig) { return; }

			let payload ={}
			payload.breadItems = menuConfig.breadItems
			payload.viewName = menuConfig.key;
			payload.viewMode = 'viewList';
			payload.menuGroup = menuConfig.menuGroup;
			payload.location = menuConfig.name
			return payload;
		}
	}

	export(){
		let comp = <DataExportList {...this.props}/>
		return this.strechedPage(comp);
	}

	importDatas(){
		let comp = <div className="portlet-box">
			<div className="portlet-content">
				<DataImport {...this.props}/>
			</div>
		</div>
		return this.strechedPage(comp);
	}

	cron(){
		let comp = <CronTaskList {...this.props}/>
		return this.strechedPage(comp);
	}

	errorCodes(){
		return <ErrorCodeList  {...this.props}/>
	}

	badge() {
    	var comp = <BadgeList {...this.props}/>
    	return this.strechedPage(comp);	}

pointer() {
    	var comp = <PointerList {...this.props}/>
    	return this.strechedPage(comp);	}

cardrequest() {
    	var comp = <CardRequestList {...this.props}/>
    	return this.strechedPage(comp);	}

resourceaccess() {
    	var comp = <ResourceAccessList {...this.props}/>
    	return this.strechedPage(comp);	}

// METHODS

	getSuperAdministratorMenu(){
		const adminMenuconfig = [
			{name:"Règles métiers", key:"businessRules", comp: this.businessRules(), visible: true, className:'fa-map-signs', breadItems:[{href:'#', title:'Business rules'}], menuGroup: 'platform'},
			{name:"Types métiers", key:"types", comp: this.types(), visible: true, className:'fa-cubes', breadItems:[{href:'#', title:'Business types'}], menuGroup: 'platform'},
			{name:"Cycles de vie", key:"lifecycles", comp: this.lifecycles(), visible: true, className:'fa-retweet', breadItems:[{href:'#', title:'Lifecycles'}], menuGroup: 'platform'},
			{name:"Code d'erreurs", key:"errorCodes", comp: this.errorCodes(), visible: true, className:'fa-group', breadItems:[{href:'#', title:"Code d'erreurs"}], menuGroup: 'platform'},
			{name:"Template de mail", key:"emailTemplates", comp: this.mailTemplates(), visible: true, className:'fa-envelope', breadItems:[{href:'#/admin?tab=platform&v=emt&u=va', title:'Email templates'}], menuGroup: 'platform'},
			{name:"Conteneurs", key:"conteneurs", comp: this.switchContainer(), visible: true, className:'fa-sliders', breadItems:[{href:'#', title:'Conteneurs'}], menuGroup: 'platform'},
			{name:"Membres", key:"members", comp: this.members(), visible: true, className:'fa-group', breadItems:[{href:'#', title:'Membres'}], menuGroup: 'platform'},
			//{name:"Folder templates", key:"folderTemplates", comp: this.folderTemplates(), visible: true, className:'fa-folder', breadItems:[{href:'#', title:'Folder templates'}], menuGroup: 'platform'},
			//{name:"Templates d'équipe", key:"teamTemplates", comp: this.teamTemplates(), visible: true, className:'fa-users', breadItems:[{href:'#', title:'Team templates'}], menuGroup: 'platform'},
			//{name:"Enumerations", key:"enumerations", comp: this.enumerations(), visible: true, className:'fa-list', breadItems:[{href:'#', title:'Enumerations'}], menuGroup: 'platform'},
			{name:"Import de données", key:"import", comp: this.importDatas(), visible: true, className:'fa-download', breadItems:[{href:'#', title:'Import'}], menuGroup: 'platform'},
			{name:"Export de données", key:"export", comp: this.export(), visible: true, className:'fa-upload', breadItems:[{href:'#', title:'Export'}], menuGroup: 'platform'},
			{name:"Tâches périodiques", key:"crons", comp: this.cron(), visible: true, className:'fa-tasks', breadItems:[{href:'#', title:'Tâches périodiques'}], menuGroup: 'platform'},
			//{name:"Batchs", key:"dataLoader", comp: this.dataLoader(), visible: true, className:'fa-exchange', breadItems:[{href:'#', title:'Jobs history'}], menuGroup: 'platform'},
			{name:"Modules", key:"about", comp: this.about(), visible: true, className:'fa-info-circle', dividerAfter:true, breadItems:[{href:'#', title:'Installed modules'}], menuGroup: 'platform'},

									{name:"Badge", key:"badge", comp: this.badge(), visible: true, className:'', breadItems:[{href:'#', title:'Badge'}], menuGroup: 'home'},
						{name:"Pointeur", key:"pointer", comp: this.pointer(), visible: true, className:'', breadItems:[{href:'#', title:'Pointeur'}], menuGroup: 'home'},
						{name:"Requête", key:"cardrequest", comp: this.cardrequest(), visible: true, className:'', breadItems:[{href:'#', title:'Requête'}], menuGroup: 'home'},
						{name:"Ressource", key:"resourceaccess", comp: this.resourceaccess(), visible: true, className:'', breadItems:[{href:'#', title:'Ressource'}], menuGroup: 'home'},
// MENU
		];

		return adminMenuconfig;
	}

	getHiddenMenu(){
		const hiddenMenuConfig = [
			{name:"Membres", key:"members", comp: this.members(), visible: true, className:'fa-users', breadItems:[{href:'#/admin?tab=platform&v=emailTemplates&u=va', title:'Members'}]},
			{name:"Conteneurs", key:"manageContainers", comp: this.switchContainer(), visible: true, className:'fa-map-signs', breadItems:[{href:'#', title:'Containers'}]},
		];
		return hiddenMenuConfig;
	}

	strechedPage(comp){
		return comp;
	}

	goBackToListView(e){
		e.preventDefault();
		let pathname = window.location.href.split('?')[0]

		const queryUrlParams = queryString.parse(this.props.location.search);
		let viewName = queryUrlParams.v;
		let tab = queryUrlParams.tab;

		this.props.history.push(pathname.split('#')[1] + '?tab=' + tab + '&name=' + viewName);
	}

	render (){
		if(this.state.loading === true){
			return this.loading()
		}

		let errors = [];
		if(this.state.errors && this.state.errors.length > 0) {
			this.state.errors.map(error => {
				errors.push(<p>{error}</p>)
			})
		}

		let content, eachMenuItems = this.getAllMenuItems();
		eachMenuItems.map(eachMenuItem => {
			if(eachMenuItem.key === this.state.viewName){
				content = eachMenuItem.comp;
			}
		});

		if(!content){
			content = <>View name {this.state.viewName} not found</>
		}

		let containerName = commons.getWorkingContainerName(this.props.userContext);
		let headerClassName = this.state.viewName +'-list-header admin-breadcrumb';
		let contentClassName = this.state.viewName +'-list-content'

		return (<div className="admin-content-root">
				<div className="admin-content-left-root">
					<PrimaryContextMenu
						{...this.props}
						hideVerticalMenu={true}
						menuContent={this.getAllMenuItems()}
						setDisplayedView={this.setDisplayedView}/>
				</div>

				<div className="admin-content-right-root">
					<div className={headerClassName}>
						<h2>
							<a href={'#'} onClick={
								(e)=> {
									e.preventDefault();
									this.props.history.goBack();
								}}
							>
								<i className={'fa fa-lg fa-angle-left'}></i>&nbsp;&nbsp;&nbsp;
							</a>
							<a href={'#'} onClick={(e)=>this.goBackToListView(e)}>
								{this.state.location}
							</a>
						</h2>
						<div className="admin-breadcrumb-table">
							<AppBreadcrumb
								popBreadCrumb={(item)=>this.popBreadCrumb(item)}
								items={this.state.breadItems}
								homeUrlAction={(arg)=>this.selectHomePage(arg)}
								homeLabel={containerName}/>
						</div>
					</div>
					<div className={contentClassName}>{content}</div>
				</div>
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps) (GenericManagementPage)

export const setManagementPageSelectedTab = (payload) => ({
	type: 'SET_ADMIN_HOME_ACTIVE_TAB',
	payload: payload
});
