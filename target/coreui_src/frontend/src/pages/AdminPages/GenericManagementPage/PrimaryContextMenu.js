import React, { Component } from 'react';
import PlatformContextMenu from './PlatformContextMenu.js'
import Sidebar from "react-sidebar";
import {commons} from "_helpers/commons";

class PrimaryContextMenu extends Component {

    constructor(props){
        super(props)
        this.state = {
            sidebarOpen: true,
        }

        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
        this.sidebarContent = this.sidebarContent.bind(this);
    }

    onSetSidebarOpen(open) {
        this.setState({ sidebarOpen: open });
    }

    sidebarContent(){
        return  <div className="admin-main-left-menu">
            <PlatformContextMenu
                {...this.props} menu={this.props.menuContent}/>
        </div>
    }

    render(){
        return <>
            <Sidebar
                rootClassName="root-sidebar"
                sidebarClassName="sidebar-content"
                overlayClassName="sidebar-overlay"
                sidebar={this.sidebarContent()}
                open={true}
                transitions={false}
                onSetOpen={this.onSetSidebarOpen}
                docked={true}>
            </Sidebar>
        </>
    }
}

export default PrimaryContextMenu;
