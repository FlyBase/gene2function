import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions';

import GeneResult from '../components/GeneResult';

function mapStateToProps(state) {
    console.debug("mapping state to props");
    return {
        
    };
}

function mapDispatchToProps(dispatch) {
    console.debug("Mapping dispatch to props");
    return {
    };
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GeneResult);
