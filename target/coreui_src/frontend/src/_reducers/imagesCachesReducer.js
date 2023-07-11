import produce from "immer"

const inialState = {
}

export const imagesCachesReducer = (state = inialState, action) => {
	  switch(action.type) {
	    case 'ADD_BASE64_IMAGE_TO_CACHE':
	    	const ns1 = produce(state, imageCache => {
	    		imageCache[action.payload.key] = action.payload.image
			})
	    	return ns1;
	    	
	    case 'CLEAR_IMAGE_CACHE':
	    	const ns2 = produce(state, imageCache => {
	    		
			})
	    	return inialState;
	    default:
	    	return state;
	  }
}
