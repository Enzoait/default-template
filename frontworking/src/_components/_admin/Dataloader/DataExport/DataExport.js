import React, {Component} from 'react';
import {batchService} from '_services/batch.services';
import {commons} from '_helpers/commons';
import {toast} from 'react-toastify';
import FileSaver from 'file-saver';

class DataExport extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            errors: []
        }

        this.doBatchExport = this.doBatchExport.bind(this);
    }

    doBatchExport() {
        let exportConf = getExportByType(this.props.type)
        if (!exportConf) {
            toast.info("Export KO: type inconnu ")
            return
        }

        let form = {}
        form['separator.char'] = '|'
        form['input.file.path'] = exportConf.file
        form['job.name'] = exportConf.job
        form['job.type'] = exportConf.type
        form['export.command'] = exportConf.command
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

        batchService.batchExport(form, this.props.containerId).then(response => {
            if (response.message) {
                toast.error("Telechargement KO : " + response.message.substring(0, 200))
            } else {
                let path = response.metaData?.outputFilePath;
                if (path) {
                    let content = response.metaData.content
                    let blob = new Blob([content], {type: "plain/text;charset=UTF-8"});
                    FileSaver.saveAs(blob, this.props.fileName);
                } else {
                    toast.error("Telechargement KO");
                }
            }
            this.setState({loading: false})
        })
            .catch(error => {
                toast.error("Une erreur est survenue lors de l'export!")
                this.setState({loading: false})
            })
    }

    render() {
        let action = <div className={'btn-toolbar'}>
            <button onClick={this.doBatchExport}>{'Télécharger'}</button>
        </div>

        return <div className={'data-export-root'}>
            <span className={'title'}>{this.props.title}</span>
            {!this.state.loading && action}
            {this.state.loading && <div><i className={'fa fa-lg fa-spinner'}></i></div>}
        </div>
    }
}

export default DataExport;

const getExportByType = (type) => {
    if (type === 'EXPORT_FOR_USER_UPDATE_CATEGORY') {
        return ExportCategory;
    }
    if (type === 'EXPORT_FOR_USER_UPDATE_CATALOG') {
        return ExportCatalog;
    }
    if (type === 'EXPORT_FOR_USER_UPDATE_CLIENT_PRICE') {
        return ExportClientPrice;
    }
    if (type === 'EXPORT_FOR_USER_UPDATE_PRODUCTS') {
        return ExportProducts;
    }
    if (type === 'EXPORT_FOR_USER_UPDATE_USER_CATALOG_PROFILE') {
        return ExportClientProfile;
    }
    if (type === 'EXPORT_FOR_USER_UPDATE_PRODUCTS_DESC') {
        return ExportProductsDesc;
    }
    if (type === 'EXPORT_FOR_USER_UPDATE_PRODUCTS_ILLUSTRATION') {
        return ExportProductsIllustration;
    }
    if (type === 'EXPORT_FOR_USER_UPDATE_PRODUCTS_TVA') {
        return ExportProductsTVA;
    }
}

const ExportCategory = {
    job: "standardBatchExport",
    type: "manageShop",
    command: 'EXPORT_FOR_USER_UPDATE_CATEGORY',
    file: '/export/categories.sql'
}
const ExportCatalog = {
    job: "standardBatchExport",
    type: "manageShop",
    command: 'EXPORT_FOR_USER_UPDATE_CATALOG',
    file: '/export/catalogs.sql'
}
const ExportClientPrice = {
    job: "standardBatchExport",
    type: "manageShop",
    command: 'EXPORT_FOR_USER_UPDATE_CLIENT_PRICE',
    file: '/export/prixClients.sql'
}
const ExportProducts = {
    job: "standardBatchExport",
    type: "manageShop",
    command: 'EXPORT_FOR_USER_UPDATE_PRODUCTS',
    file: '/export/produits.sql'
}
const ExportProductsTVA = {
    job: "standardBatchExport",
    type: "manageShop",
    command: 'EXPORT_FOR_USER_UPDATE_PRODUCTS_TVA',
    file: '/export/produits.sql'
}
const ExportProductsDesc = {
    job: "standardBatchExport",
    type: "manageShop",
    command: 'EXPORT_FOR_USER_UPDATE_PRODUCTS_DESC',
    file: '/export/produits.sql'
}
const ExportProductsIllustration = {
    job: "standardBatchExport",
    type: "manageShop",
    command: 'EXPORT_FOR_USER_UPDATE_PRODUCTS_ILLUSTRATION',
    file: '/export/produitsIllustration.sql'
}
const ExportClientProfile = {
    job: "standardBatchExport",
    type: "manageShop",
    command: 'EXPORT_FOR_USER_UPDATE_USER_CATALOG_PROFILE',
    file: '/export/userCatalogProfile.sql'
}
