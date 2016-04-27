import { SEARCH_GENE, SET_ORGANISM, SET_GENE } from '../constants/ActionTypes'

const initialState = {
    term: '',
    selectedOrganism: 9606,
    organisms: require("../constants/organisms.json")
};

export default function gene(state = initialState, action) {
    switch (action.type) {
        case SEARCH_GENE:
            return state;
        case SET_ORGANISM:
            return { ...state, selectedOrganism: action.organism };
        case SET_GENE:
            return { ...state, term: action.gene };
        default:
            return state;
    }
}

