import { SEARCH_TERM, SEARCH_SENT, RECEIVED_RESULTS, SET_ORGANISM_FILTER } from '../actions';

const initialState = {
    term: '',
    genes: [],
    diseases: [],
    selectedOrganism: 0,
    organisms: require("../../../../data/organisms.json"),
    isSearching: false
};

export default function search(state = initialState, action) {
    switch (action.type) {
        case SEARCH_TERM:
            console.debug("Search Term called");
            return { ...state, term: action.term };
        case SEARCH_SENT:
            console.debug("Search sent");
            return { ...state, isSearching: true };
        case RECEIVED_RESULTS:
            console.debug("Received results");
            return {
                ...state,
                isSearching: false,
                genes: action.genes,
                diseases: action.diseases,
                term: action.term
            };
        case SET_ORGANISM_FILTER:
            console.debug("set org fired.");
            console.debug(action);
            return { ...state, selectedOrganism: action.taxid };
        default:
            return state;
    }
}

