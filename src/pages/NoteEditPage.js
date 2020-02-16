import React from 'react';
import Input from "../components/Input";
import ButtonWithProgress from "../components/ButtonWithProgress";

export class NoteEditPage extends React.Component {
    state = {
        title: '',
        categoryId: '',
        note: '',
        importanceLevel: '',
        isRead: false,
        pendingApiCall: false,
        errors: {},
    };

    onChangeTitle = (event) => {
        const value = event.target.value;
        const errors = {...this.state.errors};
        delete errors.title;
        this.setState({title: value, errors});
    };

    onChangeCategory = (event) => {
        const value = event.target.value;
        const errors = {...this.state.errors};
        delete errors.categoryId;
        this.setState({categoryId: value, errors});
    };

    onChangeNote = (event) => {
        const value = event.target.value;
        const errors = {...this.state.errors};
        delete errors.note;
        this.setState({note: value, errors});
    };

    render() {
        return (
            <div className="container">
                <h1 className="text-center">Note Add/Edit</h1>
                <div className="col-12 mb-3">
                    <Input
                        label="Title"
                        value={this.state.title}
                        onChange={this.onChangeTitle}
                        hasError={this.state.errors.title && true}
                        error={this.state.errors.title}
                    />
                </div>
                <div className="col-12 mb-3">
                    <Input
                        label="Category"
                        value={this.state.categoryId}
                        onChange={this.onChangeCategory}
                        hasError={this.state.errors.categoryId && true}
                        error={this.state.errors.categoryId}
                    />
                </div>
                <div className="col-12 mb-3">
                    <Input
                        label="Note"
                        value={this.state.note}
                        onChange={this.onChangeNote}
                        hasError={this.state.errors.note && true}
                        error={this.state.errors.note}
                    />
                </div>
            </div>
        );
    }
}


