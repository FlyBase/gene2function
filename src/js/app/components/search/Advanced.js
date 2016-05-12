import React, {Component, PropTypes} from 'react';
import { FormGroup, InputGroup, FormControl, ControlLabel, Button, Jumbotron } from 'react-bootstrap';
import { Icon } from 'react-fa';

import Organism from './Organism';

export default class Advanced extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const orgs = this.props.organisms;

        return (
            <div>
                <div className="row">
                    <div className="col-md-5">
                        <Jumbotron>
                            <h3>By Gene</h3>
                            <Organism id="geneOrg" list={orgs} />
                            <FormGroup controlId="byGene">
                                <ControlLabel>Gene</ControlLabel>
                                <FormControl componentClass="textarea" placeholder="Gene symbols, one per line" />
                            </FormGroup>
                        </Jumbotron>
                    </div>
                    <div className="col-md-2 text-center">
                        <h3>Or</h3>
                    </div>
                    <div className="col-md-5">
                        <Jumbotron>
                            <h3>By Disease</h3>
                            <Organism id="diseaseOrg" list={orgs} />
                            <FormGroup controlId="byDisease">
                                <ControlLabel>Disease</ControlLabel>
                                <FormControl componentClass="textarea" placeholder="Disease names or OMIM IDs" />
                            </FormGroup>
                        </Jumbotron>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 col-md-offset-3">
                       <Button type="submit" bsStyle="primary" bsSize="large" block>Search</Button> 
                    </div>
                </div>
            </div>
        );
    }
}

Advanced.propTypes = {
    organisms: PropTypes.arrayOf(PropTypes.object)
};
