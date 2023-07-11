import React, { Component } from 'react';
import {Input,} from 'reactstrap';
import {commons} from '_helpers/commons';
import { lifecycleService } from '_services/lifecycle.services';
import * as actions from '_actions/actions';
import { connect } from 'react-redux';
import { PeopleCard, DataTable, Wizard, AddPeople, PeopleDetails, EmptyPane } from '_components/_common';
import { HashRouter,  Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { RiUserLine, RiRefreshLine, RiUser6Line } from "react-icons/ri";
import queryString from 'query-string';
import {coreUri} from '_helpers/CoreUri';
import {accountService} from "_services/account.services";


const mapStateToProps = store => ({
	searchTerm: store.searchMembers.searchTerm,
	searchBusinessClass: store.searchMembers.searchBusinessClass,
	searchBusinessType: store.searchMembers.searchBusinessType,
	results: store.searchMembers.searchResults,
})

const mapDispatchToProps = (disptach) => ({
	updateSearchTerm: (e) => disptach(actions.updateSearchMembersTerm(e)),
	updateSearchResults: (e) => disptach(actions.updateSearchResults(e)),
})

/**
 * Container registered users
 */
class ManageContainerUsers extends Component {

	constructor(props){
		super(props)
		this.state ={
			totalMembers: 0,
			members: [],

			loadingMembers: false,
			statesFilter: [],
			reachableStates:[],

			queryFilters: {
				page: 0,
				pageSize:20,
				includeParentItems: false,
				login: '',
				state: '',
			},

			viewMode: 'viewList'
		}

		this.manageMembers = this.manageMembers.bind(this)
		this.unsubscribe = this.unsubscribe.bind(this)
		this.blockUser = this.blockUser.bind(this)
		this.goToPage = this.goToPage.bind(this)
		this.setLinkState = this.setLinkState.bind(this)
		this.switchToView = this.switchToView.bind(this)
		this.onPeopleDetailsChange = this.onPeopleDetailsChange.bind(this);
		this.moreActions = this.moreActions.bind(this);
		this.getRootObjectForDetailsId = this.getRootObjectForDetailsId.bind(this)
		this.onCreatePeopleSuccess = this.onCreatePeopleSuccess.bind(this)
	}

	switchToView(e, name){
		if(e) e.preventDefault()
		this.setState({
			viewMode: name
		})
	}

	unsubscribe(userAccountId){
		let newMembers = [];
		this.state.members.map(m => {
			if(m.attributes.id !== userAccountId){
				newMembers.push(m)
			}
		})

		this.setState({
			members: newMembers
		})
	}

	blockUser(userAccountId){
		let members = [...this.state.members],
			newMembers = [];
		this.state.members.map(m => {
			if(m.attributes.id !== userAccountId){
				newMembers.push(m)
			}
		})

		this.setState({members: newMembers})
	}

	newPeople(wizardCloseFunction){
		return <AddPeople
			{...this.props}
			peopleMode={'b2bAndB2c'}
			hideAgreements={true}
			fromConnectedUser={true}
			onCreatePeopleSuccess={(id) => this.onCreatePeopleSuccess(wizardCloseFunction, id)}/>
	}

	onCreatePeopleSuccess(wizardCloseFunction, id){
		this.refreshView()
		if(wizardCloseFunction){
			wizardCloseFunction();
		}

		this.setState({
			selectedAccountId: id,
			showSuccessAlert: true
		})

	}

	componentDidUpdate(prevProps, prevState){
		if(prevState.viewMode !== this.props.viewMode){
			this.setState({viewMode: this.props.viewMode})
		}
	}

	getRootObjectForDetailsId(currentItemIdParam){
		const queryUrlParams = queryString.parse(this.props.location.search);
		let objectforDetailsId = queryUrlParams.rootId;
		return objectforDetailsId;
	}

	refreshView(){
		let queryFilters = {...this.state.queryFilters};
		queryFilters.login = '';
		this.loadDatas(queryFilters)
	}

	manageMembers(e){
		e.preventDefault()
	}

	componentDidMount(){
		let queryFilters = {...this.state.queryFilters}
		queryFilters.state = 'REQUEST_IN_PROGRESS';
		this.setState({
			queryFilters: queryFilters,
			loadingMembers: true,
		})

		this.loadDatas(queryFilters);
	}

	onPeopleDetailsChange(id, wasRemoved){
		let queryFilters = {...this.state.queryFilters}
		if(wasRemoved === true){
			this.setState({selectedAccountId: null});
		}

		this.loadDatas(queryFilters);
	}

	showDetailsView(){
		return <div className="katappult-container">
			<PeopleDetails
				{...this.props}
				pushBreadCrumb={this.props.pushBreadCrumb}
				updatePeopleCallBack={(id, wasRemoved) => this.onPeopleDetailsChange(id, wasRemoved)}
				accountId={this.state.selectedAccountId} />
		</div>
	}

	loadDatas(queryFilters){
		this.setState({loadingMembers: true, results: []})
		accountService.membersByLoginLikeInWholePlatform(queryFilters, this.props.containerId).then(response => {
			if(!commons.isRequestError(response)){
				this.setState({
					results: response.data,
					metaData:response.metaData,
					loadingMembers: false,
				})
			}
			else {
				this.setState({
					results: [],
					metaData: null,
					loadingMembers: false,
					reachableStates: []
				})
			}
		})
	}
	goToPage(i){
		let queryFilters = {...this.state.queryFilters}
		queryFilters.page = i

		this.setState({queryFilters: queryFilters})
		this.loadDatas(queryFilters)
	}

	nameOf(res, item){
		let owner = item.attributes.ownerSummary
		let type = item.businessType.type
		if(type === 'person'){
			return this.LinkToPeople(item.attributes, owner, "person")
		}
		else {
			return this.LinkToPeople(item.attributes, owner, "org")
		}
	}

	moreActions(val,item){
		return <td className="td-left">
			<div className="btn-toolbar">
				<Button onClick={e=>this.selectPerson(e, val.id)}>
					<i className="fa fa-lg fa-eye"></i>
				</Button>
			</div>
		</td>
	}

	lifecycleActions(v, i){
		let actions = [], roleAid, roleBid,
			id = i.attributes.id;

		roleAid = this.props.containerId;
		roleBid = i.attributes.id;
		if(this.state.reachableStates.length > 0){
			this.state.reachableStates.map(state => {
				if(state !== ''){
					actions.push(
						<div className="float-right">
							<Button size="sm" variant="outline-primary"
									onClick={e =>this.setLinkState(roleAid, roleBid, state)}>{state}</Button>
						</div>
					)
				}
			})
		}

		return <td className="td-left">
			{actions}
		</td>
	}
	setLinkState(roleAid, roleBid, state){
		let linkClass = 'com.katappult.core.api.composite.ContainerMembershipLink'
		this.setState({
			loadingMembers: true
		})

		if(roleAid === undefined || roleBid === undefined ){
			return;
		}

		lifecycleService
			.setLinkState(roleAid, roleBid, state, linkClass, this.props.containerId)
			.then(response => {
				let queryFilters = {...this.state.queryFilters}
				this.loadDatas(queryFilters)
			})
	}
	LinkToPeople(item, owner, type){
		let route
		if(type !== "org"){
			route = <Link className="table-link" onClick={e=>this.selectPerson(e, item.id)}>
				{owner}
			</Link>
		} else {
			route = <Link className="table-link" onClick={e=>this.selectPerson(e, item.id)}>
				{owner}
			</Link>
		}

		return (
			<td className="td-left" width="30%">
				<HashRouter >
					{route}
				</HashRouter>
			</td>
		)
	}

	selectPerson(e, id){
		if(e) e.preventDefault();
		const url = coreUri.backOfficeViewURL("platform", "members", ["rootId=" +  id]);
		this.props.history.push(url);
	}

	membersDatatable(){
		const tableConfig = {
			columnsConfig: [
				{name:'Summary', dataField: 'attributes', displayComponent: (v, i) => this.nameOf(v, i), headerClass: 'td-left'},
				{name:'Email', dataField: 'attributes.login', headerClass: 'td-left', className: 'td-left'},
				{name:'Mot de passe expire le', dataField: 'attributes.passwordExpirationDate', dateFormat: 'DD/MM/YYYY HH:mm', headerClass: 'td-left', className: 'td-left'},
				{name:'Modification', dataField: 'attributes.lastModifiedDate', dateFormat: 'DD/MM/YYYY', headerClass: 'td-left', className: 'td-left'},
			],
		}

		return 	<DataTable tableClassName="data-table"
							 items={JSON.stringify(this.state.results)}
							 metaData={JSON.stringify(this.state.metaData)}
							 tableConfig={tableConfig}
							 displayTotalElements={true}
							 goToPage={this.goToPage}
							 paginate={true}/>
	}

	searchTermUpdated(e){
		let queryFilters = {...this.state.queryFilters}
		queryFilters.login = e.target.value
		this.loadDatas(queryFilters)
		this.setState({
			queryFilters: queryFilters,
			loadingMembers: true,
			viewMode: 'viewList'
		})
	}

	searchHeader(){
		return <div className="admin-filters">
			<Input type="text"
				   className="admin-hover-input"
				   name="search-email-2"
				   placeholder="Email ou login"
				   autoComplete="none"
				//defaultValue={this.state.searchTerm}
				   onChange={(e) => this.searchTermUpdated(e)}/>
		</div>
	}

	updateStates(e){
		let queryFilters = {...this.state.queryFilters}
		queryFilters.state = e.target.value
		this.setState({
			queryFilters: queryFilters,
			loadingMembers: true
		})

		this.loadDatas(queryFilters)
	}

	getStateFilterDisplay(){
		let datas = []
		this.state.statesFilter.map(m => {
			let id = "defaultCheck__" + m;
			let val = m.split(';')[0];
			let key = m.split(';')[0]
			let checked = this.state.queryFilters.state === key
			datas.push(
				<div className="">
					<input class="form-check-input" checked={checked} type="radio" value={key} id={id} onChange={e => this.updateStates(e)}/>
					<label class="form-check-label" for={id}>
						{val}
					</label>
				</div>
			)
		})
		return <div className="mx-4">{datas}</div>
	}

	render() {

		let rootObjectForDetailsId = this.getRootObjectForDetailsId()
		if(!rootObjectForDetailsId){
			let datatable,
				total = this.state.metaData !== null && this.state.metaData !== undefined ? this.state.metaData.totalElements : 0;

			if(this.state.loadingMembers){
				datatable = <> </>
			}
			else if(total > 0){
				datatable = this.membersDatatable();
			}
			else {
				datatable = <EmptyPane mainMessage={'Pas de membres'}/>
			}

			let buttonIconComp = <RiUserLine size="1.2em"/>
			let headerActions = <>
				<Wizard buttonColor="secondary"
						buttonIconComp={buttonIconComp}
						dialogTitle="Nouveau membre"
						buttonTitle="Nouveau membre"
						hideFooter={true}
						dialogSize="md"
						dialogContentProvider={(wizardCloseFunction)=>this.newPeople(wizardCloseFunction)}/>
				<Button className="" size="sm"
						variant="link"
						onClick={e=>this.refreshView()}>
					<RiRefreshLine size="1.2em"/>
					&nbsp;Recharger
				</Button>
			</>

			return <div className="portlet-box">
				<div className="admin-filters-root">
					{this.searchHeader()}
					<div className="btn-toolbar footer-btn-toolbar btn-toolbar-right">{headerActions}</div>
				</div>
				<div className="portlet-content pane">{datatable}</div>
			</div>
		}

		return this.showDetailsView();
	}
}

export default connect(mapStateToProps, mapDispatchToProps) (ManageContainerUsers);


class SearchMembersResult extends Component {
	constructor(props){
		super(props)
		this.orgDetailsLink = this.orgDetailsLink.bind(this)
		this.personDetailsLink = this.personDetailsLink.bind(this)
	}

	searchMembersResult(results){
		if(results && results.length > 0){
			return this.populateResult(results);
		}
	}

	orgDetailsLink(people, owner){
		return LinkToOrg(people, owner)
	}

	personDetailsLink(people, owner){
		return LinkToOrg(people, owner)
	}

	populateResult(results){
		let views = []
		results.map(res => {
			let owner = res.links.owner
			views.push(
				<PeopleCard
					unsubscribe={e => this.props.unsubscribe(e)}
					blockUser={e => this.props.blockUser(e)}
					peopleType={res.businessType}
					people={res.links.owner}
					account={res.attributes}
					orgDetailsLink={e => this.orgDetailsLink(res.attributes, owner)}
					personDetailsLink={e => this.personDetailsLink(res.attributes, owner)}
				/>
			)
		})

		return <div>
			{views}
		</div>
	}
	render(){
		return this.searchMembersResult(this.props.results);
	}
}

const LinkToPerson2 = (item, owner) => {
	const link = `/admin/home/users/${item.id}`
	return (
		<td className="td-left" width="50%">
			<div className="half-opacity">
				{item.login}
			</div>

			<p align="left">
				<HashRouter >
					<Link to={link} className="btn-square">{owner.firstName} {owner.lastName}</Link>
				</HashRouter>
			</p>
		</td>
	)
}
const LinkToOrg = (item, owner) => {
	const link = `/admin/home/users/${item.id}`
	return (
		<td className="td-left" width="50%">
			<div className="half-opacity">
				{item.login}
			</div>
			<p align="left">
				<HashRouter >
					<Link to={link} className="btn-square">{owner.name}</Link>
				</HashRouter>
			</p>
		</td>
	)
}

const enIcon = (val) => {
	if(val) return <td  className="td-left">
		<RiUser6Line color="#EEEE" size="1.3em"/></td>
	return <td></td>
}
