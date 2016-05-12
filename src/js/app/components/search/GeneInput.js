import React from 'react';
import Input from 'react-bootstrap/lib/Input';

export default class GeneInput extends React.Component {

    handleChange(term) {
        console.debug("Gene input entered..." + term);
        this.props.setGene(term);
    }

    render() {
        return (
            <Input
                type="text"
                placeholder="ADH"
                label="Gene symbol"
                help=""
                hasFeedback
                ref="term"
                onChange={(e) => { this.handleChange(e.target.value) }} />
        );
    }
}

//GeneInput.propTypes = { value: React.PropTypes.string };
