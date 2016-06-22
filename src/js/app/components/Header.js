import React from 'react';

export default class Header extends React.Component {
render() {
    return (
        <div className="container">
            <div className="page-header">
                <h1>G<small>ene</small>2F<small>unction</small></h1>
            </div>
            <div className="row">
                 <div className="col-xs-offset-2 col-xs-1">
                    <img className="img-responsive" src="/images/budding-yeast.png" />
                 </div>
                 <div className="col-xs-1">
                    <img className="img-responsive" src="/images/fission-yeast.png" />
                 </div>
                 <div className="col-xs-1">
                    <img className="img-responsive" src="/images/worm.png" />
                 </div>
                 <div className="col-xs-1">
                    <img className="img-responsive" src="/images/fly.png" />
                 </div>
                 <div className="col-xs-1">
                    <img className="img-responsive" src="/images/fish.png" />
                 </div>
                 <div className="col-xs-1">
                    <img className="img-responsive" src="/images/frog.png" />
                 </div>
                 <div className="col-xs-1">
                    <img className="img-responsive" src="/images/mouse.png" />
                 </div>
                 <div className="col-xs-1">
                    <img className="img-responsive" src="/images/human.png" />
                 </div>
            </div>
        </div>
    );
}
}
