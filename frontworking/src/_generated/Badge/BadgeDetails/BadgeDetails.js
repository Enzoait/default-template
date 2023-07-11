import React, {useEffect, useState} from 'react';
import {AttributeListGroup, PersistenceInfo, WaitingPane, Accordion} from "_components/_common";
import queryString from 'query-string';
import {BadgeService} from "_services/_generated/Badge.services";
import {commons} from "_helpers/commons";
import LifecycleAndTypeStatus from "_components/_common/LifecycleAndTypeStatus";
import {toast} from "react-toastify";
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
// IMPORT

function BadgeDetails(props)  {

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
        BadgeService.detailsEntity(itemId, props.containerId).then(response => {
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
        BadgeService.updateEntity(itemId, form, props.containerId).then(response => {
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
        // ACTIONS VARIABLES

         return <div className="btn-toolbar btn-toolbar-right">
        {/*ACTIONS_BUTTON*/}
         </div>
    }


    const attributesList = {
        onSubmit: (formData) => updateDatas(formData),
        attributes: [
            {name: "Identification", dataField: "identification",  required: true,  placeHolder: "Identification", type: "text", invalidFeedBack: "Veuillez renseigner ce champs"},
{name: "Expiration date", dataField: "expirationDate", required: true, placeHolder: "Expiration date", type: "datetime", dateFormat: "DD/MM/YYYY HH:mm", invalidFeedBack: "Veuillez renseigner ce champs"},
{name: "Active", dataField: "isActive", required: true, placeHolder: "Active", type: "yesno", invalidFeedBack: "Veuillez renseigner ce champs"},
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
                        {/*Accordion_2*/}
              </Tab>
              {/*tabs*/}
        </Tabs>
    </div>

}

export default BadgeDetails;

const LifecycleStyle = {
    width: '50%'
}


// FOOTER
