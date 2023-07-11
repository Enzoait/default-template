import produce from "immer"


const inialState = {
	config: {
		viewName: 'emailTemplates',
    	location: 'Règles métiers',
    	breadItems: [{href:'#', title:'Règles métiers'}],
    	viewMode: 'viewList',
    	menuGroup: 'platformAdministration',
	},
}

export const navigationReducer = (state = inialState, action) => {
  switch(action.type) {
	case 'SET_ADMIN_HOME_ACTIVE_TAB':
    	const ns13 = produce(state, actualState => {
    		actualState.config = action.payload
    		actualState.config.activeMenu = action.payload.viewName
		})
		return ns13
    default:
    	return state;
  }
}