import React, {Component} from 'react';
import {Button} from 'reactstrap';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {containerService} from '_services/container.services';
import {DataTable, EmptyPane, WaitingPane, Wizard} from '_components/_common';
import {commons} from '_helpers/commons';
import {toast} from 'react-toastify';
import ContainerCreate from '_components/_admin/Container/ContainerCreate';
import ContainerDetails from '_components/_admin/Container/ContainerDetails';
import {loginService} from '_services/login.services';
import {updateUserContext} from '_reducers/coreUserContextReducer'
import {coreUri} from "_helpers/CoreUri";

const mapStateToProps = store => ({})

const mapDispatchToProps = (disptach) => ({
    updateUserContextRX: (e) => disptach(updateUserContext(e)),
})

class ContainerSwitcher extends Component {

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
        this.switchToRoot = this.switchToRoot.bind(this)
    }

    async switchToRoot() {
        let rootContainerId = this.props.userContext.applicationContainer.id
        this.loadChildrenContainer(rootContainerId)
    }

    async toChild(e, container) {
        this.setState({loading: true})

        if (e) e.preventDefault()
        containerService
            .getChildrenContainers(container.id)
            .then(json => {
                this.setState({
                    currentNavigatingContainer: container.id,
                    currentContainerName: container.name,
                    items: json.data,
                    metaData: json.metaData,
                    viewMode: 'viewList',
                    loading: false
                })
            })
            .catch(error => {
                console.error(error);
            });
    }

    async switchTo(e, container) {
        if (e) e.preventDefault()
        this.switchUserContext(container.id)
        this.setState({loading: false})
    }

    async manageApplication(e) {
        if (e) e.preventDefault();
        this.setState({loading: true})
        let rootContainerId = commons.getRootContainerId(this.props.userContext);
        this.switchUserContext(rootContainerId)
    }

    switchUserContext(containerId) {
        loginService.switchUserContext(containerId).then(response => {
            if (commons.isRequestSuccess(response)) {
                let userContext = commons.katappult_core_loginSuccess(response)
                this.props.updateUserContextRX(userContext);
                this.setState({loading: false})

                let message = 'Votre espace de travail est: ' + this.props.userContext.workingContainer.name;
                toast.success(message);
            }
        });
    }

    onCreateSuccess(wizardCloseFunction) {
        if (wizardCloseFunction) wizardCloseFunction();
        const currentContainer = this.state.currentNavigatingContainer;
        containerService.getChildrenContainers(currentContainer).then(response => {
            this.setState({
                items: response.data,
                metaData: response.metaData,
                loading: false
            })
        })
    }

    newContainerWizardContent(wizardCloseFunction) {
        return <ContainerCreate parentContainerId={this.state.currentNavigatingContainer}
                                containerId={this.props.containerId}
                                userContext={this.props.userContext}
                                onCreateContainerSuccess={() => this.onCreateSuccess(wizardCloseFunction)}
                                parentContainerPath={this.state.currentContainerPath}
                                parentContainerName={this.state.currentContainerName}/>
    }

    switchToParent(e) {
        if (e) e.preventDefault();
        this.setState({loading: true})

        containerService.getParentContainer(this.state.currentNavigatingContainer).then(json => {

                let parentId = json.data.attributes.id,
                    path = json.data.attributes.name,
                    name = json.data.attributes.name;

                containerService.getChildrenContainers(parentId).then(json => {
                    this.setState({
                        currentNavigatingContainer: parentId,
                        currentContainerName: name,
                        currentContainerPath: path,
                        items: json.data,
                        metaData: json.metaData,
                        viewMode: 'viewList',
                        loading: false
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
                <button onClick={e => this.switchToParent(e)}>Parent</button>
            </React.Fragment>
        )
    }

    componentDidUpdate(prevprops, prevState) {
        if (prevState.viewMode !== this.props.viewMode) {
            this.setState({viewMode: this.props.viewMode})
        }
    }

    componentDidMount() {
        this.loadChildrenContainer(this.props.containerId)
    }

    async loadChildrenContainer(containerId) {
        this.setState({loading: true})

        containerService.getChildrenContainers(containerId).then(json => {
            this.setState({
                currentNavigatingContainer: this.props.containerId,
                currentContainerName: commons.getWorkingContainerName(this.props.userContext),
                items: json.data,
                metaData: json.metaData,
                viewMode: 'viewList',
                loading: false
            })
        })
            .catch(error => {
                console.error(error);
            });
    }

    manageLink(val) {
        return <td className={'td-left'}>
            <Button onClick={() => this.switchTo(null, val)}>GÉRER</Button>
        </td>
    }

    switchToLink(val) {
        return <td className={'td-left'}>
            <Button onClick={e => this.toChild(e, val)}><i className="fa fa-angle-right fa-lg"></i></Button>
        </td>
    }

    nameOf(val) {
        return <td className={'td-left'}>
            <Link className={'table-link'} href="#"
                  onClick={e => this.toChild(e, val)}>
                {val.name}
            </Link>
        </td>
    }

    details(val) {
        const url = coreUri.backOfficeViewURL("platform", "conteneurs", ["rootId=" + val.id]);
        return <td className={'td-left'}>
            <Button href={url}>
                <i className="fa fa-info-circle"></i>
            </Button>
        </td>
    }

    table() {
        const items = this.state.items;
        const metaData = this.state.metaData;

        const tableConfig = {
            columnsConfig: [
                {
                    name: 'Nom',
                    displayComponent: (v) => this.nameOf(v),
                    dataField: 'attributes',
                    headerClassName: 'td-left',
                    className: 'td-left'
                },
                {
                    displayComponent: (v) => this.switchToLink(v),
                    dataField: 'attributes',
                    headerClassName: 'td-left',
                    className: 'td-left'
                },
                {
                    displayComponent: (v) => this.manageLink(v),
                    dataField: 'attributes',
                    headerClassName: 'td-left',
                    className: 'td-left'
                },
                {
                    name: 'Description',
                    dataField: 'attributes.description',
                    headerClassName: 'td-left',
                    className: 'td-left'
                },
                {name: 'Path', dataField: 'attributes.path', headerClassName: 'td-left', className: 'td-left'},
                {
                    name: 'Créé le',
                    dataField: 'attributes.createDate',
                    dateFormat: 'DD MMM YYYY',
                    headerClassName: 'td-left',
                    className: 'td-left'
                },
                {
                    name: 'Modifié le',
                    dataField: 'attributes.lastModifiedDate',
                    dateFormat: 'DD MMM YYYY',
                    headerClassName: 'td-left',
                    className: 'td-left'
                },
                {
                    displayComponent: (v) => this.switchToLink(v),
                    dataField: 'attributes',
                    headerClassName: 'td-left',
                    className: 'td-left'
                },
            ],
        }

        return <DataTable items={JSON.stringify(items)}
                          metaData={JSON.stringify(metaData)}
                          tableConfig={tableConfig}
                          pagination={true}
                          displayTotalElements={true}/>
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
            tableContent = <EmptyPane
                                      mainMessage="Le conteneur courant n'a pas de conteneur enfant"/>
        }

        let isRootContainer = this.state.currentNavigatingContainer === undefined ||
            this.state.currentNavigatingContainer === null ||
            this.state.currentNavigatingContainer === commons.getRootContainerId(this.props.userContext)

        return (<div className={'container-switcher'}>
            <div className={'btn-toolbar btn-toolbar-right border-bottom'}>
                <Wizard hideFooter={true}
                        dialogSize="md"
                        buttonIcon="fa fa-sm fa-plus"
                        buttonTitle='Nouveau conteneur'
                        dialogTitle='Nouveau conteneur'
                        dialogContentProvider={(wizardCloseFunction) => this.newContainerWizardContent(wizardCloseFunction)}/>

                <button onClick={e => this.manageApplication(e)}>
                    <i className="fa fa-hand-o-right"></i>&nbsp;GÉRER LE CONTENEUR RACINE
                </button>
            </div>

            <table width="100%">
                <tr>
                    <td with="40%" className={'td-right'}>
                        <div className="btn-toolbar">
                            <button onClick={e => this.switchToRoot(e)}><i className="fa fa-home fa-md"></i></button>
                            <button onClick={e => this.switchToParent(e)}
                                    disabled={isRootContainer}><i className="fa fa-chevron-left fa-md"></i>&nbsp;PARENT
                            </button>
                        </div>
                    </td>
                    <td with="40%" className={'td-right'}>
                        <div className="float-right">
                        </div>
                    </td>
                </tr>
            </table>

            {this.state.loading && <WaitingPane ldsgrid={true}/>}
            {!this.state.loading && tableContent}
        </div>)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContainerSwitcher)
