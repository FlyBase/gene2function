import React from 'react';
import Input from 'react-bootstrap/lib/Input';

export default class Organism extends React.Component {

    handleChange(org) {
        //this.setState( { species: this.refs.species.getValue() });
        console.debug(org);
        this.props.setOrganism(org);
    }

    render() {
        const selected = this.props.selected;
        return (
            <Input onChange={e => { this.handleChange(e.target.value) }} value={selected} type="select" name="species" label="Species" placeholder="select">
            {this.props.list.map(org => {
                return <option key={org.id} value={org.id}>{org.common} ({org.genus.substring(0,1)}. {org.species})</option>
              })
            }
            </Input>
        );
    }
}

Organism.propTypes = {
    list: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            id: React.PropTypes.number,
            genus: React.PropTypes.string,
            species: React.PropTypes.string,
            common: React.PropTypes.string
})).isRequired
};
