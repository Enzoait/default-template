import React from 'react';
import {StatusHelper} from "_helpers/StatusHelper";

function LifecycleAndTypeStatus(props){
    const status = props.item?.attributes?.lifecycleInfo?.currentState;
    const typeDisplay = props.typeDisplay ? props.typeDisplay : props.item.businessType?.displayName;

    return <div style={RootStyle}>
        {typeDisplay && <div style={TypeStyle}>{typeDisplay}</div>}
        {status && <div className={''}>{StatusHelper.uiDisplay(status)}</div>}
    </div>
}

export default LifecycleAndTypeStatus;


const RootStyle = {
    width: '100%',
    float: 'right',
    display: 'flex',
    justifyContent: 'flex-end'
}

const TypeStyle = {
    background: "#dedede",
    color: '#333',
    marginRight: '1rem',
    fontSize: '13px',
    maxHeight: '2rem',
    padding: '0.5rem',
    borderRadius: '4px'
}
