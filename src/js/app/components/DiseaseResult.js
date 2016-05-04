import React, { Component } from 'react';

export default class DiseaseResult extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e, gene, taxid) {
        e.preventDefault();
        console.debug("Gene clicked" + gene + " " + taxid);
        this.props.fetchOrtholog(gene,taxid);
    }

    render() {
        const diseases = this.props.diseases;
        if (diseases.length == 0) { return null; }
        return (
            <div className="panel panel-info">
                <div className="panel-heading">Diseases</div>
                <div className="panel-body">
                    <table className="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th className="col-sm-2">Name</th>
                                <th className="col-sm-5">Definition</th>
                                <th className="col-sm-5">
                                    Associated Human Genes
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        {diseases.map(hit => {
                            const source = hit._source;
                            return (
                                <tr key={source.id}>
                                    <td className="col-sm-2">
                                        <a href={'http://www.disease-ontology.org/?id=' + source.id}>
                                            {source.name}
                                        </a>
                                    </td>
                                    <td className="col-sm-5">{source.definition}</td>
                                    <td className="col-sm-5">
                                        <ul className="list-inline">
                                        {source.genes.map(gene => {
                                            return (
                                                <li key={gene}><a href="#" onClick={(e) => {this.handleClick(e, gene, 9606)}}>{gene}</a></li>
                                            );
                                        })}
                                        </ul>
                                    </td>
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
