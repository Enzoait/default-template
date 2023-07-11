import React, {useState} from "react";
import {fadeIn} from 'react-animations'
import Radium, {StyleRoot} from 'radium';

const styles = {
    fadeIn: {
        animation: 'x 100ms',
        animationName: Radium.keyframes(fadeIn, 'fadeIn')
    }
}

function Accordion(props) {

    const [expanded, setEpanded] = useState(props.expanded ? props.expanded : expanded);

    const expand = () => {
        setEpanded(!expanded);
    }

    return <StyleRoot>
        <div className={'accordion-pane'}>

            {props.titleComponent}

            {
                props.title ? <h3 className="form-title-level-0 hand-hover" onClick={expand}>{props.title}</h3> : <></>
            }

            {expanded && <div style={styles.fadeIn}>
                {props.content}
            </div>
            }
        </div>
    </StyleRoot>
}

export default Accordion;