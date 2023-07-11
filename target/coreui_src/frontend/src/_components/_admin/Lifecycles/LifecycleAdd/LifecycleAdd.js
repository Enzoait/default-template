import React, { Component } from 'react';
import { AttributeListGroup} from '_components/_common';
import {WaitingPane} from "_components/_common";
import {lifecycleService} from "_services/lifecycle.services";
import {toast} from "react-toastify";

class LifecycleAdd extends Component {

    constructor(props) {
        super(props)
        this.state = {
            formData: {},
            errors:[]
        }

        this.createLifecycle = this.createLifecycle.bind(this)
    }

    async createLifecycle(formData) {
        this.setState({loading:true})

        formData.containerId = this.props.containerId;

        let formData2 = new FormData()
        formData2.append('file', formData.masterFile)
        formData2.append('form', JSON.stringify(formData));

        lifecycleService.createLifecycle(formData2, this.props.containerId).then(response => {
            this.setState({loading: false})
            this.props.onCreateSucess();
            toast.success("Le cycle de vie a été créé")
        })
    }

    /**
     * Attributes list
     */
    attributesList(){
        const attributesList = {
            formId: 'dt-form',
            saveButtonTitle: 'CRÉER',
            onSubmit: (formData) => this.createLifecycle(formData),
            attributes: [
                {name: 'Nom', dataField: 'name', required:true,  placeHolder: 'Nom', pattern:"[-_ a-zA-Z0-9]+"},
                {name: 'Description', dataField: 'description',  required: true, placeHolder: 'Description'},
                {name: 'Contenu', dataField: 'primary', type:'file' ,required: true, placeHolder: 'Contenu'},
            ]
        }

        return attributesList;
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

        let formData ={...this.state.formData}
        return (
            <div className="container-create-root">
                <div id="form-errors-section" className="form-error">
                    {errors}
                </div>
                <AttributeListGroup
                    attributesListConfig={this.attributesList()}
                    data={formData}
                    standardFooterActions="true"
                    formMode='create_object'/>
            </div>
        )
    }
}

export default LifecycleAdd;
