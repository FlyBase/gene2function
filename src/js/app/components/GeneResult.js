import React, { Component } from 'react';
import { browserHistory as history } from 'react-router';

import GeneFilter from './GeneFilter';

export default class GeneResult extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    getOrganism(taxid) {
        for (let org of this.props.organisms) {
            if (org.id == taxid) {
                return org;
            }
        }
        return null;
    }

    handleClick(e, gene) {
        e.preventDefault();
        history.push('/ortholog/' + gene.taxid + '/' + gene.symbol);
        this.props.fetchOrtholog(gene.symbol, gene.taxid);
    }

    render() {
        const { genes, organisms, selectedOrganism, setOrganismFilter, fetchOrtholog } = this.props;
        if (genes.length == 0) { return null; }
        return (
            <div className="panel panel-success">
                <div className="panel-body">
                    <div className="row">
                        <div className="col-sm-4">
                            <GeneFilter organisms={organisms} selected={selectedOrganism} setOrganismFilter={setOrganismFilter} genes={genes} />
                        </div>
                    </div>
                    <table className="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th>Symbol</th>
                                <th>Full Name</th>
                                <th>Organism</th>
                                <th>LinkOuts</th>
                            </tr>
                        </thead>
                        <tbody>
                        {genes.map(hit => {
                            const source = hit._source;
                            const org = this.getOrganism(source.taxid);
                            const fullname = (source.fullname == "-") ? source.symbol : source.fullname;
                            return (
                                <tr key={source.id}>
                                    <td><a href="#" onClick={(e) => {this.handleClick(e,source) }}>{source.symbol}</a></td>
                                    <td>{fullname}</td>
                                    <td><em>{org.genus} {org.species}</em></td>
                                    <td><a className="btn btn-default" role="button" href={'https://www.ncbi.nlm.nih.gov/gene/' + source.id}>NCBI</a></td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
