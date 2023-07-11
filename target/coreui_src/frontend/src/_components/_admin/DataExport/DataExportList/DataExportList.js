import React, {Component} from 'react';
import {DataTable, EmptyPane, WaitingPane, Wizard, WizardConfirm} from "_components/_common";
import DataExportAdd from "_components/_admin/DataExport/DataExportAdd";
import {DataExportService} from "_services/DataExport.services";
import {Input} from "reactstrap";
import {Link} from "react-router-dom";
import queryString from 'query-string';
import DataExportDetails from "_components/_admin/DataExport/DataExportDetails";
import {toast} from "react-toastify";
import {commons} from "_helpers/commons";
import FileSaver from "file-saver";

class DataExportList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            datas: [],
            page: 0,
            pageSize: 10,
            subviewMode: 'list'
        }

        this.onCreateSuccess = this.onCreateSuccess.bind(this)
        this.loadDatas = this.loadDatas.bind(this)
        this.wizardContent = this.wizardContent.bind(this)
        this.tableActions = this.tableActions.bind(this)
        this.table = this.table.bind(this)
        this.delete = this.delete.bind(this)
        this.displayDetails = this.displayDetails.bind(this)
        this.linkTo = this.linkTo.bind(this)
        this.refresh = this.refresh.bind(this)
    }

    onCreateSuccess(wizardCloseFunction) {
        wizardCloseFunction()
        this.loadDatas(this.state.page)
    }

    wizardContent(wizardCloseFunction) {
        return <DataExportAdd onCreateSuccess={() => this.onCreateSuccess(wizardCloseFunction)}
                              {...this.props}/>
    }

    componentDidMount() {
        this.loadDatas(0)
    }

    refresh() {
        this.loadDatas(this.state.page)
    }

    loadDatas(page) {
        this.setState({loading: true})
        DataExportService.listEntity(page, this.state.pageSize, this.props.containerId).then(response => {
            this.setState({
                page: page,
                loading: false,
                datas: response.data,
                metaData: response.metaData,
                subviewMode: 'list'
            })
        })

    }

    searchTermUpdated(e) {
        this.setState({loading: true})
        let searchTerm = e.target.value
        if (searchTerm) {
            DataExportService.searchEntity(0, 30, this.state.searchTerm, this.props.containerId).then(response => {
                this.setState({
                    page: 0,
                    loading: false,
                    datas: response.data,
                    metaData: response.metaData,
                    searchTerm: searchTerm,
                    subviewMode: 'search'
                })
            })
        } else {
            this.loadDatas(0)
        }
    }

    getRootObjectForDetailsId() {
        const queryUrlParams = queryString.parse(this.props.location.search);
        let objectforDetailsId = queryUrlParams.rootId;
        return objectforDetailsId
    }

    displayDetails(e, id) {
        e.preventDefault()
        let hash = window.location.hash.substr(1);
        if (hash.includes('?')) {
            this.props.history.push(hash + '&rootId=' + id)
        } else {
            this.props.history.push(hash + '?rootId=' + id)
        }
    }

    linkTo = (val, item) => {
        return <td className={'td-left'}>
            <Link className={'table-link'} onClick={e => this.displayDetails(e, val.id)}>{val.name}</Link>
        </td>
    }

    delete(id) {
        DataExportService.deleteEntity(id, this.props.containerId).then(response => {
            this.loadDatas(this.state.page)
        })
    }

    launchSync(id, name) {
        let form = {}
        form['separator.char'] = '|'
        form['comment.char'] = '#'
        form['domain'] = commons.getWorkingContainerPath(this.props.userContext)
        form['container'] = commons.getWorkingContainerPath(this.props.userContext)
        form['attach.discarded.file'] = false
        form['attach.log.file'] = false
        form['email.success.template.name'] = 'DEFAULT_LOADER_EMAIL_SUCCESS_TEMPLATE'
        form['email.error.template.name'] = 'DEFAULT_LOADER_EMAIL_ERROR_TEMPLATE'
        form['log.file.extension'] = '.log'
        form['notify.on.error'] = 'false'
        form['notify.on.success'] = 'false'
        form['mail.on.success'] = false
        form['mail.on.error'] = false

        this.setState({launching: id})
        DataExportService.runExport(id, form, this.props.containerId).then(response => {
            this.setState({launching: null})
            if (response.ok) {
                return response.text()
            } else {
                toast.error("Echec de l'export des données")
            }

            return null;
        }).then(response => {
            if (response) {
                let blob = new Blob([response], {type: "plain/text;charset=UTF-8"});
                FileSaver.saveAs(blob, name + ".csv");
            }
        }).catch(error => {
            toast.error("Echec de l'export des données")
            this.setState({launching: null})
        })
    }

    tableActions(v, i) {
        return <td width={'16%'} className={'td-left'}>
            <div className={'btn-toolbar btn-toolbar-right'}>
                {this.state.launching !== v.id && <WizardConfirm
                    buttonIcon={'fa fa-play fa-lg'}
                    onConfirm={() => this.launchSync(v.id, v.name)}
                    dialogMessage="Lancer un export?"/>
                }

                {this.state.launching === v.id && <i className={'fa fa-spinner fa-md'}></i>}

                <WizardConfirm
                    buttonTitle="Supprimer"
                    buttonIcon={'fa fa-trash fa-lg'}
                    onConfirm={() => this.delete(v.id)}
                    dialogMessage="Voulez vous supprimer cet item?"
                    dialogTitle="Supprimer un item"/>
            </div>
        </td>
    }

    mappingFile(v, i) {
        return <td className={'td-left'}>{v.dataExportConfig.forMappingFile}</td>
    }

    commande(v, i) {
        return <td className={'td-left'}>{v.dataExportConfig.command}</td>
    }

    execution(v) {
        return <td className={'td-left'}>{v ? v : 'Manuelle'}</td>
    }

    tableConfig() {
        const tableConfig = {
            columnsConfig: [
                {
                    name: 'Nom',
                    dataField: 'attributes',
                    displayComponent: (v, i) => this.linkTo(v, i),
                    headerClass: 'td-left',
                    className: 'td-left'
                },
                {
                    name: 'Périodicité',
                    dataField: 'attributes.execution',
                    displayComponent: (v) => this.execution(v),
                    headerClass: 'td-left',
                    className: 'td-left'
                },
                {
                    name: 'Notifications',
                    dataField: 'attributes.notifications',
                    headerClass: 'td-left',
                    className: 'td-left'
                },
                {
                    name: 'Email à envoyer',
                    dataField: 'attributes.emailTemplate',
                    headerClass: 'td-left',
                    className: 'td-left'
                },
                {
                    dataField: 'attributes',
                    displayComponent: (v, i) => this.tableActions(v, i),
                    headerClass: 'td-left',
                    className: 'td-left'
                },
            ],
        }
        return tableConfig;
    }

    table() {
        if (!this.state.datas || this.state.datas.length === 0) {
            return <EmptyPane/>
        }

        let tableConfig = this.tableConfig();

        let datatable;
        if (this.state.subviewMode === 'list') {
            datatable = <DataTable items={JSON.stringify(this.state.datas)}
                                   tableConfig={tableConfig}
                                   pagination={true}
                                   metaData={JSON.stringify(this.state.metaData)}
                                   displayTotalElements={true}
                                   paginate={true}/>
        } else {
            datatable = <DataTable items={JSON.stringify(this.state.datas)}
                                   tableConfig={tableConfig}
                                   pagination={false}
                                   metaData={JSON.stringify(this.state.metaData)}
                                   displayTotalElements={true}
                                   paginate={false}/>
        }

        return datatable
    }


    render() {
        let objectforDetailsId = this.getRootObjectForDetailsId()
        if (!objectforDetailsId) {
            let content;
            if (this.state.loading) {
                content = <WaitingPane/>
            } else {
                content = this.table();
            }

            return <div className="portlet-box">
                <div className="portlet-header">
                    <div className="admin-filters-root admin-filters-withPadding">
                        <Input type="text"
                               className="admin-hover-input"
                               name="input1-group2"
                               placeholder="Chercher un élément"
                               autocomplete="off"
                               onChange={(e) => this.searchTermUpdated(e)}
                               defaultValue={this.state.searchTerm}/>

                        <div className="btn-toolbar btn-toolbar-right">
                            <Wizard buttonTitle={'Ajouter'}
                                    buttonIcon={'fa fa-plus fa-md'}
                                    hideFooter={true}
                                    dialogSize="md"
                                    dialogTitle="Ajouter un export"
                                    dialogContentProvider={(wizardCloseFunction) => this.wizardContent(wizardCloseFunction)}/>
                            {/*<button onClick={this.refresh}><i className={'fa fa-refresh fa-md'}></i>&nbsp;Recharger</button>*/}
                        </div>
                    </div>
                </div>
                <div className="portlet-content">
                    {content}
                </div>
            </div>
        } else {
            return <DataExportDetails {...this.props} dataExportId={objectforDetailsId}/>
        }
    }
}

export default DataExportList;
