import React, { Component } from 'react';
import ListGroup from 'react-bootstrap/ListGroup'
import {DefaultFooter} from '_components/_common';

class DemoContextMenu extends Component {

    constructor(props){
        super(props)

        this.state = {
            allStores: false,
        }

        this.setDisplayedView = this.setDisplayedView.bind(this)
    }

    // METHODS

    menu() {
        const menu = [
            // MENU
        ];

        return menu;
    }

    setDisplayedView(e, key, name, breadItems, menuGroup){
        this.props.history.push('/admin?tab=home&v=' + key)
    }

    render(){
        let viewName = this.props.match.params.viewname
        let rows = [];
        this.menu().map(c => {
            let className ='fa fa-lg ' + c.className;
            let t = (
                <ListGroup.Item action active={viewName === c.key}
                                className="katappult-lgi-menu no-border"
                                onClick={e=>this.setDisplayedView(e, c.key, 'boutique')}>
                    <i className={className}></i>{c.name}
                </ListGroup.Item>
            );

            rows.push(t);
            if(c.dividerAfter){
                rows.push(<div className="menu-divider">&nbsp;</div>)
            }
        })

        return <>
            <div className="secondary-context-menu fadeIn">
                {rows}
                <DefaultFooter {...this.props}/>
            </div>
        </>
    }
}

export default DemoContextMenu
