import React, {Component} from 'react';
import {batchService} from '_services/batch.services';
import {WaitingPane} from '_components/_common';
import {commons} from '_helpers/commons';
import {toast} from 'react-toastify';
import Form from 'react-bootstrap/Form'

class DataImport extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            errors: [],
            masterFile: null,
            importableTypes: []
        }

        this.doBatchImport = this.doBatchImport.bind(this);
        this.masterFileUpdate = this.masterFileUpdate.bind(this)
        this.reinitParams = this.reinitParams.bind(this)
        this.loadFileContent = this.loadFileContent.bind(this)
        this.selectChange = this.selectChange.bind(this)
    }

    masterFileUpdate(e) {
        this.setState({masterFile: e.target.files[0]})
        this.fileContent(e.target.files[0])
    }

    doBatchImport() {
        let formData2 = new FormData()
        formData2.append('file', this.state.masterFile)

        if (!this.state.masterFile) {
            toast.error('Veuillez sélectionner un fichier')
            return;
        }

        if (!this.state.importType) {
            toast.error("Type d'import inconnu")
            return
        }

        let form = {}
        form['separator.char'] = '|'
        form['input.file.path'] = ''
        form['job.name'] = "standardBatchImport"
        form['job.type'] = this.state.importType
        form['domain'] = commons.getWorkingContainerPath(this.props.userContext)
        form['container'] = commons.getWorkingContainerPath(this.props.userContext)
        form['attach.discarded.file'] = false
        form['attach.log.file'] = false
        form['email.success.template.name'] = 'DEFAULT_LOADER_EMAIL_SUCCESS_TEMPLATE'
        form['email.error.template.name'] = 'DEFAULT_LOADER_EMAIL_ERROR_TEMPLATE'
        form['log.file.extension'] = '.log'
        form['separator.char'] = '|'
        form['comment.char'] = '#'
        form['notify.on.error'] = 'false'
        form['notify.on.success'] = 'false'
        form['mail.on.success'] = false
        form['mail.on.error'] = false

        this.setState({loading: true})
        formData2.append('form', JSON.stringify(form));

        let fileName = this.state.masterFile.name
        this.reinitParams();

        batchService.batchLoad(formData2, this.props.containerId).then(response => {
            if (response.message) {
                toast.error("Une erreur est survenue lors du traitement du fichier : " + fileName);
            } else {
                toast.success("Import des données est terminé (" + fileName + ")")
            }

            this.setState({loading: false})
        })
            .catch(error => {
                this.setState({loading: false})
                toast.error("Une erreur est survenue lors du traitement du fichier : " + fileName);
            })
    }

    reinitParams() {
        this.fileInput.value = ""
        this.setState({masterFile: null, textFromFileLoaded: null})
    }

    loadFileContent(fileLoadedEvent) {
        let textFromFileLoaded = fileLoadedEvent.target.result;
        this.setState({textFromFileLoaded: textFromFileLoaded})
    }

    fileContent(masterFile) {
        let fileReader = new FileReader();
        fileReader.onload = (fileLoadedEvent) => this.loadFileContent(fileLoadedEvent);
        fileReader.readAsText(masterFile, "UTF-8");
    }

    componentDidMount() {
        batchService.importableTypes(this.props.containerId).then(response => {
            if (response.data && response.data) {
                this.setState({
                    importableTypes: response.data,
                    importType: response.data.length > 0 ? response.data[0].split(";")[0] : null
                })
            }
        })
    }

    selectChange(event) {
        this.setState({
            importType: event.target.value
        })
    }

    importableTypesSelect() {
        let options = []
        this.state.importableTypes.map(importableType => {
            let split = importableType.split(";")
            if (split.length > 1) {
                let type = split[0];
                let desc = split[1];
                options.push(<option value={type}>{desc}</option>)
            }
        })

        return <Form.Control as="select" style={{width: '50%', marginRight: '1rem'}} onChange={this.selectChange}>
            {options}
        </Form.Control>
    }

    render() {
        let action = <div className={'btn-toolbar'}>
            <button onClick={this.reinitParams}>{'Réinitialiser le formulaire'}</button>
            <button onClick={this.doBatchImport} style={{width: '30%'}}>{"Lancer l'import"}</button>
        </div>

        let content = <div className={'master-file-input'}>
            <input type="file" onChange={this.masterFileUpdate} ref={ref => this.fileInput = ref} accept={'.csv'}/>
            <div style={{'display': 'flex', marginTop: '1rem', marginBottom: '2rem'}}>
                {this.importableTypesSelect()}
            </div>
        </div>

        if (this.state.loading) {
            return <div>
                <WaitingPane/>
            </div>
        }

        return <div className={'shadowed-pane root-pane'}>
            {content}
            {action}
            {this.state.textFromFileLoaded &&
            <div style={{'margin-top': '2rem', 'border': '1px solid #333', 'padding': '1rem', 'overflow': 'scroll'}}>
                {this.state.textFromFileLoaded}
            </div>
            }
        </div>
    }
}

export default DataImport;
