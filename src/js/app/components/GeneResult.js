import React from 'react';

export default class GeneResult extends React.Component {
    render() {
        const term = this.props.params.term;
        const results = [
            {
                "name": "Gene 1",
                "links": "Ensembl HGNC NCBI OMIM",
                "score": 10,
                "best_score": "Yes",
                "best_rev_score": "Yes",
                "align": "(+)",
                "source": "Compara, Inparanoid, OrthoDB, RoundUp"
            },
            {
                "name": "Gene 2",
                "links": "Ensembl HGNC NCBI OMIM",
                "score": 10,
                "best_score": "Yes",
                "best_rev_score": "Yes",
                "align": "(+)",
                "source": "Compara, Inparanoid, OrthoDB, RoundUp"
            },
            {
                "name": "Gene 3",
                "links": "Ensembl HGNC NCBI OMIM",
                "score": 10,
                "best_score": "Yes",
                "best_rev_score": "Yes",
                "align": "(+)",
                "source": "Compara, Inparanoid, OrthoDB, RoundUp"
            },
            {
                "name": "Gene 4",
                "links": "Ensembl HGNC NCBI OMIM",
                "score": 10,
                "best_score": "Yes",
                "best_rev_score": "Yes",
                "align": "(+)",
                "source": "Compara, Inparanoid, OrthoDB, RoundUp"
            }

        ];
        return (
            <div>
                <h3>Gene search sesults for <mark>{term}</mark></h3>
                <table className="table table-hover table-striped">
                    <thead>
                        <tr>
                            <th>Ortholog Gene</th>
                            <th>Ortholog Gene Reports</th>
                            <th>Score</th>
                            <th>Best Score</th>
                            <th>Best Rev Score</th>
                            <th>Align</th>
                            <th>Source</th>
                        </tr>
                    </thead>
                    <tbody>
                    {results.map(hit => {
                        return (
                            <tr key={hit.name}>
                                <td>{hit.name}</td>
                                <td>{hit.links}</td>
                                <td>{hit.score}</td>
                                <td>{hit.best_score}</td>
                                <td>{hit.best_rev_score}</td>
                                <td>{hit.align}</td>
                                <td>{hit.source}</td>
                            </tr>
                        );
                    })
                    }
                    </tbody>
                </table>
            </div>
        );
    }
}
