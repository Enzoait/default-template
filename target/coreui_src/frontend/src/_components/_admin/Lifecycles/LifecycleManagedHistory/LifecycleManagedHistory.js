import React, {useEffect, useState} from 'react';
import { Chrono } from "react-chrono";
import {EmptyPane} from "_components/_common";
import moment from 'moment'
import {lifecycleManagedService} from "_services/lifecycleManaged.services";
import {commons} from "_helpers/commons";
import {StatusHelper} from "_helpers/StatusHelper";

function LifecycleManagedHistory(props) {

    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    const getCreation = () => {
        const date = moment(props.item.attributes.createDate, 'YYYY-MM-DD HH:mm:ss S').format('DD-MM-YYYY HH:mm:ss');
        const creator = 'admin'
        const item = {
            title: date,
            cardTitle: "Creation",
            cardSubtitle: creator,
        }

        return item
    }

    const getItem = (data) => {
        const date = moment(data.attributes.createDate, 'YYYY-MM-DD HH:mm:ss S').format('DD-MM-YYYY HH:mm:ss');
        const creator = data.attributes.promoter.ownerSummary
        const state = StatusHelper.getDisplay(data.attributes.toStatus)
        const comment = data.attributes.comment
        const item = {
            title: date,
            cardTitle: state,
            cardSubtitle: creator,
            cardDetailedText: comment
        }

        return item
    }

    useEffect(() => {

        const datas = []
        if(props.item){
            setLoading(true)
            const lmManagedId =  props.item.attributes.id
            datas.push(getCreation())

            lifecycleManagedService.lifecycleHistory(lmManagedId, props.containerId).then(response => {
                if(!commons.isRequestError(response)) {
                    response.data.map(data => {
                        datas.push(getItem(data))
                    })
                }

                setItems(datas)
                setLoading(false)
            })
        }
        else {
            setLoading(false)
        }

    }, [props.item]);


    if(loading){
        return <></>
    }

    if(items.length < 1){
        return <EmptyPane />
    }

    return <div style={{ width: "700px", margin: 'auto', marginTop: '2rem'}}>
            <Chrono
                enableOutline
                items={items}
                mode="VERTICAL_ALTERNATING"
            />
    </div>
}

export default LifecycleManagedHistory;
