import produce from "immer"

const inialState = {
	appConfig: {
		// used in forward layout, to display page title in header
		currentPageTitle: '',
	},
}
export const applicationReducer = (state = inialState, action) => {
	  switch(action.type) {
	    case 'UPDATE_APPLICATION_PROPERTIES_PAGE_TITLE':
	    	const ns1 = produce(state, appConfig => {
	    		appConfig.currentPageTitle = action.payload
				// TODO update document title here
			})
	    	return ns1
	    
	    case 'APPLICATION_SET_ADMIN_HOME_ACTIVE_TAB':
	    	const ns7 = produce(state, appConfig => {
	    		appConfig.adminHome = action.payload
			})
	    return ns7

	    case 'APPLICATION_UPDATE_LIFECYCLE_NAV_CRITERIAS':
	    	const ns9 = produce(state, appConfig => {
	    		appConfig.lifecycleNavCriterias = action.payload
			})
			return ns9
	    case 'APPLICATION_UPDATE_EMAIL_TEMPLATES_NAV_CRITERIAS':
	    	const ns10 = produce(state, appConfig => {
	    		appConfig.emailTemplatesNavCriterias = action.payload
			})
			return ns10
	    default:
	    	return state;
	  }
}