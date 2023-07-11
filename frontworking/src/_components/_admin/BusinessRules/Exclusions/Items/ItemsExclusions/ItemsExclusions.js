import React, { Component } from 'react';
import {DataTable, Wizard} from "_components/_common";
import ItemsExclusionAdd from "_components/_admin/BusinessRules/Exclusions/Items/ItemsExclusionAdd";
import {businessRuleExclusionService} from "_services/businessRuleExclusion.services";

class ItemsExclusions extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true
        }

        this.onCreateSuccess = this.onCreateSuccess.bind(this)
        this.tableActions = this.tableActions.bind(this)
        this.remove = this.remove.bind(this)
    }

    onCreateSuccess(wizardCloseFunction){
        wizardCloseFunction()
        this.loadDatas()
    }

    wizardContent(wizardCloseFunction){
        return <ItemsExclusionAdd
                    onSuccess={()=>this.onCreateSuccess(wizardCloseFunction)}
                    {...this.props}/>
    }

    componentDidMount() {
        this.loadDatas()
    }

    loadDatas(){
        this.setState({loading: true})
        businessRuleExclusionService.listEntity(this.props.businessRuleId, "I", this.props.containerId).then(response => {
            this.setState({
                loading: false,
                datas: response.data
            })
        })
    }

    remove(id){
        businessRuleExclusionService.deleteEntity(id, this.props.containerId).then(response => {
            this.loadDatas()
        })
    }

    tableActions(v, item){
        return <td width={'20%'}>
            <button onClick={() => this.remove(v.id)}><i className={'fa fa-minus fa-md'}></i>&nbsp;Supprimer</button>
        </td>
    }

    tableConfig(){
        const tableConfig = {
            columnsConfig: [
                {name:'Identifiant', dataField: 'attributes.identifiant', headerClass: 'td-left', className: 'td-left'},
                {name:'Debut', dataField: 'attributes.from', dateFormat: 'DD-MM-YYYY hh:mm:ss', headerClass: 'td-left', className: 'td-left'},
                {name:'Fin', dataField: 'attributes.to', dateFormat: 'DD-MM-YYYY hh:mm:ss', headerClass: 'td-left', className: 'td-left'},
                {dataField: "attributes", displayComponent: (v,i) => this.tableActions(v, i), headerClass: 'td-left', className: 'td-left'},
            ],
        }
        return tableConfig;
    }

    table(){
        let tableConfig = this.tableConfig();
        let datatable = <DataTable items={JSON.stringify(this.state.datas)}
                                   tableConfig={tableConfig}
                                   pagination={false}
                                   displayTotalElements={false}
                                   paginate={false}/>

        return datatable
    }

    render() {
        let content;
        if(this.state.loading) {
            content = <></>
        }
        else {
            content = this.table();
        }

        return <div className={'business-rule-exclusion-pane'}>
            <h4>Items</h4>
            <div className={'btn-toolbar btn-toolbar-right'}>
                <Wizard buttonTitle={'Ajouter'}
                        buttonIcon={'fa fa-plus fa-md'}
                        hideFooter={true}
                        dialogSize="lg"
                        dialogTitle="Ajouter un item"
                        dialogContentProvider={(wizardCloseFunction)=>this.wizardContent(wizardCloseFunction)}/>
            </div>
            <div className={'business-rule-exclusion-pane-content'}>
                <div className={'business-rule-exclusion-pane-content-list'}>
                    {content}
                </div>
            </div>

        </div>
    }
}

export default ItemsExclusions;
