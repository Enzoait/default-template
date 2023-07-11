import React, { Component } from 'react';
import {
	Contactable,
	WaitingPane,
	Accordion
} from '_components/_common';
import { connect } from 'react-redux';
import { accountService } from '_services/account.services';
import { toast } from 'react-toastify';
import { commons } from '_helpers/commons';
import queryString from 'query-string';
import profile from 'assets/img/profile.png'

const mapStateToProps = store => ({
})

class UserPeopleDetails extends Component {

	constructor(props) {
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
		this.contactTabContent = this.contactTabContent.bind(this);
		this.updateProfile = this.updateProfile.bind(this);
		this.isLocked = this.isLocked.bind(this);
		this.refresh = this.refresh.bind(this);
		this.isCurrentAccountOwner = this.isCurrentAccountOwner.bind(this);
		this.overviewTabContent = this.overviewTabContent.bind(this);
		this.getRootObjectForDetailsId = this.getRootObjectForDetailsId.bind(this);
	}

	getRootObjectForDetailsId() {
		const queryUrlParams = queryString.parse(this.props.location.search);
		let objectforDetailsId = queryUrlParams.rootId;
		return objectforDetailsId
	}

	isLocked() {
		if (this.state.userAccount.locked) return true;
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

	updateProfileSuccess() {
		let accountId = this.getRootObjectForDetailsId();
		accountService.accountDetails(accountId, this.props.containerId).then(response => {
			if (this.props.updatePeopleCallBack) {
				this.props.updatePeopleCallBack(accountId, false)
			}

			this.setState({
				loadDataError: false,
				userProfile: response.data.attributes,
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

	containerAccessTabContentVisible() {
		return commons.hasRoleAdmin(this.props.userContext) || commons.hasRoleSuperAdmin(this.props.userContext);
	}

	isCurrentAccountOwner() {
		let owner = this.state.isCurrentAccountOwner || commons.hasRoleAdmin(this.props.userContext);
		return owner;
	}

	contactTabContent() {
		let canEdit = this.isCurrentAccountOwner()
		return <div>
			{this.state.loading !== true && <Contactable
				containerId={this.props.containerId}
				contactNavigation={true}
				displayHeader={true}
				businessId={this.state.userProfile.id}
				canEdit={canEdit}/>
			}
		</div>
	}

	peopleProfileAttributesList() {
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

	componentDidUpdate(prevprops, presState) {
		const prevQueryUrlParams = queryString.parse(prevprops.location.search);
		const queryUrlParams = queryString.parse(this.props.location.search);
		let rootId = queryUrlParams.rootId;
		let prevId = prevQueryUrlParams.rootId;
		if (prevId !== rootId && rootId) {
			this.loadAllDatas(rootId)
		}
	}

	refresh() {
		this.loadAllDatas(this.getRootObjectForDetailsId(), false)
	}

	componentDidMount() {
		this.loadAllDatas(this.getRootObjectForDetailsId(), true)
	}

	async loadAllDatas(accountId, refreshbread) {

		this.setState({loading: true})

		accountService.accountDetails(accountId, this.props.containerId).then(response => {
			let currentAccountOwner = response.data.links.account.nickName === this.props.userContext.userAccount.nickName;
			this.setState({
				loading: false,
				loadDataError: false,
				userProfile: response.data.attributes,
				userAccount: response.data.links.account,
				isCurrentAccountOwner: currentAccountOwner,
				accountId: accountId,
			})

			return response;
		})
			.catch(error => {
				this.setState({loadDataError: true})
			})
	}

	getProfileName() {
		if (this.state.userProfile) {
			if (this.state.userProfile.lastName) {
				return this.state.userProfile.firstName + ' ' + this.state.userProfile.lastName
			}
			return this.state.userProfile.name;
		}

		return <div></div>;
	}

	isOrganizationProfile() {
		return this.state.userProfile && this.state.userProfile.siret;
	}

	overviewTabContent() {

		if (this.notLoading()) {

			let result, firstName = this.props.userContext.userDetails.firstName
			if(firstName){
				result = firstName + ' ' + this.props.userContext.userDetails.lastName
			}
			else {
				result = this.props.userContext.userDetails.addressageName
			}

			let content, canEdit = this.isCurrentAccountOwner();
			content = <>
					<div style={{marginTop: '2rem'}}>
						<h3 className="form-title-level-0 hand-hover">Details</h3>
						<hr/>
						<label className="control-value-view">{result}</label>
					</div>
				<Accordion title={'Contacts'} content={
					<Contactable
						containerId={this.props.containerId}
						displayHeader={true}
						businessId={this.state.userProfile.id}
						canEdit={canEdit}/>
				} expanded={true}
				/>

			</>
		} else {
			content = <WaitingPane/>
		}

		return <div>{content}</div>
	}

	notLoading() {
		return !this.state.loading && this.state.userProfile;
	}

	render() {

		return <div className="user-profile-root">
			<div className="user-profile-thumb">
				<img src={profile}
					 height="120"
					 width="120"/>
			</div>
			<div className="user-profile-content admin-tab-content">
				{this.overviewTabContent()}
			</div>
		</div>
	}
}

export default connect(mapStateToProps) (UserPeopleDetails);

const genderProvider = () => {
	return [{'key':'O', 'value':'Mr'}, {'key':'1', 'value':'Ms'}]
}
