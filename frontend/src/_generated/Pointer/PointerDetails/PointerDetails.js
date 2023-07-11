import React, {useEffect, useState} from 'react';
import {AttributeListGroup, PersistenceInfo, WaitingPane, Accordion} from "_components/_common";
import queryString from 'query-string';
import {PointerService} from "_services/_generated/Pointer.services";
import {commons} from "_helpers/commons";
import LifecycleAndTypeStatus from "_components/_common/LifecycleAndTypeStatus";
import {toast} from "react-toastify";
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

import LifecycleManagedActions from '_components/_admin/Lifecycles/LifecycleManagedActions';
import LifecycleManagedHistory from "_components/_admin/Lifecycles/LifecycleManagedHistory/LifecycleManagedHistory";
import {StatusHelper} from "_helpers/StatusHelper";
// IMPORT

function PointerDetails(props)  {

    const[loading, setLoading] = useState(true)
    const[item, setItem] = useState()
    const[errors, setErrors] = useState([])
    // CONST

    const getRootObjectForDetailsId = () => {
        const queryUrlParams = queryString.parse(props.location.search);
        let objectforDetailsId = queryUrlParams.rootId;
        return objectforDetailsId
    }

    useEffect(() => {
        refresh()
    }, [props.location.search]);

    const refresh = () => {
        var itemId = getRootObjectForDetailsId();
        loadDatas(itemId)
    }

    const loadDatas = (itemId) => {
        setLoading(true)
        PointerService.detailsEntity(itemId, props.containerId).then(response => {
            const error = commons.isRequestError(response)
            if(!error){
                setItem(response.data)
            }

            setLoading(false)
        })
    }

    const updateDatas = (formData) => {
        var form = formData;
        form.containerId = props.containerId;

        var itemId = getRootObjectForDetailsId();
        PointerService.updateEntity(itemId, form, props.containerId).then(response => {
            const error = commons.isRequestError(response)
            if(error) {
                toast.error(commons.toastError(response));
                let message = response.errorFamily + ' - ' + response.message
                setErrors([message])
            }
            else {
                loadDatas(itemId);
                setErrors([])
                toast(commons.toastSuccess("L'élément a été mis à jour"));
                props.refresh()
            }
        })
    }

    // FUNCTIONS

    const headerActions = () => {
        
	const lifecycleManagedId = item.attributes.id;
    const currentState = item.attributes?.lifecycleInfo?.currentState;
    var lifecycleManagedActions = <LifecycleManagedActions
			{...props}
			inlineButtons={true}
			byActionName='SET_STATE'
			refreshCallBack={refresh}
			lifecycleManagedId={lifecycleManagedId}
			currentState={currentState}/>

// ACTIONS VARIABLES

         return <div className="btn-toolbar btn-toolbar-right">
        			{lifecycleManagedActions}
{/*ACTIONS_BUTTON*/}
         </div>
    }


    const attributesList = {
        onSubmit: (formData) => updateDatas(formData),
        attributes: [
            {name: "Name", dataField: "name",  required: true,  placeHolder: "Name", type: "text", invalidFeedBack: "Veuillez renseigner ce champs"},
{name: "Description", dataField: "description",  required: true,  placeHolder: "Description", type: "text", invalidFeedBack: "Veuillez renseigner ce champs"},
{name: "Identifier", dataField: "identifier",  required: true,  placeHolder: "Identifier", type: "text", invalidFeedBack: "Veuillez renseigner ce champs"},
{name: "Location", dataField: "location",  required: true,  placeHolder: "Location", type: "text", invalidFeedBack: "Veuillez renseigner ce champs"},
// DETAILS_ATTRIBUTES_LIST
        ]
    }

    if(loading) {
        return <WaitingPane/>
    }

    return <div className={'entity-details'}>
        <div className="admin-details-header">
            <div style={{display: 'flex', marginBottom: '1rem'}}>
              <p className="page-title" style={LifecycleStyle}>{item.attributes.name}</p>
              <LifecycleAndTypeStatus item={item}/>
            </div>
            {headerActions()}
        </div>

        <Tabs defaultActiveKey="1" id="uncontrolled-tab-x" className={"admin-nav-tabs"}>
              <Tab eventKey="1" title="Details">
                      <div style={{
                        marginBottom: '2rem',
                        paddingBottom: '1rem'
                      }}>
                          <p className=" form-error">{errors}</p>
                           <AttributeListGroup
                              canEdit={true}
                              standardFooterActions="true"
                              containerId={props.containerId}
                              attributesListConfig={attributesList}
                              data={item}/>
                       </div>

                       {/*Accordion_1*/}
                        <Accordion title={"Metadonnées"}
                                    expanded={true}
                                    content={
                                        <>
                                            <PersistenceInfo
                                                {...props}
                                                data={item}
                                                containerId={props.containerId}
                                                displayHeader={true}/>
                                        </>
                        }/>
                        <Accordion title={"Historique"}
                       expanded={true}
                       content={ <LifecycleManagedHistory
                                   {...props}
                                   item={item}/>
                       }/>

{/*Accordion_2*/}
              </Tab>
              {/*tabs*/}
        </Tabs>
    </div>

}

export default PointerDetails;

const LifecycleStyle = {
    width: '50%'
}


// FOOTER
