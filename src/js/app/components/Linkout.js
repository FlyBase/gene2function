import React, {Component} from 'react';

const linkoutConf = require("../../../../conf/linkouts.json");

export default class Linkout extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (/^\w+:\w+/.test(this.props.id)) {
            const [db, ...remainder] = this.props.id.split(':');
            const id = remainder.join(':');
            const conf = linkoutConf[db.toUpperCase()];

            if (conf) {
                const url = conf.url + id + conf.urlsuffix;
                return (<a href={url}>{conf.label}</a>);
            }
        }

        return <span>{this.props.id}</span>
    }
}


Linkout.propTypes = {
    id: React.PropTypes.string.isRequired
};
