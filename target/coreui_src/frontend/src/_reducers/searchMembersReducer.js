import * as types from '_actions/actionTypes.js';
import produce from "immer"

const inialState = {
	
}
/**
 * Reducers for people searching
 */
export const searchMembersReducer = (state = inialState, action) => {
	  switch(action.type) {
	    case types.SEARCHTERM_UPDATE:
	    	const nextState = produce(state, search => {
	    		search.searchTerm = action.payload.searchTerm
	    		search.searchType = action.payload.searchType
			})
	    	return nextState
	    case types.SEARCH_RESULTS:
	    	const ns = produce(state, search => {
	    		search.searchResults = action.payload	
			})
			return ns
	    default:
	    	return state;
	  }
}