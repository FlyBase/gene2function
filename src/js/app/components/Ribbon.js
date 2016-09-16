'use strict';

import 'babel-polyfill';

import React, {Component} from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';

/* constants */
// heatmap color constants
var heatLevels = 8;
var baseRGB = [0,96,96];        // [0,48,96] dark FB blue, [96,144,144] FB turquoise
//var topHue  = 240;

function TermList( key, termsArray ) {
    if( termsArray.length==0 ) return(<div></div>);

    let termListHTML = termsArray.map(
        function(term) {
            return(<li>{term.name}</li>);
        }
    );

    let ulStyle = {paddingLeft:5};
    let title = key+" terms";
    return(<Popover title={title}><ul style={ulStyle}>{termListHTML}</ul></Popover>);
};

/* React components */
export class Block extends Component {

    heatColor( heat ) {
        if( heat==0 ) return "#fff";    // return 'white' if heat==0 (which should never happen)
        var colorCSS;
        var c = [];     // [r,g,b]
        for( var i=0; i<3; i++ ) {
            // logarithmic heatmap (with cutoff)
            if( heat<heatLevels ) {
                var heatCoef = (256-baseRGB[i])*3/(heat+3);         // instead of just (256-baseRGB[i])/(Math.pow(2,heat)), which divides space from 'white' (255) down to target color level in halves, this starts at 3/4
                c[i] = Math.round(baseRGB[i]+heatCoef);
            }
            else c[i] = baseRGB[i];
            // linear heatmap
            // var heatInc = (topHue-baseRGB[i])/heatLevels;
            // var depression = heatInc*Math.min(heat,heatLevels);
            // c[i] = Math.round(topHue - depression);
        }
        colorCSS = 'rgb('+c[0]+','+c[1]+','+c[2]+')';
        return colorCSS;
    }

    render() {
        const { blockdata, showBlockTitles, blockkey } = this.props;
        var blockTitle = blockdata.name;
        var tileStrength = blockdata.terms.length;
        let termList = TermList( blockkey, blockdata.terms );
      //  console.debug(termList);
        var s = (tileStrength==1) ? '' : 's';
        var tileTitle = blockTitle+":\n"+tileStrength+" term"+s;
        var blockTitleClass = (tileStrength>0) ? 'ribbonBlockTitleTerm bold' : 'ribbonBlockTitleTerm';
        var blockTitleDiv = function(showBlockTitles) {
            if(showBlockTitles) { return(<div className={blockTitleClass}>{blockTitle}</div>) }
            else return null;
        }
        var color = (tileStrength) ? this.heatColor(tileStrength) : '';
        var rBlockStyle = { height: 'auto', width: '1.8em', paddingRight: '0.4em' };            // this works for 'ministrip'
        return(
            <div className="ribbonBlock" style={rBlockStyle}>
              {blockTitleDiv}
              <OverlayTrigger trigger="click" placement="left" overlay={termList}>
                <div className="ribbonTile" title={tileTitle} style={{backgroundColor:color}}></div>
              </OverlayTrigger>
            </div>
        );
    }
};

export default class Strip extends Component {

    constructor(props) {
        super(props);
    }

    getInitialState() {
        return {
            data: {}
        };
    }

    componentWillMount() {
        // This url will depend on the source.  Other services will be created to handle non-GO ribbons.
        var url = "/api/ribbon/"+this.props.source+"/"+this.props.domain+"/"+this.props.FBgn;
        console.log(url);
        $.get(
            url,
            function( annData ) {
                this.setState({ data: annData });
            }.bind(this)
        );
    }

    render() {
        var annData = this.state.data;
        if( !annData.hasOwnProperty('resultset') ) return( <div></div> );
       // console.log(this.state.data.resultset.result[0].ribbon);
        var ribbon  = annData.resultset.result[0].ribbon;  // hash of GO_id: { count: #, terms: [], name: '' } objects
        var ribbonkeys  = Object.keys(ribbon);
        // sort the ribbonKeys?
        var StripOfBlocks = ribbonkeys.map(
            function( termID ) {
                if( ribbon.hasOwnProperty(termID) ) {
                    return(<Block blockdata={ribbon[termID]} showBlockTitles={true} key={termID} />);
                }
            }
        );
        return(
          <div className="ribbonStrip">
            <div className="blockBacker">
              {StripOfBlocks}
            </div>
            <div className="stripTitle">{this.props.domain.replace(/_/g,' ')}</div>
          </div>
        );
    }

};

export class MiniStrip extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { ribbondata } = this.props;
        var ribbonkeys = Object.keys( ribbondata );
        var StripOfBlocks = ribbonkeys.map(
            function( ID ) {
                if( ribbondata.hasOwnProperty(ID) ) {
                    return(<Block blockdata={ribbondata[ID]} showBlockTitles={false} key={ID} />);
                }
            }
        );
        return(
          <div className="ribbonStrip" style={{margin:0}}>
            <div className="blockBacker">
              {StripOfBlocks}
            </div>
          </div>
        );
    }

};
