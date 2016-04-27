import React from 'react';
import { Link } from 'react-router';

export default class DiseaseResult extends React.Component {
    render() {
        const disease = this.props.params.term;
        const results = [
            {
                "name": "Gene 1",
                "other": "Something else here"
            },
            {
                "name": "Gene 2",
                "other": "Something else here"
            },
            {
                "name": "Gene 3",
                "other": "Something else here"
            },
            {
                "name": "Gene 4",
                "other": "Something else here"
            }

        ];
        return (
            <div>
                <h3>Genes matched for the disease <mark>{disease}</mark></h3>
                <p>Click the gene name to see a list of orthologs for that gene</p>
                <table className="table table-hover table-striped">
                    <thead>
                        <tr>
                            <th>Disease Gene</th>
                            <th>Other...</th>
                        </tr>
                    </thead>
                    <tbody>
                    {results.map(hit => {
                        const url = "/search/organism/9606/gene/" + hit.name;
                        return (
                            <tr key={hit.name}>
                                <td><Link to={url}>{hit.name}</Link></td>
                                <td>{hit.Other}</td>
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
