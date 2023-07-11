import React, { Component } from 'react';
import { ButtonToolbar,} from 'reactstrap';
import {
	AttributeListGroup,
	Contactable,
	ResetPassword,
	UpdatePassword,
	LockUser,
	UnLockUser,
	DataTable,
	UserSystemSettings,
	WaitingPane,
	Accordion
} from '_components/_common';
import { connect } from 'react-redux';
import { accountService } from '_services/account.services';
import { toast } from 'react-toastify';
import { commons } from '_helpers/commons';
import ContainersMembership  from 'pages/AdminPages/Container/ContainersMembership.js'
import UserRoles from '../UserRoles/UserRoles.js';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import queryString from 'query-string';
import profile from 'assets/img/profile.png'

const mapStateToProps = store => ({
})

class PeopleDetails extends Component {

	constructor(props){
		super(props);
		this.state = {
			item: {},
			accountId: props.accountId ? props.accountId :
				this.props.match ? this.props.match.params.accountId : null,
			loadDataError: false,
            summaryMode: 'view',
			activeTab: '1',
			userProfile: null,
			userAccount: null,
			loading: false
        }

        this.toggle = this.toggle.bind(this);
        this.overviewTabContent = this.overviewTabContent.bind(this);
        this.accountAttributesList = this.accountAttributesList.bind(this);
		this.contactTabContent = this.contactTabContent.bind(this);
		this.updateProfile = this.updateProfile.bind(this);
		this.updateOrgProfile = this.updateOrgProfile.bind(this);
		this.isLocked = this.isLocked.bind(this);
		this.refresh = this.refresh.bind(this);
		this.isCurrentAccountOwner = this.isCurrentAccountOwner.bind(this);
		this.organizationAttributesView = this.organizationAttributesView.bind(this);
		this.overviewTabContent = this.overviewTabContent.bind(this);
		this.getRootObjectForDetailsId = this.getRootObjectForDetailsId.bind(this);
		this.accountRoles = this.accountRoles.bind(this);
		this.accountSystemPrefsContent = this.accountSystemPrefsContent.bind(this)
	}

	getRootObjectForDetailsId(){
		const queryUrlParams = queryString.parse(this.props.location.search);
		let objectforDetailsId = queryUrlParams.rootId;
		return objectforDetailsId
	}

	isLocked(){
		if(this.state.userAccount.locked) return true;
		return false
	}

	updateProfile(formData) {
		let id = formData.id
		accountService.updatePersonProfile(id, formData, this.props.containerId).then(response => {
			this.updateProfileSuccess()
		})
		.catch(error => {
			this.toggle();
			toast.error('Error updating profile!')
			console.error(error)
		});
	}

	updateProfileSuccess(){
		let accountId = this.getRootObjectForDetailsId();
		accountService.accountDetails(accountId, this.props.containerId).then(response => {
			if(this.props.updatePeopleCallBack){
				this.props.updatePeopleCallBack(accountId, false)
			}

			this.setState({
				loadDataError: false,
				userProfile:  response.data.attributes,
			});
		})
	}

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }
    /**
     * Tab pane configuration
     */
    tabsConfigs(){
        const tabsConfig = {
            tabItems: [
                {id: '1', title: 'Utilisateur', tabContent: () => this.overviewTabContent(), visible: () => true},
                {id: '2', title: 'Accès', tabContent: () => this.containerAccessTabContent(), visible: () => this.containerAccessTabContentVisible()},
                {id: '3', title: 'Compte', tabContent: () => this.accountTabContent(), visible: () => this.containerAccessTabContentVisible()},
                {id: '4', title: 'Paramètres', tabContent: () => this.accountSystemPrefsContent(), visible: () => this.containerAccessTabContentVisible()},
                {id: '5', title: 'Roles', tabContent: () => this.accountRoles(), visible: () => this.containerAccessTabContentVisible()},
            ],
        }

        if(this.props.customTabItems){
        	this.props.customTabItems.map(tab => {
        		tabsConfig.tabItems.push(tab)
        	})
        }

        return tabsConfig;
    }
    accountRoles(){
		return <div className={'pane'}>
			<UserRoles {...this.props}/>
		</div>
    }

    accountSystemPrefsContent(){
    	return <div className={'pane'}>
			<UserSystemSettings {...this.props}/>
		</div>
    }

    containerAccessTabContentVisible(){
    	return commons.hasRoleAdmin(this.props.userContext) || commons.hasRoleSuperAdmin(this.props.userContext);
    }

    isCurrentAccountOwner(){
    	let owner = this.state. isCurrentAccountOwner || commons.hasRoleAdmin(this.props.userContext);
    	return owner;
    }

	nameOf(container){
		return <td width="60%">
				<h5 className="katappult-link">{container.name}</h5>
				<span><i>{container.description}</i></span>
		</td>
	}

    containerAccessTabContent(){
    	let xaccessTableConfig = {
			columnsConfig: [
				{ displayComponent: (v) => this.nameOf(v), dataField: 'attributes' },
			],
        }

    	if(commons.hasRoleAdmin(this.props.userContext) || commons.hasRoleSuperAdmin(this.props.userContext)){
    		return <ContainersMembership
							{...this.props}
							accountId={this.getRootObjectForDetailsId()} />
    	}
    	else {
    		if(this.state.containerMembership &&
    				this.state.containerMembership.length > 0){
    			return <DataTable items={JSON.stringify(this.state.containerMembership)}
				         		metaData={JSON.stringify(this.state.containerMembershipMetaData)}
				             	tableConfig={xaccessTableConfig}
				            	paginate="false"/>

    		}
    	}
    }

    contactTabContent(){
    	let canEdit = this.isCurrentAccountOwner()
        return <div>
               { this.state.loading !==true && <Contactable
				   containerId={this.props.containerId}
                	contactNavigation={true}
                	displayHeader={true}
                	businessId={this.state.userProfile.id}
            		canEdit={canEdit}/>
              }
            </div>
	}

    peopleProfileAttributesList(){
        const peopleProfileAttributesList = {
			onSubmit: (formData) => this.updateProfile(formData),
            attributes: [
                //{name: 'Gender', dataField: 'gender', type: 'select', editor:'select', enumProvider: ()=>genderProvider()},
                {name: 'Lastname', dataField: 'lastName', type: 'text'},
				{name: 'Firstname', dataField: 'firstName', type: 'text'},
                //{name: 'Middlename', dataField: 'middleName', type: 'text'},
                //{name: 'Birth place', dataField: 'birthPlace', type: 'text'},
                //{name: 'Birth date', dataField: 'birthDate', type:'date', dateFormat: 'DD/MM/YYYY'},
            ]
        };
        return peopleProfileAttributesList;
    }
   peopleAttributesView(){
	   let canEdit = this.isCurrentAccountOwner();
	   return <AttributeListGroup
		attributesListConfig={this.peopleProfileAttributesList()}
		data={this.state.userProfile}
		canEdit={canEdit}
		standardFooterActions="true"
		displayHeader={true}/>
   }

   organizationProfileAttributesList(){
        const organizationProfileAttributesList = {
			formId: 'profileAttributesList_form',
			addHeaderMargin: true,
			onSubmit: (formData) => this.updateOrgProfile(formData),
            attributes: [
                {name: 'Name', dataField: 'name', type: 'text'},
                {name: 'Siren', dataField: 'siren', type: 'text'},
                {name: 'Siret', dataField: 'siret', type: 'text'},
                {name: 'Number', dataField: 'number', type: 'text'},
                {name: 'Code NAF', dataField: 'codeNaf', type: 'text'},
                {name: 'Code APE', dataField: 'codeApe', type: 'text'},
                {name: 'JURIDICAL', dataField: 'juridicalForm', type: 'text'},
                {name: 'TVA INTRA', dataField: 'tvaIntra', type: 'text'},
                {name: 'Immat date', dataField: 'immatriculationDate', type:''},
                {name: 'Greffer code', dataField: 'greffeCode', type: 'text'},
                {name: 'Categorie', dataField: 'categorie', type: 'text'},
                {name: 'NAF company', dataField: 'codeNafCompany', type: 'text'},
                {name: 'APE company', dataField: 'codeApeCompany', type: 'text'},
                {name: 'Addressage name', dataField: 'addressageName', type: 'text'},
            ]
        };
        return organizationProfileAttributesList;
    }

    organizationAttributesView(){
    	let canEdit = this.isCurrentAccountOwner();
    	return <AttributeListGroup
			attributesListConfig={this.organizationProfileAttributesList()}
			data={this.state.userProfile}
			canEdit={canEdit}
			standardFooterActions="true"
			displayHeader={true}/>
    }
    updateOrgProfile(formData) {
		let id = formData.id
		accountService
		.updateOrgProfile(id, formData, this.props.containerId)
		.then(response => {
			this.updateProfileSuccess()
		})
		.catch(error => {
			toast.error('Error updating profile!')
			console.error(error)
		});
	}
	componentDidUpdate(prevprops, presState){

		const prevQueryUrlParams = queryString.parse(prevprops.location.search);
		const queryUrlParams = queryString.parse(this.props.location.search);
		let rootId = queryUrlParams.rootId;
		let prevId = prevQueryUrlParams.rootId;
		if(prevId !== rootId && rootId){
			this.loadAllDatas(rootId)
		}
	}

	refresh(){
		this.loadAllDatas(this.getRootObjectForDetailsId(), false)
	}

	componentDidMount() {
		this.loadAllDatas(this.getRootObjectForDetailsId(), true)
    }

	async loadAllDatas(accountId, refreshbread){

		this.setState({loading: true})

		accountService
		.accountDetails(accountId, this.props.containerId)
		.then(response => {
			let currentAccountOwner = response.data.links.account.nickName === this.props.userContext.userAccount.nickName;
			this.setState({
				loading: false,
				loadDataError: false,
				userProfile:  response.data.attributes,
				userAccount: response.data.links.account,
				isCurrentAccountOwner: currentAccountOwner,
				accountId: accountId,
			})

			return response;
		})
		.then(response => {
			let currentAccountId = response.data.links.account.id
			this.loadContainerMemberships(currentAccountId)
		})
		.catch(error => {
			this.setState({loadDataError: true})
        })
	}

	async loadContainerMemberships(currentAccountId){
		accountService
		.containersMembership(currentAccountId, this.props.containerId)
		.then(response => {
			if(response && response.data){
				this.setState({
					containerMembership: response.data,
					containerMembershipMetaData: response.metaData,
				})
			}
		})
	}

    getProfileName(){
    	if(this.state.userProfile){
    		if(this.state.userProfile.lastName){
    			return this.state.userProfile.firstName + ' ' + this.state.userProfile.lastName
    		}
        	return this.state.userProfile.name;
    	}

    	return <div></div>;
    }

    isOrganizationProfile(){
    	return this.state.userProfile && this.state.userProfile.siret;
    }

    overviewTabContent() {

		let content = <></>;
		if(this.notLoading()) {
	    	let canEdit = this.isCurrentAccountOwner();
	    	let attributesView, accountShortType = 'Person';
			if(this.isOrganizationProfile()){
				accountShortType = 'Organization';
			}

	    	if(accountShortType === 'Person'){
	    		attributesView = this.peopleAttributesView();
	    	}
	    	else {
	    		attributesView = this.organizationAttributesView();
	    	}

	    	content = <>
				<Accordion title={'Details'} content={attributesView} expanded={true}/>
				<Accordion title={'Contacts'} content={
							<Contactable
								containerId={this.props.containerId}
								displayHeader={true}
								businessId={this.state.userProfile.id}
								canEdit={canEdit}/>
						} expanded={true}
				/>

			</>
		}
		else {
			content = <WaitingPane />
		}

		return <div>{content}</div>
    }

    notLoading (){
    	return !this.state.loading && this.state.userProfile;
    }

    accountTabContent(){
    	let canEdit = this.state.isCurrentAccountOwner || commons.hasRoleAdmin(this.props.userContext),
    	actions = [], isAdmin = commons.hasRoleAdmin(this.props.userContext)

		if(this.notLoading()){

			if(isAdmin){
				actions.push(
					<ResetPassword
						containerId={this.props.containerId}
						accountId={this.state.userAccount.id}
						afterUpdate={() => this.refresh()}/>
				)
			}

			if(this.state.isCurrentAccountOwner) {
				actions.push(
					<UpdatePassword
						containerId={this.props.containerId}
						accountId={this.state.userAccount.id}/>
				)
			}

			if(isAdmin){
				if(!this.isLocked()){
					actions.push(<LockUser
						containerId={this.props.containerId}
						accountId={this.state.userAccount.id}
						afterUpdate={() => this.refresh()}/>)
				}
				else {
					actions.push(<UnLockUser
						containerId={this.props.containerId}
						accountId={this.state.userAccount.id}
						afterUpdate={() => this.refresh()}/>)
				}
			}

	    	return <>
					<ButtonToolbar className={'footer-btn-toolbar header-btn-toolbar btn-toolbar'}>{actions}</ButtonToolbar>
					<Accordion title={'Compte'} content={
							<AttributeListGroup
								containerId={this.props.containerId}
								attributesListConfig={this.accountAttributesList()}
								data={this.state.userAccount}
								canEdit={canEdit}
								displayHeader={true}/>
						} expanded={true}
					/>

			</>
		}

		return <ButtonToolbar>{actions}</ButtonToolbar>
    }

    accountAttributesList(){
        const accountAttributesList = {
                attributes: [
					{name: 'Locked', dataField: 'locked', type:'bool'},
					{name: 'Locked date', dataField: 'lockedDate', type: 'text'},
                    {name: 'Activated', dataField: 'active', type:'bool'},
                    {name: 'Pass expire date', dataField: 'passwordExpirationDate', type:'date', dateFormat: 'DD/MM/YYYY HH:mm'},
                    {name: 'Pass expired', dataField: 'firstName', type:'bool'},
                    {name: 'Creation date', dataField: 'createDate', type:'date', readOnly: true, dateFormat: 'DD/MM/YYYY HH:mm'},
                    {name: 'Created by', dataField: 'createdBy', type: 'text', readOnly: true},
                    {name: 'Modification date', dataField: 'lastModifiedDate', type:'date', readOnly: true, dateFormat: 'DD/MM/YYYY HH:mm'},
                    {name: 'Modified by', dataField: 'lastModifiedBy', type: 'text', readOnly: true},
                ]
        };

        return accountAttributesList;
    }

	render() {

		let navTabContents = [];
		this.tabsConfigs().tabItems.map(tabItem => {
			if(tabItem.visible()) {
				navTabContents.push( <Tab eventKey={tabItem.id.toString()} title={tabItem.title}>
					{tabItem.tabContent(tabItem)}
				</Tab>);
			}
		});

		return <div className="user-profile-root">
			<div className="user-profile-thumb">
				<img src={profile}
					 height="120"
					 width="120"/>
			</div>

			<div className="user-profile-content admin-tab-content">
				<Tabs defaultActiveKey="1" id="uncontrolled-tab-example" className={"admin-nav-tabs"}>
					{navTabContents}
				</Tabs>
			</div>
		</div>
	}
}

export default connect(mapStateToProps) (PeopleDetails);

const genderProvider = () => {
	return [{'key':'O', 'value':'Mr'}, {'key':'1', 'value':'Ms'}]
}
