import * as types from '../constants/ActionTypes';

export function searchGene() {
    return { type: types.SEARCH_GENE };
}

export function setOrganism(organism) {
    return { type: types.SET_ORGANISM, organism };
}

export function setGene(gene) {
    return { type: types.SET_GENE, gene };
}

export function setDisease(disease) {
    return { type: types.SET_DISEASE, disease };
}

export function searchDisease() {
    return { type: types.SEARCH_DISEASE };
}
