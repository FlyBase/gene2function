import React, {Component} from 'react';
import GeneResult from './GeneResult';
import DiseaseResult from './DiseaseResult';

export default class SearchResult extends Component {
    render() {
        const {
            term,
            diseases,
            genes,
            organisms,
            selectedOrganism,
            setOrganismFilter,
            fetchOrtholog
        } = this.props;

        if (diseases.length == 0 && genes.length == 0) {
            return null;
        }
        else {
            return (
                <div>
                    <h3>Search results for <mark>{term}</mark></h3>
                    <p className="text-right"><b>{diseases.length} disease(s) and {genes.length} gene(s)</b></p>

                    <DiseaseResult diseases={diseases} fetchOrtholog={fetchOrtholog} />
                    <GeneResult genes={genes}
                                organisms={organisms}
                                selectedOrganism={selectedOrganism}
                                setOrganismFilter={setOrganismFilter}
                                fetchOrtholog={fetchOrtholog} />
                </div>
            );
        }
        return null;
    }
}
