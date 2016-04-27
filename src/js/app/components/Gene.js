import React from 'react';

import GeneInput from './GeneInput';
import Organism from './Organism';
import ButtonInput from 'react-bootstrap/lib/ButtonInput';

export default class Gene extends React.Component {
    render() {
        return (
            <div className="jumbotron">
                <h3>By gene</h3>
                <form onSubmit={this.props.geneSearch}>
                    <Organism selected={this.props.current.selectedOrganism} list={this.props.current.organisms} {...this.props.actions} />
                    <GeneInput {...this.props.actions} /> 
                    <ButtonInput type="submit" value="Search" bsSize="large" />
                </form>
            </div>
        );
    }
}

