import React, { Component } from 'react';
import { installationService } from '_services/installation.services';
import { commons } from '_helpers/commons';
import {
	AttributeListGroup,
	PersistenceInfo,
} from '_components/_common';
import queryString from 'query-string';

const summaryAttributesList = {
    title: '',
    icon: 'fa fa-info float-right',
    updatable: false,
    attributes: [
        {name: 'Module', 	dataField: 'attributes.moduleName'},
        {name: 'Version', 	dataField: 'attributes.moduleVersion'},
        {name: 'Description', dataField: 'attributes.moduleDescription'},
        {name: 'Type', 	dataField: 'attributes.moduleType'},
        {name: 'Statut', dataField: 'attributes.status'},
        {name: 'Debut', dataField: 'attributes.installationStartTime', dateFormat: 'DD/MMM/YYYY HH:mm', type: 'date'},
		{name: 'Fin', dataField: 'attributes.installationEndTime', dateFormat: 'DD/MMM/YYYY HH:mm', type: 'date'},
    ]
};

/**
 * Application version history
 */
class AppVersion extends Component {

	constructor(props){
		super(props);
		this.state = {
			item: {},
			id: this.getRootObjectForDetailsId()
		}

		this.getRootObjectForDetailsId = this.getRootObjectForDetailsId.bind(this);
	}


	getRootObjectForDetailsId(){
		const queryUrlParams = queryString.parse(this.props.location.search);
		let objectforDetailsId = queryUrlParams.rootId;
		return objectforDetailsId
	}

    componentDidMount() {
		const versionHistoryId = this.getRootObjectForDetailsId();
		if(versionHistoryId !== null && versionHistoryId !== undefined){
			const d = installationService
				.details(versionHistoryId)
				.then(json => {
					this.setState({item: json});
	    		})
		}
	}

	componentDidUpdate(prevProps){
		const prevQueryUrlParams = queryString.parse(prevProps.location.search);
		const queryUrlParams = queryString.parse(this.props.location.search);
		let rootId = queryUrlParams.rootId;
		let prevId = prevQueryUrlParams.rootId;
		if(prevId !== rootId && rootId) {
			this.componentDidMount()
		}
	}

	render() {
        const data = this.state.item.data;
		if(data) {
			const d = commons.toJSONObject(data);
            return (
                <div className={"app-version-details"}>
					<div className="admin-details-header">
						<div className="admin-details-header-infos">
							<span className="page-title">{d.attributes.moduleName} </span>
						</div>
            		</div>

					<div className="admin-details-content">
						<div className={''}>
							<AttributeListGroup attributesListConfig={summaryAttributesList} data={d} orientation="horizontal"/>
						</div>
						<div className={''}>
							<PersistenceInfo  {...this.props} data={d}  orientation="horizontal" displayHeader="true"/>
						</div>
					</div>
                </div>
            );
        }
        else {
            return <div></div>
        }
	}
 }

export default AppVersion;
