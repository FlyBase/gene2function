import React from 'react';
import { browserHistory } from 'react-router';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Gene from '../components/Gene';
import Disease from '../components/Disease';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleGeneSearch = this.handleGeneSearch.bind(this);
        this.handleDiseaseSearch = this.handleDiseaseSearch.bind(this);
    }

    handleGeneSearch(event) {
        console.debug("Gene search submit clicked");
        event.preventDefault();
        this.props.actions.searchGene();
        browserHistory.push("/search/organism/" + this.props.gene.selectedOrganism + "/gene/" + this.props.gene.term);
    }

    handleDiseaseSearch(event) {
        console.debug("Disease search submit clicked");
        event.preventDefault();
        this.props.actions.searchDisease();
        browserHistory.push("/search/disease/" + this.props.disease.term);
    }

    render() {
        console.debug("App.render() called");
        console.debug(this.props.gene);

        const { gene, actions } = this.props;

        return (
            <div>
                <Header />
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2>Ortholog Search</h2>
                            <p>To find orthologs, search by gene symbol or disease name.</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-5">
                            <Gene current={gene} actions={actions} geneSearch={this.handleGeneSearch} />
                        </div>
                        <div className="col-md-2">
                            <h2 className="text-center">Or</h2>
                        </div>
                        <div className="col-md-5">
                            <Disease actions={actions} diseaseSearch={this.handleDiseaseSearch} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            {this.props.children}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

}

App.propTypes = {
    gene: React.PropTypes.object.isRequired,
    disease: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
};
//App.defaultProps = { organism: "dmel", term: "" };
