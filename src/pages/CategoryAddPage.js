import React from 'react';
import Input from '../components/Input';
import ButtonWithProgress from '../components/ButtonWithProgress';
import * as apiCalls from '../api/apiCalls';

export class CategoryAddPage extends React.Component {
    state = {
        name: '',
        pendingApiCall: false,
        errors: {},
    };

    onChangeName = (event) => {
        const value = event.target.value;
        const errors = {...this.state.errors};
        delete errors.name;
        this.setState({name: value, errors});
    };

    onClickSave = () => {
        const category = {
            name: this.state.name,
        };
        this.setState({pendingApiCall: true});
        apiCalls
            .addCategory(category)
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
                <h1 className="text-center">Add Category</h1>
                <div className="col-12 mb-3">
                    <Input
                        label="Name"
                        placeholder="Category name"
                        value={this.state.name}
                        onChange={this.onChangeName}
                        hasError={this.state.errors.name && true}
                        error={this.state.errors.name}
                    />
                </div>
                <div className="text-center">
                    <ButtonWithProgress
                        onClick={this.onClickSave}
                        disabled={
                            this.state.pendingApiCall
                        }
                        pendingApiCall={this.state.pendingApiCall}
                        text="Save"
                    />
                </div>
            </div>
        );
    }
}


