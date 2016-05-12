import React, {Component, PropTypes} from 'react';

import GeneInput from './GeneInput';
import Organism from './Organism';
import { FormGroup, ButtonInput, InputGroup, FormControl, ControlLabel } from 'react-bootstrap';

export default class Gene extends Component {
    render() {
        return (
            <div>
                <h3>By gene</h3>
                <form onSubmit={this.props.geneSearch}>
                {//<Organism selected={this.props.current.selectedOrganism} list={this.props.current.organisms} {...this.props.actions} />//}
                    <GeneInput {...this.props.actions} /> 
                    <ButtonInput type="submit" value="Search" bsSize="large" />
                </form>
            </div>
        );
    }
}

Gene.propTypes = {


};
