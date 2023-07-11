import * as types from '_actions/actionTypes.js';
import produce from "immer"

const inialState = {

}
export const enumerationsReducer = (state = inialState, action) => {
	  switch(action.type) {
	    case types.ENUMERATIONS_SELECTION_UPDATE:
	    	const nextState = produce(state, enumds => {
	    		enumds.en = action.payload[0]
	    		enumds.fr = action.payload[1]
			})
	    	return nextState
	    default:
	    	return state;
	  }
}
