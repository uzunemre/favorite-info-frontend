import React from 'react';
import Input from "../components/Input";
import * as apiCalls from "../api/apiCalls";
import Select from "../components/Select";
import {isEmpty} from "../utils/utils";
import ButtonWithProgress from "../components/ButtonWithProgress";

export class NoteEditPage extends React.Component {

    state = {
        title: '',
        category: null,
        importanceLevel: null,
        note: '',
        isRead: false,
        pendingApiCall: false,
        categories: [],
    };

    importanceLevels = [
        {value: "Very Low", id: 1},
        {value: "Low", id: 2},
        {value: "Medium", id: 3},
        {value: "High", id: 4},
        {value: "Very High", id: 5},
    ];

    yesNoList = [
        {value: "No", id: 0},
        {value: "Yes", id: 1}
    ];

    componentDidMount() {
        this.loadCategories();
    }

    loadCategories = () => {
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
            })
            .catch((error) => {
                this.setState({categoryLoadError: 'Category load failed'});
            });
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

    onChangeRead = (event) => {
        const value = event.target.value;
        const selected = this.yesNoList.filter(level => level.value === value)[0];
        if (isEmpty(selected)) {
            this.setState({isRead: false});
        } else {
            if (selected.value === "true") {
                this.setState({isRead: true});
            } else {
                this.setState({isRead: false});
            }
        }
    };

    onClickSave = () => {
        const note = {
            title: this.state.title,
            content: this.state.note,
            summary: '',
            categoryId: this.state.category.id,
            importanceLevel: this.state.importanceLevel.id,
            read: this.state.isRead
        };
        this.setState({pendingApiCall: true});
        apiCalls
            .addNote(note)
            .then((response) => {
                this.setState({pendingApiCall: false}, () =>
                    this.props.history.push('/')
                );
            })
            .catch((apiError) => {
                let errors = {...this.state.errors};
                if (apiError.response.data && apiError.response.data.validationErrors) {
                    errors = {...apiError.response.data.validationErrors};
                }
                this.setState({pendingApiCall: false, errors});
            });
    };

    render() {
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
                        items={this.state.categories}
                        onChange={this.onChangeCategory}
                    />
                </div>
                <div className="col-12 mb-3">
                    <Select
                        label="Importance Level"
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
                    <Select
                        label="Read"
                        items={this.yesNoList}
                        onChange={this.onChangeRead}
                    />
                </div>
                <div className="text-center">
                    <ButtonWithProgress
                        onClick={this.onClickSave}
                        disabled={this.state.pendingApiCall}
                        pendingApiCall={this.state.pendingApiCall}
                        text="Sign Up"
                    />
                </div>
            </div>
        );
    }
}


