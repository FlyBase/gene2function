import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

export default class GeneFilter extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        console.debug("Specied toggled.");
        this.props.setOrganismFilter(e.target.value);
    }

    render() {
        const { organisms, selected, genes } = this.props;

        const taxids = new Set(genes.map(gene => gene._source.taxid));

        return (
            <FormGroup controlId="speciesSelect">
                <ControlLabel>Filter by species</ControlLabel>
                <FormControl componentClass="select" value={selected} onChange={this.handleChange}>
                    <option key="0" value="0">All</option>
                    {organisms.map(org => {
                        const disabled = !taxids.has(org.id + "");
                        return (
                            <option disabled={disabled} key={org.id} value={org.id}>{org.genus} {org.species} ({org.common})</option>
                        );
                    })}
                </FormControl>
            </FormGroup>
        );
    }
}
