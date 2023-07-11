import React, {Component} from 'react';
import {DataTable, EmptyPane, WaitingPane, Wizard} from "_components/_common";
import CronTaskAdd from "_components/_admin/CronTask/CronTaskAdd";
import {CronTaskService} from "_services/CronTask.services";
import {Input} from "reactstrap";
import {Link} from "react-router-dom";
import queryString from 'query-string';
import CronTaskDetails from "_components/_admin/CronTask/CronTaskDetails";

class CronTaskList extends Component {

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
        return <CronTaskAdd onCreateSuccess={() => this.onCreateSuccess(wizardCloseFunction)}
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
        console.log('111')
        CronTaskService.listEntity(page, this.state.pageSize, this.props.containerId).then(response => {
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
            CronTaskService.searchEntity(0, 30, this.state.searchTerm, this.props.containerId).then(response => {
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
        return objectforDetailsId;
    }

    displayDetails(e, id) {
        e.preventDefault();
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
        CronTaskService.deleteEntity(id, this.props.containerId).then(response => {
            this.loadDatas(this.state.page)
        })
    }

    tableActions(v, i) {
        return <td width={'10%'} className={'td-left'}>
            <div className={'btn-toolbar'}>
                <button onClick={() => this.delete(v.id)}><i className={'fa fa-trash fa-md'}></i>&nbsp;Supprimer
                </button>
            </div>
        </td>
    }

    tableConfig() {
        const tableConfig = {
            columnsConfig: [
                {
                    name: 'Nom',
                    dataField: 'attributes',
                    displayComponent: (v, i) => this.linkTo(v, i),
                    headerClassName: 'td-left',
                    className: 'td-left'
                },
                {
                    name: 'Bean spring',
                    dataField: 'attributes.identifiant',
                    headerClassName: 'td-left',
                    className: 'td-left'
                },
                {
                    name: 'Execution',
                    dataField: 'attributes.execution',
                    headerClassName: 'td-left',
                    className: 'td-left'
                },
                {
                    name: 'Email template',
                    dataField: 'attributes.emailTemplate',
                    headerClassName: 'td-left',
                    className: 'td-left'
                },
                {
                    name: 'Notifications',
                    dataField: 'attributes.notifications',
                    headerClassName: 'td-left',
                    className: 'td-left'
                },
                {dataField: 'attributes', displayComponent: (v, i) => this.tableActions(v, i)},
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

        return datatable;
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
                <div className="portlet-headerx">
                    <div className="admin-filters-root">
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
                                    dialogTitle="Ajouter une tâche"
                                    dialogContentProvider={(wizardCloseFunction) => this.wizardContent(wizardCloseFunction)}/>
                        </div>
                    </div>
                </div>
                <div className="portlet-content">
                    {content}
                </div>
            </div>
        } else {
            return <CronTaskDetails {...this.props}/>
        }
    }
}

export default CronTaskList;
