import React from 'react';
import {connect} from 'react-redux';

class HomePage extends React.Component {
    render() {
        return (
            <div data-testid="homepage">
                <div className="row">
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loggedInUser: state
    };
};

export default connect(mapStateToProps)(HomePage);
