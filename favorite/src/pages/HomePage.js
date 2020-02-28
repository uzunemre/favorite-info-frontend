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
        },
        randomNote: {},
    };

    componentDidMount() {
        this.loadNotes();
        this.loadRandomNote();
    }

    loadRandomNote() {
        apiCalls
            .getRandomNote()
            .then((response) => {
                console.log(response);
                this.setState({randomNote: response.data});
            })
            .catch((error) => {
                this.setState({randomNoteLoadError: 'Random Note load failed'});
            });
    }

    loadNotes = (requestedPage = 0) => {
        apiCalls
            .getNotes({page: requestedPage, size: this.state.page.size})
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
            <div className="container">
                <div className="card" style={{marginTop: "20px"}}>
                    <div className="card-header">
                        Random Note
                        <a onClick={() => this.loadRandomNote()} style={{float: "right"}} href="#"
                           className="btn btn-primary">Get</a>
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Importance Level:{this.state.randomNote.importanceLevel}</h5>
                        <p className="card-text">{this.state.randomNote.content}</p>
                        <Link className="btn btn-primary" to={`/notes/${this.state.randomNote.id}`}>Detail</Link>
                    </div>
                </div>

                <table className="table" style={{marginTop: "20px"}}>
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
