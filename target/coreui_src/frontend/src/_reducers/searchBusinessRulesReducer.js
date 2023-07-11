import * as types from '_actions/actionTypes.js';
import produce from "immer"

const inialState = {
	
}
/**
 * Reducers for business rules searching
 */
export const searchBusinessRulesReducer = (state = inialState, action) => {
	  switch(action.type) {
	    case types.BUSINESS_RULES_SEARCHCRITERIAS_UPDATE:
	    	const nextState = produce(state, search => {
	    		search.rules = action.payload.rules
				search.types = action.payload.types
				search.businessType = action.payload.businessType
				search.businessClass = action.payload.businessClass
				search.searchTerm = action.payload.searchTerm
			})
	    	return nextState
	    default:
	    	return state
	  }
}