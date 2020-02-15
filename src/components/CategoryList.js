import React from 'react';

class CategoryList extends React.Component {

    render() {
        return (
            <div className="card">
                <h1 className="text-center">Categories</h1>
                <div className="list-group list-group-flush">
                    {this.props.categoryList.map((category) =>
                        <li key={category.id}>{category.name}</li>
                    )}
                </div>
                {this.props.loadError && (
                    <span className="text-center text-danger">
            {this.props.loadError}
          </span>
                )}
            </div>
        );
    }
}

export default CategoryList;
