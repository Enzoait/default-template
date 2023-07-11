import React, {Component} from 'react';
import {Button, ButtonToolbar,} from 'reactstrap';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {containerService} from '_services/container.services';
import {DataTable, EmptyPane, Wizard} from '_components/_common';
import {commons} from '_helpers/commons';
import {toast} from 'react-toastify';
import ContainerCreate from '_components/_admin/Container/ContainerCreate';
import ContainerDetails from '_components/_admin/Container/ContainerDetails';
import {loginService} from '_services/login.services';
import {updateUserContext} from '_reducers/coreUserContextReducer'

const mapStateToProps = store => ({})

const mapDispatchToProps = (disptach) => ({
    updateUserContextRX: (e) => disptach(updateUserContext(e)),
})

class ContainersOfCurrent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            metaData: '',
            currentContainerName: '',
            viewMode: 'viewList',
        }

        this.switchToParent = this.switchToParent.bind(this)
        this.switchTo = this.switchTo.bind(this)
        this.emptyTableActions = this.emptyTableActions.bind(this)
        this.newContainerWizardContent = this.newContainerWizardContent.bind(this)
        this.onCreateSuccess = this.onCreateSuccess.bind(this)
    }

    toChild(e, container) {
        if (e) e.preventDefault()
        containerService.getChildrenContainers(container.id)
            .then(json => {
                this.setState({
                    currentNavigatingContainer: container.id,
                    currentContainerName: container.name,
                    items: json.data,
                    metaData: json.metaData,
                    viewMode: 'viewList',
                })
            })
            .catch(error => {
                console.error(error);
            });
    }

    switchTo(e, container) {
        if (e) e.preventDefault()
        this.switchUserContext(container.id)
        this.setState({loading: false})
    }

    switchUserContext(containerId) {
        loginService
            .postLogin(commons.sessionId(), containerId)
            .then(response => {
                if (response && response.data) {
                    let userContext = commons.katappult_core_loginSuccess(response)
                    this.props.updateUserContextRX(userContext);

                    let message = 'Votre espace de travail est: ' + this.props.userContext.workingContainer.name;
                    toast.success(message);
                }
            });
    }

    onCreateSuccess(wizardCloseFunction) {
        if (wizardCloseFunction) wizardCloseFunction();
        this.componentDidMount();
    }

    newContainerWizardContent(wizardCloseFunction) {
        if (this.state.store) {
            return <ContainerCreate
                onCreateContainerSuccess={() => this.onCreateSuccess(wizardCloseFunction)}
                parentContainerId={this.state.store.attributes.id}
                parentContainerPath={this.state.store.attributes.path}
                parentContainerName={this.state.store.attributes.name}/>
        } else {
            return <></>
        }
    }

    switchToParent(e) {
        if (e) e.preventDefault();

        containerService
            .getParentContainer(this.state.currentNavigatingContainer)
            .then(json => {

                let parentId = json.data.attributes.id,
                    path = json.data.attributes.name,
                    name = json.data.attributes.name;

                containerService
                    .getChildrenContainers(parentId)
                    .then(json => {

                        this.setState({
                            currentNavigatingContainer: parentId,
                            currentContainerName: name,
                            currentContainerPath: path,
                            items: json.data,
                            metaData: json.metaData,
                            viewMode: 'viewList',
                        })
                    })
            })
            .catch(error => {
                console.error(error);
            });
    }

    emptyTableActions() {
        return (
            <React.Fragment>
                <Button size="md" color="primary" onClick={e => this.switchToParent(e)}>Parent</Button>
            </React.Fragment>
        )
    }

    componentDidUpdate(prevprops, prevState) {
        if (prevState.viewMode !== this.props.viewMode) {
            this.setState({
                viewMode: this.props.viewMode
            })
        }
    }

    componentDidMount() {
        let containerId = this.props.containerId;
        let ownerId = commons.getCurrentUserAccountOwnerId(this.props.userContext);

        containerService
            .getContainersOfOwner(containerId, ownerId)
            .then(response => {

                this.setState({
                    items: response.data,
                    metaData: response.metaData,
                    viewMode: 'viewList',
                })

                return response;
            })
            .then(response => {
                containerService
                    .getByPath('/application/store', containerId)
                    .then(res => {
                        this.setState({
                            store: res.data
                        })
                    })

                return response;
            })
            .catch(error => {
                console.error(error);
            });
    }

    manageLink(val) {
        return <td>
            <Button className="action-button" onClick={() => this.switchTo(null, val)}>GÉRER</Button>
        </td>
    }

    switchToLink(val) {
        return <td>
            <Button size="sm" color="white" onClick={e => this.toChild(e, val)}><i
                className="fa fa-angle-right fa-lg"></i></Button>
        </td>
    }

    nameOf(container) {
        return <td>
            <Link href="#" onClick={e => this.switchTo(null, container)}>{container.name}</Link>
        </td>
    }

    details(val) {
        let url = '#/admin/containers/' + val.id
        return <td>
            <Button className="katappult-link half-opacity" color="white" href={url}><i
                className="fa fa-info-circle"></i></Button>
        </td>
    }

    urlOf(v) {
        return <td>
            <a href="#">{'www.' + v.name.toLowerCase() + '.not-online.soaggyshop.com'}</a>
        </td>
    }

    table() {
        const items = this.state.items;
        const metaData = this.state.metaData;

        const tableConfig = {
            emptyMessageTitle: 'No containers',
            columnsConfig: [
                {name: 'Nom', dataField: 'attributes', displayComponent: (v) => this.nameOf(v)},
                //{ name:'Name', displayComponent: (v) => this.nameOf(v), dataField: 'attributes' },
                {name: 'Description', dataField: 'attributes.description'},
                {name: 'Création', dataField: 'attributes.createDate', dateFormat: 'DD MMM YYYY'},
                //{ displayComponent: (v) => this.manageLink(v), dataField: 'attributes' },
            ],
        }

        return <div className="mt-4">
            <DataTable items={JSON.stringify(items)}
                       hover={true} size="md"
                       bordered={false} striped={false}
                       metaData={JSON.stringify(metaData)}
                       tableConfig={tableConfig}
                       pagination={true}
                       displayTotalElements={true}
                       paginate={true}/>
        </div>
    }

    render() {
        if (this.state.viewMode === 'viewDetails') {
            return <ContainerDetails
                pushBreadCrumb={this.props.pushBreadCrumb}
                containerId={this.state.selectedContainerId}/>
        }

        const items = this.state.items;
        let tableContent;
        if (items && items.length > 0) {
            tableContent = this.table()
        } else {
            tableContent = <EmptyPane mainMessage="Ce conteneur n'a pas de conteneur enfant"/>
        }

        return (<>
            <ButtonToolbar>
                <Wizard
                    hideFooter={true}
                    dialogSize="md"
                    buttonIcon="fa fa-sm fa-globe"
                    buttonClassName="mr-1 action-button"
                    buttonTitle='NEW ECOMMERCE SITE'
                    dialogTitle='NEW ECOMMERCE SITE'
                    dialogContentProvider={(wizardCloseFunction) => this.newContainerWizardContent(wizardCloseFunction)}/>
            </ButtonToolbar>
            {tableContent}
        </>)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContainersOfCurrent)
