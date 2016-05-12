import React, {Component} from 'react';
import GeneResult from './GeneResult';
import DiseaseResult from './DiseaseResult';
import {classNames as cx} from 'classnames';

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

                    <ul className="nav nav-tabs" role="tablist">
                        <li role="presentation" className="active">
                            <a href="#genes" aria-controls="genes" role="tab" data-toggle="tab">Genes ({genes.length})</a>
                        </li>
                        <li role="presentation">
                            <a href="#diseases" aria-controls="diseases" role="tab" data-toggle="tab">Diseases ({diseases.length})</a>
                        </li>
                    </ul>

                    <div className="tab-content">
                        <div role="tabpanel" className="tab-pane active" id="genes">
                            <GeneResult genes={genes}
                                        organisms={organisms}
                                        selectedOrganism={selectedOrganism}
                                        setOrganismFilter={setOrganismFilter}
                                        fetchOrtholog={fetchOrtholog} />
                        </div>
                        <div role="tabpanel" className="tab-pane" id="diseases">
                            <DiseaseResult diseases={diseases} fetchOrtholog={fetchOrtholog} />
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }
}
