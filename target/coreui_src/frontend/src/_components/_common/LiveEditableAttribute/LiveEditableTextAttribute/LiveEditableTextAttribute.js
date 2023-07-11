import React, {useEffect, useState} from 'react';

function LiveEditableTextAttribute(props){

    const[viewDivHover, setViewDivHover] = useState(false);
    const[viewMode, setViewMode] = useState('view');
    const[value, setValue] = useState();
    const[initialValue, setInitialValue] = useState();

    useEffect(() => {
        setInitialValue(props.value)
        setValue(props.value)
    }, [props.value])

    const beginEdition = () => {
        setViewMode('edit')
    }

    const cancelEdition = () => {
        setViewMode('view')
        setValue(initialValue)
    }

    const save = () => {
        props.save(value)
        setInitialValue(value)
        setViewMode('view')
    }

    if(viewMode === 'view') {
        const className = props.className ? 'live-updater ' + props.className : 'live-updater ';
        return <div className={className}>
            <span>{initialValue}</span>
            <button style={{marginLeft: '0.4rem'}} onClick={beginEdition}>
                <i className={'fa fa-md fa-pencil'}></i>
            </button>
        </div>
    }

    return <div style={{
        border: '2px solid #dedede',
        padding: '0.2rem 0.1rem 0.4rem 0.4rem',
        fontSize: '16px',
        display: 'flex',
        marginRight: '1rem'
    }}>
        <input type={'text'} value={value} onChange={e => setValue(e.target.value)}/>
        <button style={{marginLeft: '0.4rem'}} onClick={save}>
            <i className={'fa fa-md fa-save'}></i>
        </button>
        <button style={{marginLeft: '0.4rem'}} onClick={cancelEdition}>
            <i className={'fa fa-md fa-reply'}></i>
        </button>
    </div>

}

export default LiveEditableTextAttribute;