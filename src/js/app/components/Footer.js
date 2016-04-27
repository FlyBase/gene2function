import React from 'react';

export default class Footer extends React.Component {
    render() {
        return (
            <div className="container">
                <p className="text-muted">
                    This site is brought to you by <a href="http://flybase.org">FlyBase</a> & the <a href="http://www.flyrnai.org">DRSC</a>
                </p>
            </div>
        );
    }
}
