import React from 'react';
import {connect} from 'react-redux';
import * as apiCalls from "../api/apiCalls";
import {boolInfo} from "../utils/utils";
import {Link} from "react-router-dom";

class HomePage extends React.Component {

    state = {
        page: {
            content: [],
            number: 0,
            size: 100
        }
    };

    componentDidMount() {
        this.loadNotes();
    }

    loadNotes = (requestedPage = 0) => {
        apiCalls
            .listNotes({page: requestedPage, size: this.state.page.size})
            .then((response) => {
                this.setState({
                    page: response.data,
                    loadError: undefined
                });
            })
            .catch((error) => {
                this.setState({loadError: 'Notes load failed'});
            });
    };

    render() {
        return (
            <div className="container" style={{marginTop: "30px"}}>
                <table className="table">
                    <thead className="thead-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Importance Level</th>
                        <th scope="col">Title</th>
                        <th scope="col">Category</th>
                        <th scope="col">Read</th>
                        <th scope="col">#</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.page.content.map((note) =>
                        <tr key={note.id}>
                            <th scope="row">#</th>
                            <td>{note.importanceLevel}</td>
                            <td>{note.title}</td>
                            <td>{note.category}</td>
                            <td>{boolInfo(note.read)}</td>
                            <td><Link to={`/notes/${note.id}`}><span
                                className="fa fa-eye"></span></Link></td>
                        </tr>
                    )}
                    </tbody>
                </table>
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
