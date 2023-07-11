import produce from "immer"

const inialState = {
    userContext: {
        systemPreferences:[],
        userPreferences: [],
        rolesInApplicationContainer: [],
        rolesInWorkingContainer: [],
        applicationcContainer: {},
        workingContainer: {},
        userAccount: {},
        userDetails: {},
        sessionId: 'not_authentified'
    }
}

export const userContextReducer = (state = inialState, action) => {
    switch (action.type) {
        case 'UPDATE_USER_CONTEXT':

            const ns2 = produce(state, nexState => {
                nexState.userContext = action.payload
            })

            return ns2;
        case 'CLEAR_USER_CONTEXT':
            const ns3 = produce(state, nexState => {
                nexState.userContext = inialState.userContext
            })
            return ns3;
        case 'SET_USER_CONTEXT_NOT_AUTH':
            const ns4 = produce(state, nexState => {
                let userContext = {...nexState.userContext}
                userContext.sessionId = 'not_authentified'
                nexState.userContext = userContext
            })
            return ns4;
        default:
            return state;
    }
}

export const updateUserContext = (payload) => ({
    type: 'UPDATE_USER_CONTEXT',
    payload: payload,
});

export const clearUserContext = (payload) => ({
    type: 'CLEAR_USER_CONTEXT',
    payload: payload,
});

export const setUserContextNotAuthentified = (payload) => ({
    type: 'SET_USER_CONTEXT_NOT_AUTH',
    payload: payload,
});
