import React from 'react';
import Input from '../components/Input';
import ButtonWithProgress from '../components/ButtonWithProgress';
import * as apiCalls from '../api/apiCalls';
import CategoryList from "../components/CategoryList";

export class CategoryAddPage extends React.Component {
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

    render() {
        console.log("Test");
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
                        <CategoryList loadError={this.state.categoryLoadError} categoryList={this.state.categoryList}/>
                    </div>
                </div>
            </div>
        );
    }
}


