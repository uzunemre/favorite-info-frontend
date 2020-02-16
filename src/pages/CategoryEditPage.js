import React from 'react';
import Input from '../components/Input';
import ButtonWithProgress from '../components/ButtonWithProgress';
import * as apiCalls from '../api/apiCalls';
import Modal from "../components/Modal";

export class CategoryEditPage extends React.Component {
    state = {
        name: '',
        pendingApiCall: false,
        errors: {},
        categoryList: [],
        categoryLoadError: '',
    };

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        apiCalls
            .listCategories()
            .then((response) => {
                this.setState({
                    categoryList: response.data,
                    categoryLoadError: undefined
                });
            })
            .catch((error) => {
                this.setState({categoryLoadError: 'Category load failed'});
            });
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
                this.setState({pendingApiCall: false});
                this.loadData();
            })
            .catch((apiError) => {
                let errors = {...this.state.errors};
                if (apiError.response.data && apiError.response.data.validationErrors) {
                    errors = {...apiError.response.data.validationErrors};
                }
                this.setState({pendingApiCall: false, errors});
            });
    };


    onClickDeleteCategory = (category) => {
        this.setState({categoryToBeDeleted: category});
    };

    onClickModalCancel = () => {
        this.setState({categoryToBeDeleted: undefined});
    };

    onClickModalOk = () => {
        this.setState({isDeletingCategory: true});
        apiCalls.deleteCategory(this.state.categoryToBeDeleted.id).then((response) => {
            const categoryList = this.state.categoryList.filter(
                (category) => category.id !== this.state.categoryToBeDeleted.id
            );
            this.setState({
                categoryList,
                categoryToBeDeleted: undefined,
                isDeletingCategory: false
            });
        });
    };

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-9">
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
                    <div className="col-3">
                        <div className="card">
                            <h1 className="text-center">Categories</h1>
                            <div className="list-group list-group-flush">
                                <ul>
                                    {this.state.categoryList.map((category) =>
                                        <li key={category.id}>
                                            {category.name}
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => this.onClickDeleteCategory(category)}>
                                                <i className="far fa-trash-alt"/>
                                            </button>
                                        </li>
                                    )}
                                </ul>
                            </div>
                            {this.categoryLoadError && (
                                <span className="text-center text-danger">
            {this.state.categoryLoadError}
          </span>
                            )}
                        </div>
                    </div>
                </div>
                <Modal
                    visible={this.state.categoryToBeDeleted && true}
                    onClickCancel={this.onClickModalCancel}
                    body={
                        this.state.categoryToBeDeleted &&
                        `Are you sure to delete '${this.state.categoryToBeDeleted.name}'?`
                    }
                    title="Delete!"
                    okButton="Delete Category"
                    onClickOk={this.onClickModalOk}
                    pendingApiCall={this.state.isDeletingCategory}
                />
            </div>
        );
    }
}


