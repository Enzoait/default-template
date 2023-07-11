import React, { Component } from 'react';
import { connect } from 'react-redux';
import { containerService } from '_services/container.services.js';
import { accountService } from '_services/account.services.js';
import { DataTable, EmptyPane} from '_components/_common';
import { commons } from '_helpers/commons.js';
import {Link} from "react-router-dom";

const mapStateToProps = store => ({

})

const mapDispatchToProps = (disptach) => ({

})

class ContainersMembership extends Component {

	constructor(props){
		super(props);
		this.state = {
			items: [],
			metaData: '',
			accountId: this.props.accountId ? this.props.accountId : this.props.match.params.accountId,
			needUpdate: false,
			membershipStates:{}
		}

		this.switchToParent = this.switchToParent.bind(this)
		this.emptyTableActions = this.emptyTableActions.bind(this)
		this.join = this.join.bind(this)
	}

	join(val){
		let containerId = val.id
		let isMember = this.state.membershipStates[val.name]

		//can not leave or join root and unaffiliated containers
		let isUnleavable = val.path === '/Application' ||
			val.path === '/Application/Unaffiliated' ||
			val.path === '/'

		if(isUnleavable){
			return (<td></td>)
		}
		else {
			return (
				<td className="dt-center">
					<div className="btn-toolbar-right" style={{marginTop:'-0.3rem'}}>
						<button hidden={isMember}  onClick={() => this.addMemberToContainer(containerId, val.name)}>AJOUTER</button>
						<button hidden={!isMember} onClick={() => this.removeMemberFromContainer(containerId, val.name)}>SUPPRIMER</button>
					</div>
				</td>
			)
		}
	}
	toChild(val){
		let containerId = val.id
		return <td className="dt-center" width={'5%'}>
			<div className={'btn-toolbar'} style={{paddingTop:'1rem'}}>
				<Link  size="md" color="light" onClick={e => this.switchTo(e, containerId)}>
					<i className={'fa fa-chevron-right fa-lg'}></i>
				</Link>
			</div>
		</td>
	}

	removeMemberFromContainer(containerId, containerName){
		let accountId = this.state.accountId
		let {membershipStates} = this.state

		accountService.removeContainerMembership(accountId, containerId).then(() => {
			membershipStates[containerName] = false
			this.setState({
				membershipStates: membershipStates
			})
		})
	}

	addMemberToContainer(containerId, containerName){
		let accountId = this.state.accountId
		let {membershipStates} = this.state

		accountService.addContainerMembership(accountId, containerId).then(response => {
			membershipStates[containerName] = true
			this.setState({
				needUpdate: true,
				membershipStates: membershipStates
			})
		})
	}

	switchTo(e, container) {
		if(e) e.preventDefault()
		this.loadDatas(container)
	}

	switchToParent(e){
		if(e) e.preventDefault()
		let containerId = this.state.currentContainerId,
			rootContainerId = commons.getRootContainerId(this.props.userContext)

		if(rootContainerId !== containerId){
			containerService.getParentContainer(containerId).then(json => {
	        	let parentId = json.data.attributes.id
	        	this.loadDatas(parentId)
	        })
		}
	}

	emptyTableActions(){
		return (
			<div className="btn-toolbar">
				<button onClick={e => this.switchToParent(e)}>Parent</button>
			</div>
		)
	}

	componentDidMount(){
		this.loadDatas(this.props.containerId)
	}

	async loadDatas(parentContainerId){
		containerService.getChildrenContainers(parentContainerId).then(json => {
        	this.setState({
        		currentContainerId: parentContainerId,
        		items: json.data,
        		metaData: json.metaData,
        	})
        	return json
        })
        .then(json => {
        	json.data.map(item => {
				let containerId = item.attributes.id;
				accountService.isUserInContainer(this.state.accountId, containerId).then(response => {
					let membershipStates = {...this.state.membershipStates}
					if(response && response.metaData && response.metaData.isMember === true){
						membershipStates[item.attributes.name] = true
					}
					else {
						membershipStates[item.attributes.name] = false
					}

					this.setState({
		        		membershipStates: membershipStates
		        	})
				})
			})
        })
	}

	nameOf(v,i){
		return <>
			<div className={'table-list-admin-root-list-div'}>
				<div className={'table-link'}>{v.name}</div>
				<div className="half-opacity"><span>{v.path}</span></div>
			</div>
		</>
	}

	render() {
		const {items } = this.state;
		const metaData = this.state.metaData;

		const tableConfig = {
			hideTableHeader:"true",
			columnsConfig: [
			    { dataField: 'attributes', displayComponent: (v,i) => this.nameOf(v,i)},
			    { displayComponent: (v) => this.join(v), dataField: 'attributes' },
			    { displayComponent: (v) => this.toChild(v), dataField: 'attributes' },
			],
		}

		let isRootContainer = this.state.currentContainerId === null || this.state.currentContainerId === ''
			|| this.state.currentContainerId === commons.getRootContainerId(this.props.userContext)


		let content;
		if(!items || items.length === 0){
			content = <>
				<div className="btn-toolbar border-bottom" style={ToolbarStyle}>
					<button  onClick={e => this.switchToParent(e)} disabled={isRootContainer}>
						<i className="fa fa-chevron-left"></i> PARENT
					</button>
				</div>

				<EmptyPane  mainMessage='No containers' />
			</>
		}
		else {
	        content = <>
	            	<div className="btn-toolbar border-bottom" style={ToolbarStyle}>
	            		<button  onClick={e => this.switchToParent(e)} disabled={isRootContainer}>
	            			<i className="fa fa-chevron-left"></i> PARENT
	            		</button>
	            	</div>

					<div className={'table-list-admin-root-list'} style={{
						padding: '12px'
					}}>
						<DataTable
							items={JSON.stringify(items)}
							metaData={JSON.stringify(metaData)}
							tableConfig={tableConfig}
							paginate="false"/>
					</div>
	        </>
		}

		return <div class={'pane'}>
			{content}
		</div>
	}
}

export default connect(mapStateToProps, mapDispatchToProps) (ContainersMembership)


const ToolbarStyle = {
	padding: '12px'
}