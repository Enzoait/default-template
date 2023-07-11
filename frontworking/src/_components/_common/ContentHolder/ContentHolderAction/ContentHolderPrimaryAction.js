import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FileSaver from 'file-saver';
import {contentHolderService} from '_services/contentHolder.services';
import ContentFileSelector from './ContentFileSelector.js';
import Button from 'react-bootstrap/Button'
import {toast} from 'react-toastify';
import {commons} from "_helpers/commons";

const propTypes = {
    contentHolderId: PropTypes.string.isRequired,
    canDelete: PropTypes.bool,
    canUpdload: PropTypes.bool,
    canDownload: PropTypes.bool,
    canView: PropTypes.bool,
}

const defaultProps = {
    canDelete: false,
    canUpdload: true,
    canDownload: true,
    canView: true,
}

/**
 * Download/Upload, view content action on a content holder
 */
class ContentHolderPrimaryAction extends Component {

    constructor(props) {
        super(props)
        this.downloadPrimaryContent = this.downloadPrimaryContent.bind(this)
        this.viewPrimaryContent = this.viewPrimaryContent.bind(this)
        this.onChangeFile = this.onChangeFile.bind(this)
        this.deletePrimaryContent = this.deletePrimaryContent.bind(this)
    }

    onChangeFile(e) {
        e.preventDefault();
        let file = e.target.files[0];
        let formData = new FormData();
        formData.append('file', file);

        contentHolderService.setPrimaryContentFile(this.props.contentHolderId, formData, this.props.containerId).then(response => {
            if (commons.isRequestError(response)) {
                toast(commons.toastError(response));
            } else {
                toast(commons.toastSuccess('Le contenu primaire a été téléversé'));
                if (this.props.onUploadSuccess) {
                    this.props.onUploadSuccess()
                }
            }
        })
    }

    async deletePrimaryContent() {
        contentHolderService.deletePrimaryContent(this.props.contentHolderId, this.props.containerId).then(response => {
            if (!commons.isRequestError(response)) {
                toast(commons.toastSuccess("Le contenu a été supprimé"));
                if (this.props.onUploadSuccess) {
                    this.props.onUploadSuccess()
                }
            } else {
                toast.error("Impossible de supprimer le contenu");
            }
        })
    }

    async downloadPrimaryContent(e) {
        e.preventDefault();
        const downloadedFileName = this.props.downloadedFileName ? this.props.downloadedFileName : 'primary-content.txt';
        contentHolderService.downloadPrimaryContent(this.props.contentHolderId, this.props.containerId).then(blob => {
            const blobObject = new Blob([blob], {type: "text/plain;charset=utf-8"});
            FileSaver.saveAs(blobObject, downloadedFileName);
        })
    }

    async viewPrimaryContent(e) {
        e.preventDefault()
        contentHolderService.downloadPrimaryContent(this.props.contentHolderId, this.props.containerId).then(response => {
            let blob = new Blob([response], {type: "plain/text;charset=UTF-8"});
            let blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl)
        })
    }

    render() {
        const canUpload = this.props.canUpload ? this.props.canUpload : false;
        const hasContent = !this.props.noContent;
        const canDelete = !this.props.canDelete ? false: true;

        const downloadLabel = this.props.downloadLabel ? this.props.downloadLabel : 'Télécharger';
        const uploadLabel = this.props.uploadLabel ? this.props.uploadLabel : 'Téléverser contenu';

        if (canUpload) {
            return <div className={'btn-toolbar btn-toolbar-right'}>
                {hasContent && <Button onClick={this.downloadPrimaryContent}
                                       hidden={!this.props.canDownload}>
                    <i className="fa fa-download fa-sm"></i>&nbsp;{downloadLabel}
                </Button>
                }

                <ContentFileSelector hidden={!this.props.canUpdload}
                                     accept={this.props.accept}
                                     uploadLabel={uploadLabel}
                                     onChangeFile={this.onChangeFile}/>

                {hasContent && canDelete &&
                <Button onClick={this.deletePrimaryContent}>
                    <i className="fa fa-trash fa-md"></i>
                </Button>
                }
            </div>
        } else {
            return <div className={'btn-toolbar btn-toolbar-right'}>
                <Button onClick={this.downloadPrimaryContent}
                        hidden={!this.props.canDownload}>
                    <i className="fa fa-download fa-sm"></i>&nbsp;{downloadLabel}
                </Button>
            </div>
        }
    }
}

ContentHolderPrimaryAction.propTypes = propTypes;
ContentHolderPrimaryAction.defaultProps = defaultProps;

export default ContentHolderPrimaryAction;
