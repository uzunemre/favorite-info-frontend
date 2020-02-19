import React from 'react';
import Input from "../components/Input";
import * as apiCalls from "../api/apiCalls";
import Select from "../components/Select";
import {isEmpty} from "../utils/utils";
import ButtonWithProgress from "../components/ButtonWithProgress";
import Spinner from "../components/Spinner";

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
            .listCategories()
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

    onClickSave = () => {
        const note = {
            id: undefined,
            title: this.state.title,
            content: this.state.note,
            summary: this.state.summary,
            categoryId: this.state.category.id,
            importanceLevel: this.state.importanceLevel.id,
            read: false,
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
                let errors = {...this.state.errors};
                if (apiError.response.data && apiError.response.data.validationErrors) {
                    errors = {...apiError.response.data.validationErrors};
                }
                this.setState({saveApiCall: false, errors});
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


                <div className="text-center">
                    <ButtonWithProgress
                        onClick={this.onClickSave}
                        disabled={this.state.saveApiCall}
                        pendingApiCall={this.state.saveApiCall}
                        text="Save"
                    />
                </div>
            </div>
        );
    }
}


