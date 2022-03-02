import { LOADING_FALSE, LOADING_TRUE, SET_STATE } from './constants';

export const initState = {
    user: {},
    loading: false,
};

function reducer(state, action) {
    switch (action.type) {
        case SET_STATE: {
            return {
                ...state,
                user: action.payload,
            };
        }
        case LOADING_TRUE: {
            return {
                ...state,
                loading: true,
            };
        }
        case LOADING_FALSE: {
            return {
                ...state,
                loading: false,
            };
        }
        default: {
            break;
        }
    }
}

export default reducer;
