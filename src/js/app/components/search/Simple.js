import React, {Component, PropTypes} from 'react';
import { browserHistory } from 'react-router';
import { FormGroup, InputGroup, FormControl, ControlLabel, Jumbotron } from 'react-bootstrap';
import { Icon } from 'react-fa';


export default class Simple extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleFocus  = this.handleFocus.bind(this);
    }

    handleChange(e) {
        if (e.target.value.length > 0) {
            this.props.onChange(e.target.value);
        }
    }

    handleFocus() {
        console.debug("handlFocus called");
        browserHistory.push('/');
    }

    render() {
        return (
            <Jumbotron>
                <FormGroup>
                    <ControlLabel>Enter Gene Symbol or Disease name</ControlLabel>
                    <InputGroup bsSize="large">
                        <InputGroup.Addon>
                            <i className="fa fa-search"></i>
                        </InputGroup.Addon>
                        <FormControl
                            type="text" 
                            placeholder="Breast cancer, Parkinson's, ADH4, PARK2, ..."
                            onChange={this.handleChange}
                            onFocus={this.handleFocus}
                        />
                    </InputGroup>
                </FormGroup>
            </Jumbotron>
        );
    }
}
