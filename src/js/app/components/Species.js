import React from 'react';
import Input from 'react-bootstrap/lib/Input';

export class Species extends React.Component {

    handleChange() {
        //this.setState( { species: this.refs.species.getValue() });
        console.debug("Org
    }

    render() {
        return (
            <Input onChange={this.handleChange.bind(this)} ref="species" type="select" name="species" label="Species" placeholder="select">
                <option value="dmel">Fruit Fly (D. melanogaster)</option>
                <option value="hsap">Humans (H. sapiens)</option>
            </Input>
        );
    }
}

//Species.propTypes = { selected: React.PropTypes.string };
