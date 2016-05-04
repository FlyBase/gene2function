import { FETCH_ORTHOLOG, ORTHOLOG_SENT, RECEIVED_ORTHOLOG  } from '../actions';

const initialState = {
    orthologs: [],
    gene: '',
    taxid: 0,
    fetchingOrthologs: false
};

export default function orthologs(state = initialState, action) {
    switch (action.type) {
        case FETCH_ORTHOLOG:
            console.debug("Fetch ortholog called");
            return { ...state, gene: action.gene, taxid: action.taxid  };
        case ORTHOLOG_SENT:
            console.debug("ORTHOLOG sent");
            return { ...state, fetchingOrthologs: true };
        case RECEIVED_ORTHOLOG:
            console.debug("Received ortholog results");
            return {
                ...state,
                fetchingOrthologs: false,
                gene: action.gene,
                taxid: action.taxid,
                orthologs: action.orthologs
            };
        default:
            return state;
    }
}

