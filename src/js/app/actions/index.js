import fetch from 'isomorphic-fetch'
import { push } from 'react-router-redux'

export const SEARCH_TERM = 'SEARCH_TERM';
export function searchTerm(term) {
    return dispatch => {
        dispatch(searchSent(term));
        return fetch('/api/search/' + term)
            .then(response => response.json())
            .then(json => dispatch(receivedResults(term, json)));
    };
}

export const SEARCH_SENT = 'SEARCH_SENT';
export function searchSent(term) {
  return { type: SEARCH_SENT, term };
}

export const RECEIVED_RESULTS = 'RECEIVED_RESULTS';
export function receivedResults(term, json) {
    console.debug("in receivedResults()");
    const genes = [];
    const diseases = [];

    for (const hit of json.hits.hits) {
        if (hit._index == "gene" && hit._type == "symbol") {
            genes.push(hit);
        }
        else if (hit._index == "ontology" && hit._type == 'do') {
            diseases.push(hit);
        }
    }
    return {
        type: RECEIVED_RESULTS,
        term,
        genes: genes,
        diseases: diseases
    };
}


export const FETCH_ORTHOLOG = 'FETCH_ORTHOLOG';
export function fetchOrtholog(gene, taxid) {
    return dispatch => {
        const url = '/ortholog/' + taxid + '/' + gene;
        dispatch(orthologSent(gene, taxid));
        dispatch(push(url));
        return fetch('/api/ortholog/' + taxid + '/' + gene)
            .then(response => response.json())
            .then(json => dispatch(receivedOrtholog(gene, taxid, json)));
    };
}

export const ORTHOLOG_SENT = 'ORTHOLOG_SENT';
export function orthologSent(gene, taxid) {
    return { type: ORTHOLOG_SENT, gene, taxid };
}

export const RECEIVED_ORTHOLOG = 'RECEIVED_ORTHOLOG';
export function receivedOrtholog(gene, taxid, json) {
    console.debug("in receivedOrtholog()");

    return {
        type: RECEIVED_ORTHOLOG,
        orthologs: json,
        gene: gene,
        taxid: taxid
    };
}

export const SET_ORGANISM_FILTER = 'SET_ORGANISM_FILTER';
export function setOrganismFilter(taxid) {
    return { type: SET_ORGANISM_FILTER, taxid };
}


