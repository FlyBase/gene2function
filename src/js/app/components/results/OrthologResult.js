import React, {Component} from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { Icon } from 'react-fa';
import Linkout from '../Linkout';
import { MiniStrip, Block } from '../Ribbon';
import './OrthologResult.css';
import '../ribbon.css';

const sourceTitles = ['Compara','HGNC','Homologene','Inparanoid','Isobase','OMA','OrthoDB','orthoMCL','Panther','Phylome','RoundUp','TreeFam','ZFIN'];

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

    renderSpecies(speciesTxt) {
        if( speciesTxt ) {
            // speciesTxt should look like "Species name (common name[, another common name])"
            var spTokens = speciesTxt.match(/(.*) \((.*)\)/);
            // spTokens[1] is scientific name, spTokens[2] is common name(s)
            var Gspc = spTokens[1].replace(/^(.).*\s/, "$1. ");
           // return(<span><i>{Gspc}</i> ({spTokens[2]})</span>);
            return(<i>{Gspc}</i>);
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

    sourceTitles() {
        let titles = [];
        for (let s of sourceTitles) {
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

    renderSource(sources) {
        let sourceChecks = [];
        if (sources) {
            for (let s of sourceTitles) {
                let styles = {
                    "paddingRight": "0.2em",
                    "paddingLeft": "0.2em"
                };

                if (sources.findIndex((el,i) => el.toUpperCase() === s.toUpperCase()) != -1) {
                    sourceChecks.push(<li key={s} style={styles}><Icon name="check-square-o" fixedWidth={true} /></li>);
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

    renderGO( GOobj ) {
        // GOobj: { C: { name:'Cellular Component', terms: [{},{},...], count: # }, P: {}, F: {} }
        return(<MiniStrip ribbondata={GOobj} />)
      //  return <div>{Object.keys(GOobj)}</div>;
    }

    renderPubs( publications ) {
        return (<span>{publications.length}</span>);
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
                                       dataField="ortholog_gene"
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
                                       width="50"
                                       dataFormat={this.renderCheck}
                                       caretRender={this.renderSortIndicator}
                                       dataSort={true}
                                       columnClassName={(c,r,ri,ci) =>  (c && c.toUpperCase() == 'YES') ? "success" : "" }>
                        <OverlayTrigger trigger="click" placement="top" overlay={<Popover id="best_score" title="Best Score">Indicates that the orthology call has the highest score when going from the query organism to the target organism.</Popover>}>
                            <a tabindex="0" className="btn" role="button" onClick={(e) => e.stopPropagation() } ><Icon name="info-circle" /></a>
                        </OverlayTrigger>
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="best_reverse_score"
                                       dataAlign="center"
                                       width="50"
                                       dataFormat={this.renderCheck}
                                       caretRender={this.renderSortIndicator}
                                       dataSort={true}
                                       columnClassName={(c,r,ri,ci) =>  (c && c.toUpperCase() == 'YES') ? "success" : "" }>
                        <OverlayTrigger trigger="click" placement="top" overlay={<Popover id="best_reverse_score" title="Best Score - Reverse Search">Indicates that the orthology call has the highest score when going from the target organism to the query organism.</Popover>}>
                            <a tabindex="0" className="btn" role="button" onClick={(e) => e.stopPropagation() } ><Icon name="info-circle" /></a>
                        </OverlayTrigger>
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="source"
                                       dataAlign="center"
                                       width="330"
                                       className="verticalTitlesTH"
                                       dataFormat={this.renderSource}
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
                            <OverlayTrigger trigger="click" placement="top" overlay={<Popover id="GO_terms" title="Gene Ontology">Color intensity indicates number of curated terms. Hover/tap to display exact number.</Popover>}>
                                <a tabindex="0" className="btn" role="button" onClick={(e) => e.stopPropagation() } ><Icon name="info-circle" /></a>
                            </OverlayTrigger>
                        </p>
                        {this.GOtitles()}
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="publications_number"
                                       caretRender={this.renderSortIndicator}
                                       dataSort={true}
                                       dataAlign="center"
                                       width="100">
                        Publications
                    </TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
}
