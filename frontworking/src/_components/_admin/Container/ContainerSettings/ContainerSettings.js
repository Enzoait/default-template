import React, {Component} from 'react';
import {Button} from 'reactstrap';
import {containerService} from '_services/container.services';
import {DataTable, WaitingPane} from '_components/_common';
import Form from 'react-bootstrap/Form';
import {connect} from 'react-redux';

const mapStateToProps = store => ({
    containerSettingsRX: store.containerSettings.settings
})

const mapDispatchToProps = (disptach) => ({})

class ContainerSettings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            results: [],
            metaData: {},
            createForm: {},
            editingRow: null,

            canSynchronizeWithSellsy: false
        }

        this.updateEditedSetting = this.updateEditedSetting.bind(this);
        this.cancelEditedSetting = this.cancelEditedSetting.bind(this);
        this.setEditingRow = this.setEditingRow.bind(this);
        this.formDataChange = this.formDataChange.bind(this);
    }

    updateEditedSetting(val) {
        let form = {...this.state.createForm};

        containerService
            .updateContainerSetting(form, this.props.containerId, this.state.editingRow)
            .then((response) => {
                const {reloadAllContainerSettings} = this.props;
                if (reloadAllContainerSettings) {
                    reloadAllContainerSettings()
                }
                this.setState({
                    createForm: {},
                    editingRow: null,
                });
            })
    }

    cancelEditedSetting(val) {
        this.setState({
            createForm: {},
            editingRow: null
        })
    }

    setEditingRow(v) {
        let createForm = {};
        createForm['value'] = v.value;
        createForm['id'] = v.id;

        this.setState({
            editingRow: v.id,
            createForm: createForm,
        })
    }

    formDataChange(e) {
        let createForm = {...this.state.createForm}
        createForm[e.target.name] = e.target.value
        this.setState({
            createForm: createForm
        })
    }

    settingsDatatable() {
        const tableConfig = {
            columnsConfig: [
                {name: 'Name', displayComponent: (v, i) => this.nameValue(v, i), dataField: 'attributes.name'},
                {name: 'Value', displayComponent: (v, i) => this.settingsValue(v, i), dataField: 'attributes'},
                {displayComponent: (v, i) => this.rowAction(v, i), dataField: 'attributes'}
            ],
        }

        let datas = [];
        this.props.containerSettingsRX.map(res => {
            if (this.props.systemSettings === true) {
                if (res.attributes.systemSetting === true) {
                    if (res.attributes.displayGroup === this.props.settingsType) {
                        datas.push(res);
                    }
                }
            } else if (this.props.userSettings === true) {
                if (res.attributes.systemSetting !== true) {
                    if (res.attributes.displayGroup === this.props.settingsType) {
                        datas.push(res);
                    }
                }
            }
        })

        if (datas.length > 0) {
            return <div className="container-settings">
                <div className="form-title-level-0">{this.props.title}</div>
                <DataTable
                    items={JSON.stringify(datas)}
                    metaData={JSON.stringify(this.state.metaData)}
                    tableConfig={tableConfig}
                    displayTotalElements={true}
                    paginate={false}/>
            </div>
        }

        return <></>
    }

    nameValue(val) {
        return <td className="dt-center" width={'30%'}>
            {val}
        </td>
    }

    settingsValue(val) {
        let form;
        if (this.state.editingRow && this.state.editingRow === val.id) {
            form = (
                <Form.Control type="text"
                              placeholder="Value"
                              onChange={this.formDataChange}
                              value={this.state.createForm.value}
                              name="value"/>
            )
        } else {
            form = val.value;
        }

        return <td className="dt-center" width={'40%'}>
            {form}
        </td>
    }

    rowAction(v, i) {
        if (v.updatable === true) {
            if (this.state.editingRow && this.state.editingRow === v.id) {
                return <td width="12%">
                    <div className={'btn-toolbar'}>
                        <Button onClick={() => this.updateEditedSetting(v, i)}> MODIFIER </Button>
                        <Button onClick={() => this.cancelEditedSetting(v, i)}>ANNULER</Button>
                    </div>
                </td>
            } else {
                return <td width="12%">
                    <div className={'btn-toolbar'}>
                        <Button onClick={() => this.setEditingRow(v)}>
                            <i className="fa fa-pencil fa-lg"></i>
                        </Button>
                    </div>
                </td>
            }
        }

        return <td width="12%">
        </td>
    }

    render() {
        if (this.state.loading === true) {
            return <WaitingPane/>
        }

        return this.settingsDatatable();
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContainerSettings);