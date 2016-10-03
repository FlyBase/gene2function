import React, {Component} from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { Icon } from 'react-fa';
import Linkout from '../Linkout';
import { MiniStrip, Block } from '../Ribbon';
import './OrthologResult.css';
import '../ribbon.css';

const sourceTitles = ['Compara','HGNC','Homologene','Inparanoid','Isobase','OMA','OrthoDB','orthoMCL','Panther','Phylome','RoundUp','TreeFam','ZFIN'];
// matrix of excluded species for each source
const sourceNAs = {
      'Compara': ['Spom'],
      'HGNC': ['Cele', 'Drer', 'Dmel', 'Scer', 'Spom', 'Xtro', 'Rnor'],
      'Homologene': [],
      'Inparanoid': [],
      'Isobase': ['Drer', 'Spom', 'Xtro', 'Rnor'],
      'OMA': [],
      'OrthoDB': ['Cele'],
      'orthoMCL': ['Xtro'],
      'Panther': [],
      'Phylome': [],
      'RoundUp': ['Rnor'],
      'TreeFam': [],
      'ZFIN': ['Cele', 'Scer', 'Spom', 'Xtro', 'Rnor']
};

const speciesNAs = {
      'Hsap': [],
      'Rnor': ['HGNC','Isobase','RoundUp','ZFIN'],
      'Mmus': [],
      'Xtro': ['HGNC','Isobase','orthoMCL','ZFIN'],
      'Drer': ['HGNC','Isobase'],
      'Dmel': ['HGNC'],
      'Cele': ['HGNC','OrthoDB','ZFIN'],
      'Spom': ['Compara','HGNC','Isobase','ZFIN'],
      'Scer': ['HGNC','ZFIN'],
};

export default class OrthologResult extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.debug("orthologs mounted");
        const { gene, taxid } = this.props.params;
        //If we got here via a page refresh, reload the orthologs.
        if (this.props.orthologs && this.props.orthologs.length == 0) {
            this.props.fetchOrtholog(gene,taxid);
        }
    }

    miniReport(row) {
        console.log('[miniReport]');

            console.log(row);

    }

    renderID( reports ) {
        return(<span>{reports[0]}</span>)
    }

    parseSpecies(speciesTxt) {
        return speciesTxt;
    }

    renderSpecies(speciesTxt) {
        if( speciesTxt ) {
            // speciesTxt should look like "Species name (common name[, another common name])"
            var spTokens = speciesTxt.match(/(.*) \((.*)\)/);
            // spTokens[1] is scientific name, spTokens[2] is common name(s)
            var G_sp = spTokens[1].replace(/^(.).*\s/, "$1. ");
            return(<i>{G_sp}</i>);
        }
        return null;
    }

    renderLinkouts(linkouts) {
        if (linkouts) {
            return (
                <ul className="list-inline">
                    {linkouts.map(l => {
                        if (!l.startsWith("OMIM") && !l.startsWith("Ensembl_")) {
                            return (
                                <li key={l}>
                                    <Linkout id={l} />
                                </li>
                            );
                        }
                    })}
                </ul>
            );
        }
        return null;
    }

    bestScoreTitle() {
        return(<div className="rotated-text"><span className="rotated-text-inner">Best Score</span></div>);
    }

    bestReverseTitle() {
        return(<div className="rotated-text"><span className="rotated-text-inner">Best Reverse</span></div>);
    }

    sourceTitles() {
        let titles = [];
        for (let s of sourceTitles) {
          // should be able to grey out inapplicable source titles - where to get query species from here?
          //  let style = ( speciesNAs[qsp].indexOf(s) >= 0 ) ? {color:'grey'} : {};
            titles.push(<div className="rotated-text" key={s}><span className="rotated-text-inner">{s}</span></div>);
        }
        return titles;
    }

    GOtitles() {
        let titles = [];
        for( let g of ['Mol Func','Cell Comp','Biol Proc'] ) {
            titles.push(<div className="rotated-text" key={g}><span className="rotated-text-inner">{g}</span></div>);
        }
        return titles;
    }

    pubHeaderTitle() {
        return(<div className="rotated-text"><span className="rotated-text-inner">Publications</span></div>);
    }

    renderSource(sources,row) {
        var qsp = row.query_species_abbreviation;
        var tsp = row.target_species_abbreviation;
        let sourceChecks = [];
        if (sources) {
            for (let s of sourceTitles) {
                let styles = {
                    "paddingRight": "0.2em",
                    "paddingLeft": "0.2em"
                };
                // filter out sources which don't make calls for the query species
                console.log("speciesNAs["+qsp+"].indexOf("+s+") is "+speciesNAs[qsp].indexOf(s));
                if( speciesNAs[qsp].indexOf(s) >= 0 ) {
                    sourceChecks.push(<li key={s} style={styles}><Icon name="ban-circle" fixedWidth={true} /></li>);
                    continue;
                }
         //   console.debug('looking for '+tsp+' in sourceNAs for '+s+': '+sourceNAs[s]);
                if(sources.findIndex((el,i) => el.toUpperCase() === s.toUpperCase()) != -1) {
                    sourceChecks.push(<li key={s} style={styles}><Icon name="check-square-o" fixedWidth={true} /></li>);
                }
                else if( sourceNAs[s].indexOf(tsp) >= 0 ) {
                    sourceChecks.push(<li key={s} style={styles}><Icon name="ban-circle" fixedWidth={true} /></li>);
                }
                else {
                    sourceChecks.push(<li key={s} style={styles}><Icon name="square-o" fixedWidth={true} /></li>);
                }

            }

            return (<ul style={{ marginLeft: "-20px" }}className="list-inline">{sourceChecks}</ul>);

        }
        return null;
    }

    renderCheck(val) {
        if (val && val.toUpperCase() == 'YES') {
            return <Icon name="check" />;
        }
        return null;
    }

    GOterms() {
    }

    renderGO( GOobj ) {
        // filtering for 'experimental evidence codes' [http://geneontology.org/page/guide-go-evidence-codes]: EXP IPI IDA IGI IMP IEP
        if( GOobj ) {
            var rxp = /EXP|IPI|IDA|IGI|IMP|IEP/i;
            for( let b of ['C','F','P'] ) {     // loop over top-level GO branch sub-objects (Cellular Component C, Molecular Function F, Biological Process P)
                var GObranch = GOobj[b];
                var newTermsArray = [];
                for( let t=0; t<GObranch.terms.length; t++ ) {
                    let termObj = GObranch.terms[t];
                    if( rxp.test(termObj.evidence_code) ) {
                        newTermsArray.push(termObj);
                    }
                }
                GOobj[b].terms = newTermsArray;         // comment just this line to 'turn off' filtering
            }
        }
        return(<MiniStrip ribbondata={GOobj} />)
    }

    renderPubs( publications ) {
        return (<span>{publications.length}</span>);
    }

    score() {
    }

    sortByScore(a, b, order, field, score) {
        if (order === 'desc') {
            if (a.score > b.score) {
                return -1;
            }
            else if (a.score < b.score) {
                return 1;
            }
            return 0;
        }

        if (a.score < b.score) {
            return -1;
        }
        else if (a.score > b.score) {
            return 1;
        }
        return 0;
    }

    renderSortIndicator(order) {
        let icon = <Icon name="sort" className="text-muted" />;

        if (order === 'desc') {
             icon = <Icon name="sort-desc" />;
        }
        else if (order === 'asc') {
            icon = <Icon name="sort-asc" />;
        }
        return (
            <div className="pull-right">
                {icon}
            </div>
        );
    }

    render() {
        console.debug("Rendering orthologs");
        const { gene, taxid } = this.props.params;
        const { orthologs } = this.props;
        const species = (orthologs[0]) ? orthologs[0].query_species : '';

        var tableOptionsObj = { onRowClick: this.miniReport };

        console.debug(orthologs);

        // if 'onClick={this.miniReport}' is added to the top-level div, the miniReport function fires (but gets no row information)
        return (
            <div>
                <h4>Orthologs of the <em>{species}</em> gene <mark>{gene}</mark></h4>
                <BootstrapTable striped={true} hover={true} data={orthologs} options={tableOptionsObj}>
                    <TableHeaderColumn isKey={true}
                                       dataField="ortholog_gene_reports"
                                       dataFormat={this.renderID}
                                       hidden={true}>
                        ID
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="ortholog_gene"
                                       dataSort={true}
                                       width="100"
                                       caretRender={this.renderSortIndicator}>
                        Gene
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="target_species"
                                       caretRender={this.renderSortIndicator}
                                       dataSort={true}
                                       dataFormat={this.renderSpecies}
                                       width="120">
                        Organism
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="ortholog_gene_reports"
                                       dataFormat={this.renderLinkouts}>
                        Linkouts
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="best_score"
                                       dataAlign="center"
                                       className="verticalTitlesTH"
                                       width="50"
                                       dataFormat={this.renderCheck}
                                       caretRender={this.renderSortIndicator}
                                       dataSort={true}
                                       columnClassName={(c,r,ri,ci) =>  (c && c.toUpperCase() == 'YES') ? "success" : "" }>
                        <OverlayTrigger trigger="click" placement="top" rootClose={true} overlay={<Popover id="best_score" title="Best Score">Indicates that the orthology call has the highest score when going from the query organism to the target organism.</Popover>}>
                            <a tabindex="0" className="btn" role="button" onClick={(e) => e.stopPropagation() } ><Icon name="info-circle" /></a>
                        </OverlayTrigger>
                        <br />
                        {this.bestScoreTitle()}
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="best_reverse_score"
                                       dataAlign="center"
                                       width="50"
                                       className="verticalTitlesTH"
                                       dataFormat={this.renderCheck}
                                       caretRender={this.renderSortIndicator}
                                       dataSort={true}
                                       columnClassName={(c,r,ri,ci) =>  (c && c.toUpperCase() == 'YES') ? "success" : "" }>
                        <OverlayTrigger trigger="click" placement="top" rootClose={true} overlay={<Popover id="best_reverse_score" title="Best Score - Reverse Search">Indicates that the orthology call has the highest score when going from the target organism to the query organism.</Popover>}>
                            <a tabindex="0" className="btn" role="button" onClick={(e) => e.stopPropagation() } ><Icon name="info-circle" /></a>
                        </OverlayTrigger>
                        <br />
                        {this.bestReverseTitle()}
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="source"
                                       dataAlign="center"
                                       width="330"
                                       className="verticalTitlesTH"
                                       dataFormat={this.renderSource}
                                       formatExtraData="ortholog_gene_reports"
                                       caretRender={this.renderSortIndicator}
                                       dataSort={true}
                                       sortFunc={this.sortByScore}>
                        <p>Prediction Dervied From</p>
                        {this.sourceTitles()}
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="GO"
                                       dataAlign="center"
                                       className="verticalTitlesTH"
                                       dataFormat={this.renderGO}
                                       width="90">
                        <p>
                            GO
                            <OverlayTrigger trigger="click" placement="top" rootClose={true} overlay={<Popover id="GO_terms" title="Gene Ontology">Color intensity indicates number of terms curated with GO experimental evidence codes. Hover to display exact number. Click to see list.</Popover>}>
                                <a tabindex="0" className="btn" role="button" onClick={(e) => e.stopPropagation() } ><Icon name="info-circle" /></a>
                            </OverlayTrigger>
                        </p>
                        {this.GOtitles()}
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="publications_number"
                                       caretRender={this.renderSortIndicator}
                                       className="verticalTitlesTH"
                                       dataSort={true}
                                       dataAlign="center"
                                       width="60">
                        <p>&nbsp;</p>
                        {this.pubHeaderTitle()}
                    </TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
}
