import React from 'react';
import Input from "../components/Input";
import * as apiCalls from "../api/apiCalls";
import Select from "../components/Select";
import {isEmpty} from "../utils/utils";
import ButtonWithProgress from "../components/ButtonWithProgress";
import Spinner from "../components/Spinner";
import Modal from "../components/Modal";

export class NoteEditPage extends React.Component {

    state = {
        id: '',
        title: '',
        category: '',
        importanceLevel: '',
        note: '',
        summary: '',
        isRead: false,
        saveApiCall: false,
        categories: [],
        isLoadingNoteDetail: false,
    };

    importanceLevels = [
        {value: "Very Low", id: 1},
        {value: "Low", id: 2},
        {value: "Medium", id: 3},
        {value: "High", id: 4},
        {value: "Very High", id: 5},
    ];

    componentDidMount() {
        this.setState({isLoadingNoteDetail: true});
        this.loadData();
    }

    loadData = () => {
        apiCalls
            .getCategories()
            .then((response) => {
                const data = response.data;
                const categories = [];
                data.forEach(item => {
                    const category = {
                        id: item.id,
                        value: item.name
                    };
                    categories.push(category);
                });
                this.setState({
                    categories: categories,
                    categoryLoadError: undefined
                });
                this.loadNoteDetail();
            })
            .catch((error) => {
                this.setState({categoryLoadError: 'Category load failed'});
            });
    };


    loadNoteDetail = () => {
        const noteId = this.props.match.params.noteId;
        if (isEmpty(noteId)) {
            this.setState({isLoadingNoteDetail: false});
        } else {
            apiCalls
                .getNote(noteId)
                .then((response) => {
                    const note = response.data;
                    this.setState({
                        id: note.id,
                        title: note.title,
                        note: note.content,
                        summary: note.summary,
                        importanceLevel: this.importanceLevels.filter(level => level.id === note.level)[0],
                        category: this.state.categories.filter(category => category.id === note.categoryId)[0],
                        isRead: note.read,
                        noteLoadError: undefined,
                        isLoadingNoteDetail: false,
                    });
                })
                .catch((error) => {
                    this.setState({noteLoadError: 'Note load failed'});
                });
        }
    };

    onChangeTitle = (event) => {
        const value = event.target.value;
        this.setState({title: value});
    };

    onChangeCategory = (event) => {
        const value = event.target.value;
        const selected = this.state.categories.filter(category => category.value === value)[0];
        if (!isEmpty(selected)) {
            this.setState({category: selected});
        }
    };

    onChangeImportanceLevel = (event) => {
        const value = event.target.value;
        const selected = this.importanceLevels.filter(level => level.value === value)[0];
        if (!isEmpty(selected)) {
            this.setState({importanceLevel: selected});
        }
    };

    onChangeNote = (event) => {
        const value = event.target.value;
        this.setState({note: value});
    };

    onChangeSummary = (event) => {
        const value = event.target.value;
        this.setState({summary: value});
    };

    onChangeRead = (event) => {
        const value = event.target.checked;
        this.setState({isRead: value});
    };

    onClickSave = () => {
        const note = {
            id: undefined,
            title: this.state.title,
            content: this.state.note,
            summary: this.state.summary,
            categoryId: this.state.category.id,
            importanceLevel: this.state.importanceLevel.id,
            read: this.state.isRead,
        };
        this.setState({saveApiCall: true});
        const noteId = this.props.match.params.noteId;
        if (!isEmpty(noteId)) {
            note.id = noteId;
        }
        apiCalls
            .saveNote(note)
            .then((response) => {
                this.setState({saveApiCall: false}, () =>
                    this.props.history.push('/')
                );
            })
            .catch((apiError) => {
                console.log(apiError);
                let errors = {...this.state.errors};
                if (apiError.response.data && apiError.response.data.validationErrors) {
                    errors = {...apiError.response.data.validationErrors};
                }
                this.setState({saveApiCall: false, errors});
            });
    };

    onClickDeleteNote = () => {
        this.setState({clickDelete: true});
    };

    onClickDeleteModalCancel = () => {
        this.setState({clickDelete: false});
    };

    onClickDeleteModalOk = () => {
        this.setState({isDeletingNote: true});
        apiCalls
            .deleteNote(this.state.id)
            .then((response) => {
                this.props.history.push('/');
            })
            .catch((apiError) => {
                this.setState({isDeletingNote: false});
            });

    };

    render() {
        if (this.state.isLoadingNoteDetail) {
            return <Spinner/>;
        }
        return (
            <div className="container">
                <h1 className="text-center">Note Add</h1>
                <div className="col-12 mb-3">
                    <Input
                        label="Title"
                        value={this.state.title}
                        onChange={this.onChangeTitle}
                    />
                </div>
                <div className="col-12 mb-3">
                    <Select
                        label="Category"
                        value={this.state.category.value}
                        items={this.state.categories}
                        onChange={this.onChangeCategory}
                    />
                </div>
                <div className="col-12 mb-3">
                    <Select
                        label="Importance Level"
                        value={this.state.importanceLevel.value}
                        items={this.importanceLevels}
                        onChange={this.onChangeImportanceLevel}
                    />
                </div>
                <div className="col-12 mb-3">
                    <Input
                        label="Note"
                        value={this.state.note}
                        onChange={this.onChangeNote}
                    />
                </div>
                <div className="col-12 mb-3">
                    <label htmlFor="comment">Summary</label>
                    <textarea
                        className="form-control"
                        rows="5"
                        value={this.state.summary}
                        onChange={this.onChangeSummary}
                    />
                </div>

                <div className="col-12 mb-3">
                    <div className="custom-control custom-checkbox">
                        <input onChange={this.onChangeRead} defaultChecked={this.state.isRead} type="checkbox"
                               className="custom-control-input"
                               id="readCheck"/>
                        <label className="custom-control-label" htmlFor="readCheck">I read it</label>
                    </div>
                </div>

                <div className="text-center">
                    <ButtonWithProgress
                        onClick={this.onClickSave}
                        disabled={this.state.saveApiCall}
                        pendingApiCall={this.state.saveApiCall}
                        text="Save"
                    />
                    {this.state.id && <button style={{marginLeft: "5px"}}
                                              className='btn btn-danger'
                                              onClick={() => this.onClickDeleteNote()}>
                        Delete
                    </button>}
                </div>

                <Modal
                    visible={this.state.clickDelete && true}
                    onClickCancel={this.onClickDeleteModalCancel}
                    body={`Are you sure to delete?`}
                    title="Delete!"
                    okButton="Delete Note"
                    onClickOk={this.onClickDeleteModalOk}
                    pendingApiCall={this.state.isDeletingNote}
                />

            </div>
        );
    }
}


