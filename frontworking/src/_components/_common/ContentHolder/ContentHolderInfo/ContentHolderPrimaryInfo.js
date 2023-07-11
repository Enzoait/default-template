import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {contentHolderService} from '_services/contentHolder.services';
import ContentHolderPrimaryAction from '_components/_common/ContentHolder/ContentHolderAction'

const propTypes = {
    contentHolderId: PropTypes.string.isRequired
}

const defaultProps = {}

function ContentHolderPrimaryInfo(props) {

    const [primaryContent, setPrimaryContent] = useState();

    useEffect(() => {
        let contentHolderId = props.contentHolderId
        contentHolderService.contentInfos(contentHolderId, 'primary', props.containerId).then(ci => {
            setPrimaryContent(ci.data)
        })
    }, [props.contentHolderId])

    const onUploadSuccess = () => {
        let contentHolderId = props.contentHolderId
        contentHolderService.contentInfos(contentHolderId, 'primary', props.containerId).then(ci => {
            setPrimaryContent(ci.data)
        })
    }

    if (primaryContent && primaryContent.length > 0) {
        let item = primaryContent[0]
        let displayContentSize = props.displayContentSize ? props.displayContentSize : false
        let mime = item.attributes.contentFormat ? item.attributes.contentFormat.mimeType : '',
            fileName = props.contentHolderFileName ? props.contentHolderFileName : 'Contenu primaire'

        return <div className="content-holder-primary-info" style={{display: 'flex', justifyContent: 'space-between'}}>
            <div>
                <div>{fileName}</div>
                <div>{mime}</div>
                {displayContentSize && <div>{item.attributes.contentSize} octet(s)</div>}
            </div>
            <div>
                <ContentHolderPrimaryAction
                    onUploadSuccess={onUploadSuccess}
                    containerId={props.containerId}
                    contentHolderId={props.contentHolderId}
                    canUpload={props.canUpload}/>
            </div>
        </div>
    } else {
        return <div className="content-holder-primary-info" style={{display: 'flex', justifyContent: 'space-between'}}>
            <p>Pas de contenu primaire</p>
            <ContentHolderPrimaryAction
                onUploadSuccess={onUploadSuccess}
                noContent={true}
                containerId={props.containerId}
                contentHolderId={props.contentHolderId}
                canUpload={props.canUpload}/>
        </div>
    }
}

ContentHolderPrimaryInfo.propTypes = propTypes;
ContentHolderPrimaryInfo.defaultProps = defaultProps;

export default ContentHolderPrimaryInfo;
