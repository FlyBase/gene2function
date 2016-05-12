import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import { FormGroup, InputGroup, FormControl, ControlLabel } from 'react-bootstrap';

import Header from '../components/Header';
import Footer from '../components/Footer';

import SearchResult from '../components/SearchResult';

class App extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
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

    handleSubmit(e){
        e.preventDefault();
    }

    render() {
        console.debug("App.render() called");
        let diseases = [];
        let genes = [];

        for (let disease of this.props.diseases) {
            if (disease._source.gene_count > 0) { diseases.push(disease) };
        }

        for (let gene of this.props.genes) {
            if (this.props.selectedOrganism == 0 || gene._source.taxid == this.props.selectedOrganism) { genes.push(gene) };
        }

        let result;
        if (this.props.children != null) {
            result = React.cloneElement(this.props.children, {
                orthologs: this.props.orthologs,
                organisms: this.props.organisms,
                fetchOrtholog: this.props.fetchOrtholog
            });
        }
        else if (diseases.length == 0 && genes.length==0 && this.props.term.length > 0) {
            result = (<h3>No Results found.</h3>);
        }
        else {
            result = (
                <SearchResult term={this.props.term}
                    diseases={diseases}
                    genes={genes}
                    organisms={this.props.organisms}
                    selectedOrganism={this.props.selectedOrganism}
                    setOrganismFilter={this.props.setOrganismFilter} 
                    fetchOrtholog={this.props.fetchOrtholog} />
            );
        }

        return (
            <div>
                <Header />
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2>Ortholog Search</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="jumbotron">
                                <form onSubmit={this.handleSubmit}>
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

                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            {result}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

}

App.propTypes = {
};
//App.defaultProps = { organism: "dmel", term: "" };
function mapStateToProps(state, ownProps) {
    console.debug("mapping state to props");
    console.debug(state);
    return {
        ...state.search,
        ...state.orthologs
    };
}

function mapDispatchToProps(dispatch) {
    console.debug("Mapping dispatch to props");
    return {
        onChange: (term) => {
            console.debug("Firing searchTerm with " + term);
            dispatch(Actions.searchTerm(term));
        },
        setOrganismFilter: (taxid) => {
            console.debug("Firing setOrganismFilter with " + taxid);
            dispatch(Actions.setOrganismFilter(taxid));
        },
        fetchOrtholog: (gene, taxid) => {
            console.debug("Firing fetchOrthologs");
            dispatch(Actions.fetchOrtholog(gene, taxid));
        }
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
