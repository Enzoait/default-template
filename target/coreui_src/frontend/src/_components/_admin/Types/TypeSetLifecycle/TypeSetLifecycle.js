import React, { Component } from 'react';
import {DataTable, WaitingPane} from "_components/_common";
import {typeService} from "_services/type.services";
import {containerService} from "_services/container.services";
import {toast} from "react-toastify";

class TypeSetLifecycle extends Component {

    constructor(props) {
        super(props)
        this.state = {
            formData: {},
            errors:[],
            loading: true,
            pageSize: 10
        }

        this.selectLifecycle = this.selectLifecycle.bind(this)
        this.goToPage = this.goToPage.bind(this)

    }

    selectLifecycle(id) {
        this.setState({loading:true})
        typeService.setLifecycle(this.props.typeId, id, this.props.containerId).then(response => {
            this.setState({loading: false})

            if(response.ok){
                toast.success("Le cycle de vie a pas été changé")
                this.props.onCreateSuccess()
            }
            else {
                toast.error("Le cycle de vie n'a pas été changé")
            }
        })
    }

    actions(v, i){
        return <td>
            <div className={'btn-toolbar'}><button onClick={()=>this.selectLifecycle(v.id)}>Selectionner</button></div>
        </td>
    }

    componentDidMount() {
       this.goToPage(0)
    }

    goToPage(page){
        containerService.getAllLifecycles(this.props.containerId, page, this.state.pageSize, true).then(response => {
            this.setState({
                items : response.data, metaData:
                response.metaData, loading: false
            })
        })
    }

    render() {
        if(this.state.loading){
            return <WaitingPane/>
        }

        let errors = []
        if(this.state.errors.length > 0) {
            this.state.errors.map(error => {
                errors.push(<p>{error}</p>)
            })
        }

        const items = this.state.items;
        const metaData = this.state.metaData;
        const tableConfig = {
            columnsConfig: [
                { dataField: 'attributes.name' },
                { dataField: 'attributes.description' },
                { dataField: 'attributes', displayComponent: (v, i) => this.actions(v,i)},
            ],
        }

        return (
            <div className="type-set-lifecycle-root">
                <div id="form-errors-section" className="form-error">
                    {errors}
                </div>
                <div className="">
                    <DataTable items={JSON.stringify(items)}
                               metaData={JSON.stringify(metaData)}
                               tableConfig={tableConfig}
                               tableClassName="data-table"
                               goToPage={this.goToPage}
                               pagination={true}
                               displayTotalElements={true}
                               paginate={true}/>
                </div>
            </div>
        )
    }
}

export default TypeSetLifecycle;
