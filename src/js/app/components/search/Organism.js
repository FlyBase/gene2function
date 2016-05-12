import React, {Component, PropTypes} from 'react';
import { FormGroup, InputGroup, FormControl, ControlLabel } from 'react-bootstrap';

export default class Organism extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { selected, id } = { ...this.props };

        return (
            <FormGroup controlId={id}>
                <ControlLabel>Species</ControlLabel>
                <FormControl componentClass="select" placeholder="select" value={selected}>
                    {this.props.list.map(org => {
                        return <option key={org.id} value={org.id}>{org.common} ({org.genus.substring(0,1)}. {org.species})</option>
                      })
                    }
                </FormControl>
            </FormGroup>
        );
    }
}

Organism.propTypes = {
    id: PropTypes.string,
    selected: PropTypes.number,
    list: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            genus: PropTypes.string,
            species: PropTypes.string,
            common: PropTypes.string
        })).isRequired
};

Organism.defaultProps = {
    selected : 9606
};
