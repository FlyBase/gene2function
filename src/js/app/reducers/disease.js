import { SEARCH_DISEASE, SET_DISEASE } from '../constants/ActionTypes'

const initialState = {
    term: ''
};

export default function disease(state = initialState, action) {
    switch (action.type) {
        case SEARCH_DISEASE:
            return state;
        case SET_DISEASE:
            return { ...state, term: action.disease };
        default:
            return state;
    }
}

