import React, {Component} from 'react';
import {TabContent, TabPane,} from 'reactstrap';
import classnames from 'classnames';
import {containerService} from '_services/container.services';
import {AttributeListGroup, PersistenceInfo, ThumbInfo, WaitingPane} from '_components/_common';
import {ContainerDeletion, ContainerOwner, ContainerSettings} from '_components/_admin/Container';
import {Nav} from 'react-bootstrap'

class ContainerDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeTab: '1',
            containerId: this.props.containerId,
            container: null,
            loading: true,
        }

        this.toggle = this.toggle.bind(this);
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    tabsConfigs() {
        const tabsConfig = {
            tabItems: [
                {id: '1', title: 'Summary', tabContent: () => this.overviewTabContent(), visible: () => true},
                {id: '2', title: 'Settings', tabContent: () => this.accountSystemPrefsContent(), visible: () => true},
            ],
        }

        return tabsConfig;
    }

    overviewTabContent() {
        const attributesList = {
            title: 'Summary',
            icon: 'fa fa-info float-right',
            addHeaderMargin: true,
            attributes: [
                {name: 'Name', dataField: 'attributes.name'},
                {name: 'Description', dataField: 'attributes.description'},
                {name: 'Path', dataField: 'attributes.path', displayComponent: (v) => this.path(v)},
                {name: 'Dex', dataField: 'attributes.numberSuffix'},
            ]
        }

        return <>
            <AttributeListGroup
                attributesListConfig={attributesList}
                data={this.state.container}
                canEdit={false}
                displayHeader='true'/>

            <PersistenceInfo   {...this.props}
                               data={this.state.container}
                               displayHeader='true'
                               addHeaderMargin="true"/>
        </>
    }

    accountSystemPrefsContent() {
        return <div className="mt-5">
            <ContainerOwner
                containerId={this.state.container.attributes.id}
                containerOwnerId={this.state.container.attributes.containerOwnerId}/>

            <ContainerSettings
                title='Sellsy settings'
                settingsType='sellsySettings'
                userSettings={true}
                containerId={this.state.container.attributes.id}
                containerOwnerId={this.state.container.attributes.containerOwnerId}/>

            <ContainerSettings
                title='Home page'
                settingsType='homePageSettings'
                userSettings={true}
                containerId={this.state.container.attributes.id}
                containerOwnerId={this.state.container.attributes.containerOwnerId}/>

            <ContainerSettings
                title='Theme'
                settingsType='themeSettings'
                userSettings={true}
                containerId={this.state.container.attributes.id}
                containerOwnerId={this.state.container.attributes.containerOwnerId}/>

            <ContainerSettings
                title='System settings'
                settingsType='systemSettings'
                systemSettings={true}
                containerId={this.state.container.attributes.id}
                containerOwnerId={this.state.container.attributes.containerOwnerId}/>

            <ContainerDeletion
                containerId={this.state.container.attributes.id}
                containerOwnerId={this.state.container.attributes.containerOwnerId}/>
        </div>
    }

    path(path) {
        let paths = []
        path.split('/').map(p => {
            if (p !== '')
                paths.push(<span><i className="fa fa-caret-right mr-1 ml-2"></i>{p}</span>)
        });
        return paths;
    }

    loadContainerDetails() {
        let wc = this.props.containerId
        containerService
            .getById(this.props.containerId, wc)
            .then(res => {

                if (this.props.pushBreadCrumb) {
                    //let item = {'href': '#', title: location}
                    //this.props.pushBreadCrumb(item)
                }

                this.setState({
                    container: res.data,
                    loading: false
                })
            })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.containerId !== this.props.containerId) {
            this.loadContainerDetails();
        }
    }

    componentDidMount() {
        this.loadContainerDetails();
    }

    renderLeftPane() {
        let thumbed = <ThumbInfo
            resize={true}
            thumbedId={this.props.containerId}
            canEdit={true}/>
        return (<>
            <div className="container-details-thumb">
                {thumbed}
            </div>
        </>)
    }

    render() {
        if (this.state.loading) {
            return <WaitingPane/>
        }

        let leftPane = this.renderLeftPane();
        let navTabItems = [], navTabContents = [], ritm = [];
        this.tabsConfigs().tabItems.map(tabItem => {
            const id = tabItem.id;
            if (tabItem.visible() === true) {
                navTabItems.push(
                    <Nav.Item className="flex-column">
                        <Nav.Link className={classnames({active: this.state.activeTab === id.toString()})}
                                  onClick={() => {
                                      this.toggle(id.toString());
                                  }}
                                  eventKey={id.toString()}>
                            {tabItem.title}</Nav.Link>
                    </Nav.Item>
                )
            }
        });

        this.tabsConfigs().tabItems.map(tabItem => {
            const id = tabItem.id;
            if (tabItem.visible() === true) {
                navTabContents.push(<TabPane tabId={id.toString()} className="no-padding p-1">
                    {tabItem.tabContent(ritm)}
                </TabPane>);
            }
        });

        return (<div className="container-details-2">
            {leftPane}
            <Nav>
                {navTabItems}
            </Nav>

            <div className="admin-details-item-title">
                <p className="page-title">{this.state.container.attributes.name}</p>
            </div>

            <TabContent activeTab={this.state.activeTab}>
                {navTabContents}
            </TabContent>
        </div>)
    }
}

export default ContainerDetails;

