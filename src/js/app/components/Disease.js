import React from 'react';

import Input from 'react-bootstrap/lib/Input';
import ButtonInput from 'react-bootstrap/lib/ButtonInput';

export default class Disease extends React.Component {
    render() {
        return (
            <div className="jumbotron">
                <h3>By disease</h3>
                <form onSubmit={this.props.diseaseSearch}>
                    <Input
                        type="text"
                        placeholder="Parkinsons..."
                        label="Disease name"
                        help=""
                        hasFeedback
                        ref="term"
                        onChange={ e => { this.props.actions.setDisease(e.target.value) }}

                         />
                    <ButtonInput type="submit" value="Search" bsSize="large" />
                </form>
            </div>
        );
    }
}
