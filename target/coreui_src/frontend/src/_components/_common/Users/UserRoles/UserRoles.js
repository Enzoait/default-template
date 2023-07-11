import React, {Component} from 'react';
import {EmptyPane, WaitingPane, Wizard} from '_components/_common';
import {Button,} from 'reactstrap';
import {commons} from '_helpers/commons';
import {roleService} from '_services/role.services';
import {RiAddLine, RiCloseLine} from "react-icons/ri";
import Spinner from 'react-bootstrap/Spinner'
import queryString from 'query-string';

class UserRoles extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }

        this.getCreatePage = this.getCreatePage.bind(this);
        this.removeFromRole = this.removeFromRole.bind(this);
        this.onCreateItemSuccess = this.onCreateItemSuccess.bind(this);
        this.getRootObjectForDetailsId = this.getRootObjectForDetailsId.bind(this);
    }

    componentDidMount() {
        this.loadRoles();
    }

    componentDidUpdate(prevprops, prevstate) {
        const prevQueryUrlParams = queryString.parse(prevprops.location.search);
        const queryUrlParams = queryString.parse(this.props.location.search);
        let rootId = queryUrlParams.rootId;
        let prevId = prevQueryUrlParams.rootId;
        if (prevId !== rootId && prevId) {
            this.loadRoles();
        }
    }

    getRootObjectForDetailsId() {
        const queryUrlParams = queryString.parse(this.props.location.search);
        let objectforDetailsId = queryUrlParams.rootId;
        return objectforDetailsId
    }

    loadRoles() {
        this.setState({loading: true})

        let id = this.getRootObjectForDetailsId();
        if (id) {
            roleService
                .getUserRoles(id, this.props.containerId)
                .then(response => {
                    this.setState({
                        roles: response.data,
                        loading: false
                    })
                })
        }

    }

    onCreateItemSuccess() {
        this.loadRoles()
    }

    getCreatePage(wizardCloseFunction) {
        return <AddRole
            {...this.props}
            accountId={this.getRootObjectForDetailsId()}
            containerId={this.props.containerId}
            onCreateItemSuccess={() => this.onCreateItemSuccess(wizardCloseFunction)}
            wizardMode={true}/>
    }

    headerActions() {
        return <div className={'btn-toolbar border-bottom'} style={{padding:'12px'}}>
            <Wizard buttonColor="secondary"
                    dialogSize="md"
                    buttonIcon="fa fa-sm fa-plus"
                    hideFooter={true}
                    buttonTitle='ADD TO ROLE'
                    dialogTitle="Add user to role"
                    dialogContentProvider={(wizardCloseFunction) => this.getCreatePage(wizardCloseFunction)}/>
        </div>
    }

    removeFromRole(roleId) {
        this.setState({loading: true})

        roleService
            .removeRoleToUser(this.getRootObjectForDetailsId(), roleId, this.props.containerId)
            .then(() => {
                this.loadRoles()
            })
    }

    render() {
        let roles = this.state.roles;
        let content, header = this.headerActions();
        let rolesDisplay = [];

        if (roles && roles.length > 0) {
            roles.map(c => {
                rolesDisplay.push(<>
                    <div className="user-role">
                        <div className="role-name">{c.attributes.name}</div>
                        <div className="role-action">
                            {c.attributes.key !== 'superadmin' &&
								<Button color="white" onClick={e => this.removeFromRole(c.attributes.id)}>
									<RiCloseLine size="2em" color="red"/>
								</Button>
                            }
                            {c.attributes.key === 'superadmin' &&
                            	<Button color="white"><RiCloseLine size="2em" color="white"/></Button>
                            }
                        </div>
                    </div>
                </>)
            })

            content = <div className="all-roles" style={{
                padding: '12px'
            }}>
                {rolesDisplay}
            </div>
        } else {
            content = <EmptyPane/>
        }

        return <>
            {header}
            {this.state.loading && <WaitingPane/>}
            {!this.state.loading && content}
        </>
    }
}

export default UserRoles;

class AddRole extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searching: false,
            searchResult: [],
            searchTerm: ''
        }

        this.searchRole = this.searchRole.bind(this)
    }

    getDatas(datas, isSuperAdmin) {
        let result = [];

        if (!isSuperAdmin) {
            datas.map(data => {
                if (data.attributes.key !== 'ROLE_SUPERADMIN') {
                    result.push(data)
                }
            })
        } else {
            datas.map(data => {
                result.push(data)
            })
        }

        return result
    }

    componentDidMount() {

        this.setState({searching: true})

        roleService
            .searchRoleByNameLike('', this.props.accountId, this.props.containerId)
            .then(response => {
                if (response && response.data) {

                    // remove superadmin role if current user is
                    // not superadmin and container is not application
                    // container.
                    let isSuperAdmin = commons.hasRoleSuperAdmin(this.props.userContext);
                    this.setState({
                        searchResult: this.getDatas(response.data, isSuperAdmin),
                        searchTerm: '',
                        searching: false
                    })
                } else {
                    this.setState({
                        searchResult: [],
                        searchTerm: '',
                        searching: false
                    })
                }
            })
            .catch(error => {
                this.setState({searching: false})
            })
    }

    async searchRole(e) {
        let searchTerm = e.target.value;
        this._doSearchRole(searchTerm);
    }

    async _doSearchRole(searchTerm) {
        if (searchTerm) {

            this.setState({searching: true})

            roleService
                .searchRoleByNameLike(searchTerm, '', this.props.containerId)
                .then(response => {
                    if (response && response.data) {
                        this.setState({
                            searchResult: response.data,
                            searchTerm: searchTerm,
                            searching: false
                        })
                    } else {
                        this.setState({
                            searchResult: [],
                            searchTerm: searchTerm,
                            searching: false
                        })
                    }
                })
        } else {
            this.setState({
                searchResult: [],
                searchTerm: ''
            })
        }
    }

    async addUserToRole(roleId) {
        this.setState({searching: true})

        roleService
            .addRoleToUser(this.props.accountId, roleId, this.props.containerId)
            .then(response => {
                this.setState({searching: false})
                if (this.props.onCreateItemSuccess) {
                    this.props.onCreateItemSuccess();
                }
                this.componentDidMount()
            })
    }

    getRows() {
        let display = [];
        this.state.searchResult.map(c => {

            display.push(<div className="user-role">
                <div className="role-name">{c.attributes.name}</div>
                <div className="role-action">
                    <Button color="white" onClick={e => this.addUserToRole(c.attributes.id)}>
                        <RiAddLine size="2em" color="red"/>
                    </Button>
                </div>
            </div>)
        })
        return display;
    }

    render() {

        return <>
            {this.state.searching && <>
                <Spinner animation="border" variant="secondary"/>
            </>
            }

            {!this.state.searching && this.state.searchResult.length < 1 &&
            <EmptyPane mainMessage="No roles found"/>
            }

            {!this.state.searching && this.state.searchResult.length > 0 &&
            this.getRows()
            }
        </>
    }
}
