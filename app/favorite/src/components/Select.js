import React from 'react';

const Select = (props) => {

    return (
        <div className="form-group">
            <label>{props.label && <label>{props.label}</label>}</label>
            <select
                value={props.value}
                className="form-control"
                onChange={props.onChange}>
                <option></option>
                {props.items.map((item) =>
                    <option key={item.id}>{item.value}</option>
                )}
            </select>
            {props.hasError && (
                <div className="invalid-feedback">{props.error}</div>
            )}

        </div>
    );
};

Select.defaultProps = {
    onChange: () => {
    }
};

export default Select;
