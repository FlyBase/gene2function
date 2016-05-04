import React, {Component} from 'react';

export default class OrthologResult extends Component {
    constructor(props) {
        super(props);
    }

    renderLinkouts(linkouts) {
        if (linkouts) {
            return (
                <ul className="list-inline">
                    {linkouts.map(l => {
                        if (!l.startsWith("OMIM") && !l.startsWith("Ensembl_")) {
                            return (
                                <li key={l}>{l}</li>
                            );
                        }
                    })}
                </ul>
            );
        }
        return null;
    }

    renderSource(source) {
        if (source) {
            return (
                <ul className="list-inline">
                    {source.map(s => {
                        return (
                            <li key={s}>{s}</li>
                        );
                    })}
                </ul>
            );
        }
        return null;
    }
    render() {
        console.debug("Rendering orthologs");
        const { gene, taxid } = this.props.params;
        const { orthologs } = this.props;
        const species = (orthologs[0]) ? orthologs[0].query_species : '';
        let i = 0;
        let ts = "";
        return (
            <div>
                <h4>Orthologs of the gene <mark>{gene}</mark> in <em>{species}</em></h4>
                <table className="table table-hover table-striped">
                    <thead>
                        <tr>
                            <th>Ortholog Gene</th>
                            <th>LinkOuts</th>
                            <th>Score</th>
                            <th>Best Score</th>
                            <th>Best Reverse Score</th>
                            <th>Species</th>
                            <th>Source</th>
                        </tr>
                    </thead>
                    <tbody>
                    {orthologs.map(x => {
                        i++;
                        return (
                            <tr key={i}>
                                <td>{x.ortholog_gene}</td>
                                <td>{this.renderLinkouts(x.ortholog_gene_reports)}</td>
                                <td>{x.score}</td>
                                <td>{x.best_score}</td>
                                <td>{x.best_reverse_score}</td>
                                <td>{x.target_species}</td>
                                <td>{this.renderSource(x.source)}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
}
