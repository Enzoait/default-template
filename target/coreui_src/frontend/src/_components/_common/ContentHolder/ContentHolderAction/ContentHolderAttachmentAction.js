import React, {Component} from 'react';
import {Button} from 'reactstrap'
import PropTypes from 'prop-types'
import FileSaver from 'file-saver'
import {contentHolderService} from '_services/contentHolder.services'

const propTypes = {
    contentHolderId: PropTypes.string.isRequired
}

const defaultProps = {}

/**
 * Download/Upload, view content action on a content holder
 */
class ContentHolderAttachmentAction extends Component {
    constructor(props) {
        super(props)
        this.downloadAttachmentContent = this.downloadAttachmentContent.bind(this)
        this.viewAttachmentContent = this.viewAttachmentContent.bind(this)
        this.setAttachmentContent = this.setAttachmentContent.bind(this)
    }

    /**
     * Download the primary content
     */
    downloadAttachmentContent(e) {
        e.preventDefault()
        contentHolderService
            .downloadAttachmentContentBlob(this.props.contentHolderId, this.props.containerId)
            .then(blob => {
                FileSaver.saveAs(blob, 'primary.txt');
            })
    }

    /**
     * View the primary content
     */
    viewAttachmentContent(e) {
        e.preventDefault()
        contentHolderService
            .downloadAttachmentContent(this.props.contentHolderId, this.props.containerId)
            .then(response => {
                let blob = new Blob([response], {type: 'text/plain'});
                let blobUrl = URL.createObjectURL(blob);

                let w = window.open(blobUrl)
            })
    }

    /**
     * Upload the primary content
     */
    setAttachmentContent(e) {
        e.preventDefault()
    }

    render() {
        return (<>
            <Button onClick={this.viewAttachmentContent}><i className="fa fa-file fa-md"></i></Button>
            <Button onClick={this.setAttachmentContent}><i className="fa fa-upload fa-md"></i></Button>
            <Button onClick={this.downloadAttachmentContent}><i className="fa fa-download fa-md"></i></Button>
        </>)
    }
}

ContentHolderAttachmentAction.propTypes = propTypes;
ContentHolderAttachmentAction.defaultProps = defaultProps;

export default ContentHolderAttachmentAction;
