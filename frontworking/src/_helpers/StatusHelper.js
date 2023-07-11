import React from 'react';

export const StatusHelper = {
	getDisplay,
	getDisplayForStatus,
	getAction,
	uiDisplay
}

function getAction(action){
	return  getDisplay()
}

function getDisplay(status) {
	if(status === 'NEW') return 'Nouveau'
	if(status === 'DRAFT') return 'Brouillon'
	if(status === 'ARCHIVED') return 'Archiver'
	if(status === 'CONFIRMED') return 'Confirmer'
	if(status === 'TO_DELIVER') return 'A Livrer'
	if(status === 'DELIVERED') return 'Livrer'
	if(status === 'CANCELED_BY_USER') return 'Annuler'
	if(status === 'CANCELED_BY_USR') return 'Annuler'
	if(status === 'CANCELED_BY_ADM') return 'Annuler'
	if(status === 'DELIVERING') return 'En cours de livraison'
	if(status === 'PUBLISHED') return 'Publier'
	if(status === 'PENDING') return 'En attente'
	if(status === 'PAYED') return 'Payer'
	if(status === 'CANCELLED') return 'Annuler'
	if(status === 'OUT_OF_STOCK') return 'En rupture de stock'
	if(status === 'SUSPENDED') return 'Suspendu'
	if(status === 'DISCONTINUED') return 'Indisponible'
	if(status === 'RETIRED') return 'Retirer'
	if(status === 'AVALAIBLE') return 'Disponible'
	if(status === 'AVAILABLE') return 'Disponible'
	if(status === 'IN_VALIDATION') return 'Valider'
	if(status === 'LOCKED_MEMBER') return 'Bloquer'
	if(status === 'DRAFT_STATE') return 'Brouillon'
	if(status === 'REQUEST_IN_PROGRESS') return 'En cours'
	if(status === 'RETIRED_MEMBER') return 'Retirer'
	if(status === 'OBSELETE_STATE') return 'Obsolete'
	if(status === 'PRE_RELEASE_STATE') return 'En attente de validation'
	if(status === 'IN_WORK') return 'Reserver'
	if(status === 'RELEASED_STATE') return 'Valider'
	if(status === 'VALID_MEMBER') return 'Membre'
	if(status === 'PROMOTE') return 'PROMOUVOIR LE STATUT'
	if(status === 'SET_STATE') return 'CHANGER LE STATUT'
	if(status === 'ADMIN_SET_STATE') return 'CHANGER LE STATUT'
	if(status === 'REVISE') return 'REVISER'
	if(status === 'ACCEPTED') return 'ACCEPTER'
	if(status === 'REFUSED') return 'REFUSER'
	if(status === 'CLOSED') return 'FERMER'
	return status
}

function getDisplayForStatus(status) {
	if(!status) return ""
	if(status.toUpperCase() === 'NEW') return 'Nouveau'
	if(status.toUpperCase() === 'DRAFT') return 'Brouillon'
	if(status.toUpperCase() === 'ARCHIVED') return 'Archivé'
	if(status.toUpperCase() === 'CONFIRMED') return 'Confirmé'
	if(status.toUpperCase() === 'TO_DELIVER') return 'À livrer'
	if(status.toUpperCase() === 'DELIVERED') return 'Livré'
	if(status.toUpperCase() === 'CANCELED_BY_USER') return 'Annulé'
	if(status.toUpperCase() === 'CANCELED_BY_USR') return 'Annulé'
	if(status.toUpperCase() === 'CANCELED_BY_ADM') return 'Annulé'
	if(status.toUpperCase() === 'DELIVERING') return 'En livraison'
	if(status.toUpperCase() === 'PUBLISHED') return 'Publié'
	if(status.toUpperCase() === 'PENDING') return 'En attente'
	if(status.toUpperCase() === 'PAYED') return 'Payé'
	if(status.toUpperCase() === 'CANCELLED') return 'Annulé'
	if(status.toUpperCase() === 'OUT_OF_STOCK') return 'Rupture de stock'
	if(status.toUpperCase() === 'SUSPENDED') return 'Suspendu'
	if(status.toUpperCase() === 'DISCONTINUED') return 'Indisponible'
	if(status.toUpperCase() === 'RETIRED') return 'Retiré'
	if(status.toUpperCase() === 'AVALAIBLE') return 'Disponible'
	if(status.toUpperCase() === 'AVAILABLE') return 'Disponible'
	if(status.toUpperCase() === 'IN_VALIDATION') return 'Validation en cours'
	if(status.toUpperCase() === 'LOCKED_MEMBER') return 'bloqué'
	if(status.toUpperCase() === 'DRAFT_STATE') return 'Brouillon'
	if(status.toUpperCase() === 'REQUEST_IN_PROGRESS') return 'En cours'
	if(status.toUpperCase() === 'RETIRED_MEMBER') return 'Retiré'
	if(status.toUpperCase() === 'OBSELETE_STATE') return 'Obsolete'
	if(status.toUpperCase() === 'PRE_RELEASE_STATE') return 'En attente de validation'
	if(status.toUpperCase() === 'IN_WORK') return 'Copie de travail'
	if(status.toUpperCase() === 'RELEASED_STATE') return 'Validé'
	if(status.toUpperCase() === 'VALID_MEMBER') return 'Membre'
	if(status.toUpperCase() === 'VALID') return 'Validé'
	if(status.toUpperCase() === 'ACCEPTED') return 'Accepté'
	if(status.toUpperCase() === 'REFUSED') return 'Refusé'
	if(status.toUpperCase() === 'CLOSED') return 'Fermé'
	return status
}

function uiDisplay(status){
	if(!status) return <></>
	const statusWithoutBlank = status.replace(/\s/g,'').toLowerCase();
	return <div className={'status-display ' + 'status-display-' + statusWithoutBlank}>
		<i className={'fa fa-lg fa-tag'}></i>
		<span>{getDisplayForStatus(status)}</span>
	</div>
}
