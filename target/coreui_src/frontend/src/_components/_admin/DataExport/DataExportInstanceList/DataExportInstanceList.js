import React, {Component} from 'react';
import {DataTable, EmptyPane, WaitingPane} from "_components/_common";
import {DataExportService} from "_services/DataExport.services";
import FileSaver from "file-saver";

class DataExportInstanceList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            datas: [],
            pageSize: 12
        }

        this.download = this.download.bind(this)
        this.stop = this.stop.bind(this)
        this.tableActions = this.tableActions.bind(this)
        this.table = this.table.bind(this)
        this.refresh = this.refresh.bind(this)
        this.goToPage = this.goToPage.bind(this)
    }

    goToPage(i) {
        this.loadDatas(i)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.refreshList && this.props.refreshList !== prevProps.refreshList) {
            this.refresh()
        }
    }

    componentDidMount() {
        this.loadDatas(0)
    }

    refresh() {
        this.loadDatas(this.state.page)
    }

    loadDatas(page) {
        this.setState({loading: true})
        DataExportService.listInstances(this.props.dataExportId, page, this.state.pageSize, this.props.containerId).then(response => {
            this.setState({
                loading: false,
                page: page,
                datas: response.data,
                metaData: response.metaData,
            })
        })
    }

    tableActions(v, i) {
        return <td width={'10%'} className={'td-left'}>
            <div className={'btn-toolbar'}>
                {this.stop(v, i)}
                {this.download(v, i)}
            </div>
        </td>
    }

    tableActions2(v, i) {
        return <td width={'5%'} className={'td-left'}>
            <div className={'btn-toolbar'}>
                {this.drop(v, i)}
            </div>
        </td>
    }

    dropExport(id) {
        DataExportService.dropExport(this.props.dataExportId, id, this.props.containerId).then(response => {
            this.refresh()
        })
    }

    stopExport(id) {
        DataExportService.stopExport(this.props.dataExportId, id, this.props.containerId).then(response => {
            this.refresh()
        })
    }

    downloadExport(id, name) {
        DataExportService.downloadExport(id, this.props.containerId).then(response => {
            let blob = new Blob([response], {type: "plain/text;charset=UTF-8"});
            FileSaver.saveAs(blob, name + ".csv");
        })
    }

    stop(v, i) {
        if (v.status === "RUNNING") {
            return <button onClick={() => this.stopExport(v.id)} style={{'margin-right': '0.8rem'}}><i
                className={'fa fa-stop fa-md'}></i>&nbsp;Annuler</button>
        }
    }

    drop(v, i) {
        return <button onClick={() => this.dropExport(v.id)} style={{'margin-right': '0.8rem'}}><i
            className={'fa fa-trash fa-md'}></i>&nbsp;</button>
    }


    download(v, i) {
        if (v.status === "SUCCESS") {
            return <button onClick={() => this.downloadExport(v.id, v.name)} style={{'margin-right': '0.2rem'}}><i
                className={'fa fa-download fa-md'}></i>&nbsp;Télécharger</button>
        }
    }

    status(v, i) {
        if (v === 'RUNNING') {
            return <td width={'2%'} className={'td-left'}>
                <i className={'fa fa-spinner fa-md'}></i>
            </td>
        } else if (v === 'SUCCESS') {
            return <td width={'2%'} className={'td-left'}>
                <i className={'fa fa-check fa-md'}></i>
            </td>
        } else if (v === 'ERROR') {
            return <td width={'2%'} className={'td-left'}>
                <i className={'fa fa-exclamation-triangle fa-md'}></i>
            </td>
        }
    }


    user(v) {
        return <td className={'td-left'}>
            {v === 'anon' ? 'Système' : v}
        </td>
    }


    tableConfig() {
        const tableConfig = {
            columnsConfig: [
                {name: 'Nom', dataField: 'attributes.name', headerClass: 'td-left', className: 'td-left'},
                {
                    name: 'Statut',
                    dataField: 'attributes.status',
                    displayComponent: (v, i) => this.status(v, i),
                    headerClass: 'td-left',
                    className: 'td-left'
                },
                {
                    name: 'Début',
                    dataField: 'attributes.createDate',
                    dateFormat: 'DD-MM-YYYY HH:mm',
                    headerClass: 'td-left',
                    className: 'td-left'
                },
                {
                    name: 'Fin',
                    dataField: 'attributes.endDate',
                    dateFormat: 'DD-MM-YYYY HH:mm',
                    headerClass: 'td-left',
                    className: 'td-left'
                },
                {
                    name: 'Lancé par',
                    dataField: 'attributes.createdBy',
                    displayComponent: (v) => this.user(v),
                    headerClass: 'td-left',
                    className: 'td-left'
                },
                {
                    name: 'Action',
                    dataField: 'attributes',
                    displayComponent: (v, i) => this.tableActions(v, i),
                    headerClass: 'td-left',
                    className: 'td-left'
                },
                {
                    dataField: 'attributes',
                    displayComponent: (v, i) => this.tableActions2(v, i),
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

        let datatable = <DataTable items={JSON.stringify(this.state.datas)}
                                   tableConfig={tableConfig}
                                   pagination={true}
                                   goToPage={this.goToPage}
                                   metaData={JSON.stringify(this.state.metaData)}
                                   displayTotalElements={true}
                                   paginate={true}/>

        return datatable
    }


    render() {
        let content;
        if (this.state.loading) {
            content = <WaitingPane/>
        } else {
            content = this.table();
        }

        return content
    }
}

export default DataExportInstanceList;
