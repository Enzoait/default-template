import React, { Component } from 'react';
import {AttributeListGroup, WaitingPane} from "_components/_common";
import {businessRuleExclusionService} from "_services/businessRuleExclusion.services";
import {commons} from "_helpers/commons";
import {toast} from "react-toastify";

class UserExclusionAdd extends Component {

    constructor(props) {
        super(props)
        this.state = {
            formData: {},
            errors:[]
        }

        this.create = this.create.bind(this)
        this.attributesList = this.attributesList.bind(this);
    }

    create(formData) {
        formData.businessRuleId = this.props.businessRuleId
        formData.containerId = this.props.containerId
        formData.type = "U"
        businessRuleExclusionService.createEntity(formData, this.props.containerId).then(response =>{
            if(commons.isRequestError(response)){
                toast.error(commons.toastError(response))
            }
            else {
                this.props.onSuccess()
            }
        })
    }

    attributesList(){
        const attributesList = {
            saveButtonTitle: 'AJOUTER',
            onSubmit: (formData) => this.create(formData),
            attributes: [
                {name: 'Login/Email', dataField: 'identifiant', required:true,  placeHolder: 'Login'},
                {name: 'Début', dataField: 'from', placeHolder: 'Date de début', type: "datetime"},
                {name: 'Fin', dataField: 'to', placeHolder: 'Date de fin', type: "datetime"}
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

export default UserExclusionAdd;
