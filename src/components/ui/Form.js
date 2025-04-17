import { Component } from "react";

class Form extends Component {
    constructor(props) {
        super(props);
        
        // Initialize form state based on dataField
        const initialFormState = {};
        if (this.props.dataField) {
            this.props.dataField.forEach(field => {
                initialFormState[field.name] = field.defaultValue || '';
            });
        }
        
        this.state = {
            formData: initialFormState,
            errors: {}
        };
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                [name]: value
            },
            errors: {
                ...prevState.errors,
                [name]: '' // Clear error when user types
            }
        }));
    }

    handleFileChange = (e) => {
        const dataField = this.props.dataField.find(field => field.name === e.target.name);
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                [dataField.name]: reader.result // ← Base64-nya disimpan
            }
            }));
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    }
    
    handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate form
        const errors = this.validateForm();
        if (Object.keys(errors).length > 0) {
            this.setState({ errors });
            return;
        }
        
        // Call parent onSubmit with form data
        if (this.props.onSubmit) {
            this.props.onSubmit(this.state.formData);
        }
    }
    
    validateForm = () => {
        const errors = {};
        
        this.props.dataField.forEach(field => {
            if (field.required && !this.state.formData[field.name]) {
                errors[field.name] = `${field.label} is required`;
            }
            
            if (field.pattern && !new RegExp(field.pattern).test(this.state.formData[field.name])) {
                errors[field.name] = field.validationMessage || `Invalid ${field.label} format`;
            }
        });
        
        return errors;
    }

    togglePasswordVisibility = (fieldName) => {
        const passwordInput = document.getElementById(fieldName);
    
        if (passwordInput.type === 'password') {
          passwordInput.type = 'text';
        } else {
          passwordInput.type = 'password';
        }
      };
    
    renderField = (field) => {
        const { formData, errors } = this.state;
        const value = formData[field.name] || '';
        const error = errors[field.name] || null;
        
        // Get options for select/datalist
        const options = field.dataSource 
            ? (this.props.dataSource && this.props.dataSource[field.dataSource]) || []
            : [];
        
        switch (field.type) {
            case 'select':
                return (
                    <div key={field.name} className="form-group">
                        <label htmlFor={field.name}>{field.label}</label>
                        <select
                            id={field.name}
                            name={field.name}
                            value={value}
                            onChange={this.handleChange}
                            className={`form-input ${error ? 'is-invalid' : ''}`}
                            required={field.required}
                        >
                            <option value="">Select {field.label}</option>
                            {options.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {error && <div className="invalid-feedback">{error}</div>}
                    </div>
                );
                
            case 'textarea':
                return (
                    <div key={field.name} className="form-group">
                        <label htmlFor={field.name}>{field.label}</label>
                        <textarea
                            id={field.name}
                            name={field.name}
                            value={value}
                            onChange={this.handleChange}
                            className={`form-input ${error ? 'is-invalid' : ''}`}
                            required={field.required}
                            rows={field.rows || 3}
                        />
                        {error && <div className="invalid-feedback">{error}</div>}
                    </div>
                );
                
            case 'checkbox':
                return (
                    <div key={field.name} className="form-check">
                        <input
                            type="checkbox"
                            id={field.name}
                            name={field.name}
                            checked={!!value}
                            onChange={(e) => this.handleChange({
                                target: {
                                    name: field.name,
                                    value: e.target.checked
                                }
                            })}
                            className={`form-check-input ${error ? 'is-invalid' : ''}`}
                        />
                        <label className="form-check-label" htmlFor={field.name}>
                            {field.label}
                        </label>
                        {error && <div className="invalid-feedback">{error}</div>}
                    </div>
                );

            case 'password':
                return (
                    <div key={field.name} className="form-group">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-12 form-control">
                                    <div className="col-md-4">
                                        <label htmlFor={field.name}>{field.label}</label>
                                    </div>
                                    <div className="relative col-md-8">
                                        <input
                                            type="password" // Perubahan di sini
                                            id={field.name}
                                            name={field.name}
                                            value={value}
                                            onChange={this.handleChange}
                                            className={`form-input ${error ? 'is-invalid' : ''} ${field.className || ''}`} // Support custom class
                                        />
                                        <i className="fa fa-eye" onClick={() => this.togglePasswordVisibility(field.name)} style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} aria-hidden="true"></i>
                                        {error && <div className="invalid-feedback">{error}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
                
            case 'file':
                return (
                    <div key={field.name} className="form-group">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-12 form-control">
                                    <div className="col-md-4">
                                        <label htmlFor={field.name}>{field.label}</label>
                                    </div>
                                    <div className="col-md-8">
                                        <input
                                            type="file"
                                            id={field.name}
                                            name={field.name}
                                            accept={field.accept || 'image/*'}
                                            onChange={this.handleFileChange}
                                            className={`form-input ${error ? 'is-invalid' : ''} ${field.className || ''}`} // Support custom class
                                        />
                                        {error && <div className="invalid-feedback">{error}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
                
            default:
                return (
                    <div key={field.name} className="form-group">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-12 form-control">
                                    <div className="col-md-4">
                                        <label htmlFor={field.name}>{field.label}</label>
                                    </div>
                                    <div className="col-md-8">
                                        <input
                                            type={field.type || 'text'}
                                            id={field.name}
                                            name={field.name}
                                            value={value}
                                            onChange={this.handleChange}
                                            className={`form-input ${error ? 'is-invalid' : ''}`}
                                            placeholder={field.placeholder}
                                            required={field.required}
                                            pattern={field.pattern}
                                        />
                                        {error && <div className="invalid-feedback">{error}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    }
    
    render() {
        const { dataField, formTitle, submitButtonText, renderFooter } = this.props;
        
        if (!dataField || !Array.isArray(dataField)) {
            return <div>No form fields defined</div>;
        }
        
        return (
            <div className="dynamic-form">
                {formTitle && <h2>{formTitle}</h2>}
                <form onSubmit={this.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {dataField.map(field => this.renderField(field))}
                    
                    <div className="text-center col-md-12">
                        <button type="submit" className="btn btn-primary">
                            {submitButtonText || 'Submit'}
                        </button>
                    </div>

                    <div>
                        <footer>{renderFooter ? renderFooter() : null}</footer>
                    </div>
                </form>
            </div>
        );
    }
}

export default Form;