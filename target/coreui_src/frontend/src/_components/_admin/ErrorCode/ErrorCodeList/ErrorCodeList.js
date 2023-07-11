import React, { Component } from 'react';
import {DataTable, EmptyPane, WaitingPane} from "_components/_common";
import {errorCodeService} from "_services/errorCode.services";
import {Input} from "reactstrap";

class ErrorCodeList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            datas: [],
            subviewMode: 'list'
        }

        this.table = this.table.bind(this)
    }

    componentDidMount() {
        this.setState({loading:true})
        errorCodeService.listEntity(this.props.containerId).then(response => {
            this.setState({
                loading: false,
                datas: response.data,
                metaData: response.metaData,
                subviewMode: 'list'
            })
        })
    }

    searchTermUpdated(e){
        this.setState({loading:true})
        let searchTerm = e.target.value
        if(searchTerm){
            errorCodeService.searchEntity(0, 30, this.state.searchTerm , this.props.containerId).then(response => {
                this.setState({
                    page: 0,
                    loading: false,
                    datas: response.data,
                    metaData: response.metaData,
                    searchTerm: searchTerm,
                    subviewMode: 'search'
                })
            })
        }
        else {
            this.loadDatas(0)
        }
    }

    tableConfig(){
        const tableConfig = {
            columnsConfig: [
                {name:'Famille', dataField: 'attributes.family', headerClass: 'td-left', className: 'td-left'},
                {name:'Code', dataField: 'attributes.type', headerClass: 'td-left', className: 'td-left'},
                {name:'Message fr', dataField: 'attributes.message_fr', headerClass: 'td-left', className: 'td-left'},
                {name:'Message en', dataField: 'attributes.message_en', headerClass: 'td-left', className: 'td-left'},
            ],
        }
        return tableConfig;
    }

    table(){
        if(!this.state.datas || this.state.datas.length === 0){
            return <EmptyPane />
        }

        let tableConfig = this.tableConfig();

        let datatable;
        if(this.state.subviewMode === 'list'){
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
            let content;
            if (this.state.loading) {
                content = <WaitingPane/>
            } else {
                content = this.table();
            }

            return <div className="portlet-box">
                <div className="portlet-headerx">
                    <div className="admin-filters admin-filters-root admin-filters-root-withPadding">
                        <Input type="text"
                               className="admin-hover-input"
                               name="input1-group2"
                               placeholder="Chercher un élément"
                               autocomplete="off"
                               onChange={(e) => this.searchTermUpdated(e)}
                               defaultValue={this.state.searchTerm}/>
                    </div>
                </div>
                <div className="portlet-content">
                    {content}
                </div>
            </div>
   }
}

export default ErrorCodeList;
