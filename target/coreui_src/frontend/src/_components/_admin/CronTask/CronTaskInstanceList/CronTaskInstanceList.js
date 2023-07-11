import React, {Component} from 'react';
import {DataTable, EmptyPane, WaitingPane} from "_components/_common";
import {CronTaskService} from "_services/CronTask.services";

class CronTaskInstanceList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            datas: [],
            pageSize: 14
        }

        this.stop = this.stop.bind(this)
        this.tableActions = this.tableActions.bind(this)
        this.table = this.table.bind(this)
        this.refresh = this.refresh.bind(this)
        this.goToPage = this.goToPage.bind(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.refreshList && this.props.refreshList !== prevProps.refreshList) {
            this.refresh()
        }
    }

    goToPage(i) {
        this.loadDatas(i)
    }

    componentDidMount() {
        this.loadDatas(0)
    }

    refresh() {
        this.loadDatas(this.state.page)
    }

    loadDatas(page) {
        this.setState({loading: true})
        CronTaskService.listInstances(this.props.taskId, page, this.state.pageSize, this.props.containerId).then(response => {
            this.setState({
                loading: false,
                page: page,
                datas: response.data,
                metaData: response.metaData,
            })
        })
    }

    tableActions(v, i) {
        return <td width={'10%'}>
            {this.stop(v, i)}
            <button onClick={() => this.dropTask(v.id)} style={{'margin-right': '0.8rem'}}><i
                className={'fa fa-trash fa-md'}></i></button>
        </td>
    }

    dropTask(id) {
        CronTaskService.dropInstance(this.props.taskId, id, this.props.containerId).then(response => {
            this.refresh()
        })
    }

    stopTask(id) {
        CronTaskService.stopTask(this.props.taskId, id, this.props.containerId).then(response => {
            this.refresh()
        })
    }

    stop(v, i) {
        if (v.status === "RUNNING") {
            return <button onClick={() => this.stopTask(v.id)} style={{'margin-right': '0.8rem'}}><i
                className={'fa fa-stop fa-md'}></i></button>
        }
    }

    status(v, i) {
        if (v === 'RUNNING') {
            return <td>
                <i className={'fa fa-spinner fa-md'}></i>
            </td>
        } else if (v === 'SUCCESS') {
            return <td>
                <i className={'fa fa-check fa-md'}></i>
            </td>
        } else if (v === 'ERROR') {
            return <td>
                <i className={'fa fa-exclamation-triangle fa-md'}></i>
            </td>
        }
    }


    tableConfig() {
        const tableConfig = {
            columnsConfig: [
                {name: 'Nom', dataField: 'attributes.name'},
                {name: 'Début', dataField: 'attributes.createDate', dateFormat: 'DD-MM-YYYY HH:mm'},
                {name: 'Fin', dataField: 'attributes.endDate', dateFormat: 'DD-MM-YYYY HH:mm'},
                {name: 'Statut', dataField: 'attributes.status', displayComponent: (v, i) => this.status(v, i)},
                {name: 'Action', dataField: 'attributes', displayComponent: (v, i) => this.tableActions(v, i)},
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

export default CronTaskInstanceList;
