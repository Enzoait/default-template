import * as types from '_actions/actionTypes.js';
import produce from "immer"

const inialState = {
}
/**
 * Reducers for people searching
 */
export const headerSearchReducer = (state = inialState, action) => {
	  switch(action.type) {
	    case types.SEARCH_HEADER_COMP_SEARCHTERM_UPDATE:
	    	const nextState = produce(state, search => {
	    		search.searchTerm = action.payload.searchTerm
	    		search.criterias = action.payload.criterias
			})
	    	return nextState
	    case types.SEARCH_HEADER_COMP_SEARCH_RESULTS:
	    	const ns = produce(state, search => {
	    		search.searchResults = action.payload	
			})
			return ns
	    default:
	    	return state;
	  }
}