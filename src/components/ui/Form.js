import { Component } from "react";
import { Link } from "react-router-dom";
import { formatNumber, generateImage } from "../../plugin/helper";

class Form extends Component {
    constructor(props) {
        super(props);
        
        // Initialize form state based on dataField
        const initialFormState = {};
        if (this.props.dataField) {
            this.props.dataField.forEach(field => {
                initialFormState[field.name] = field.defaultValue || null;
            });
        }
        
        this.state = {
            formData: {},
            previews:{},
            errors: {},
            hidden: false,
            newHidden: false,
            uploadImageId: 0
        };
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillUnmount() {
        // bebaskan URL object
        Object.values(this.state.previews).flat().forEach(u => URL.revokeObjectURL(u));
    }

    validatePassword = (password) => {
        const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return PASSWORD_REGEX.test(password);
    }
    
    handleChange = (e) => {
        const { name, value } = e.target;
        let error = '';

        if (name === 'confirmPassword') {
            if (value !== this.state.formData.password) {
                error = 'Password tidak cocok';
            }
        }

        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                [name]: value
            },
            errors: {
                ...prevState.errors,
                [name]: error
            }
        }));
    }

    handleFileChange = (e, field) => {
        const newFiles = Array.from(e.target.files);

        this.setState(prevState => {
            // Ambil file & preview lama jika multiple
            const oldFiles = field.multiple ? prevState.formData[field.name] || [] : null;
            const oldPreviews = field.multiple ? prevState.previews[field.name] || [] : null;

            const updatedFiles = field.multiple ? [...oldFiles, ...newFiles] : newFiles[0] || null;
            const updatedPreviews = field.multiple
                ? [...oldPreviews, ...newFiles.map(file => URL.createObjectURL(file))]
                : newFiles[0] ? URL.createObjectURL(newFiles[0]) : null;

            return {
                formData: {
                    ...prevState.formData,
                    [field.name]: updatedFiles
                },
                previews: {
                    ...prevState.previews,
                    [field.name]: updatedPreviews
                }
            };
        });
    };
    
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
            this.props.onSubmit(this.state.formData, this.state.uploadImageId);
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
        if (fieldName === 'password') {
            this.setState({
                hidden: !this.state.hidden
            })
        } else if (fieldName === 'confirmPassword') {
            this.setState({
                newHidden: !this.state.newHidden
            })
        }
    }

    setFormData = (data) => {
        const filledData = {};

        this.props.dataField.forEach(field => {
            filledData[field.name] = data[field.name] ?? field.defaultValue ?? '';
            filledData['_id'] = data['_id'] ?? field.defaultValue ?? '';

        });

        const previews = {};

        this.props.dataField.forEach(field => {
            if (field.type === 'file') {
                const value = data[field.name];

                if (field.multiple && Array.isArray(value)) {
                    previews[field.name] = value.map(img =>
                        generateImage(img.path)
                    );
                } else if (value?.path) {
                    previews[field.name] = generateImage(value.path);
                }
            }
        });

        this.setState({ formData: filledData, uploadImageId: data.uploadImageId, previews });
    };
    
    renderField = (field) => {
        const isRequired = field.required === true;
        const { formData, errors, hidden, newHidden } = this.state;
        const value = formData[field.name] || '';
        const error = errors[field.name] || null;
        const previews = this.state.previews[field.name];

        if (field.visible === false) {
            return null;
        }
        
        // Get options for select/datalist
        const options = field.dataSource 
            ? (this.props.dataSource && this.props.dataSource[field.dataSource]) || []
            : [];

        const fieldStyle = {
            display: field.visible === false ? 'none' : undefined
        };

         // Fungsi untuk menentukan apakah field harus di-render
        const shouldRenderField = () => {
            // Jika ada fungsi visible, evaluasi fungsi tersebut
            if (typeof field.visible === 'function') {
                return field.visible(formData);
            }
            // Jika visible adalah boolean, gunakan nilai tersebut
            return field.visible !== false;
        };
        
        if (!shouldRenderField()) {
            return null;
        }
        
        switch (field.type) {
            case 'select':
                return (
                    <div key={field.name} className="form-group">
                        <div className="container-fluid">
                            <div className="row" style={fieldStyle}>
                                <div className="col-md-12 form-control">
                                    <div className="col-md-4" style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <label htmlFor={field.name}>{field.label}</label>
                                        {isRequired && <i className="fa fa-asterisk" aria-hidden="true" style={{ color: 'red', fontSize: '8px', marginLeft: '5px', marginTop: '3px' }}></i>}
                                    </div>
                                    <div className="col-md-8">
                                        <select
                                            id={field.name}
                                            name={field.name}
                                            value={value}
                                            onChange={this.handleChange}
                                            className={`form-input ${error ? 'is-invalid' : ''}`}
                                            required={field.required}
                                            disabled={field.readOnly || this.props.readOnly}
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
                                </div>
                            </div>
                        </div>
                    </div>
                );
                
            case 'textarea':
                return (
                    <div key={field.name} className="form-group">
                        <div className="container-fluid">
                            <div className="row" style={fieldStyle}>
                                <div className="col-md-12 form-control" style={{ alignItems: 'flex-start' }}>
                                    <div className="col-md-4" style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <label htmlFor={field.name}>{field.label}</label>
                                        {isRequired && <i className="fa fa-asterisk" aria-hidden="true" style={{ color: 'red', fontSize: '8px', marginLeft: '5px', marginTop: '3px' }}></i>}
                                    </div>
                                    <div className="col-md-8">
                                        <textarea
                                            id={field.name}
                                            name={field.name}
                                            value={value}
                                            onChange={this.handleChange}
                                            className={`form-input ${error ? 'is-invalid' : ''}`}
                                            required={field.required}
                                            rows={field.rows || 3}
                                            style={{
                                                height: field.height || '100px',
                                                maxHeight: field.maxHeight || '100px', // disable manual resize
                                            }}  
                                            placeholder={field.placeholder || 'Masukan Deskripsi'}
                                            disabled={field.readOnly || this.props.readOnly}
                                        />
                                        {error && <div className="invalid-feedback">{error}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
                
            case 'checkbox':
                return (
                    <div key={field.name} className="form-group">
                        <div className="container-fluid">
                            <div className="row" style={fieldStyle}>
                                <div className="col-md-12 form-control">
                                    <div className="col-md-4" style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <label className="form-check-label" htmlFor={field.name}>
                                            {field.label}
                                        </label>
                                        {isRequired && <i className="fa fa-asterisk" aria-hidden="true" style={{ color: 'red', fontSize: '8px', marginLeft: '5px', marginTop: '3px' }}></i>}
                                    </div>
                                    <div className="col-md-8">
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
                                            required={field.required}
                                            disabled={field.readOnly || this.props.readOnly}
                                        />
                                        {error && <div className="invalid-feedback">{error}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'password':
                return (
                    <div key={field.name} className="form-group">
                        <div className="container-fluid">
                            <div className="row" style={fieldStyle}>
                                <div className="col-md-12 form-control">
                                    <div className="col-md-4" style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <label htmlFor={field.name}>{field.label}</label>
                                        {isRequired && <i className="fa fa-asterisk" aria-hidden="true" style={{ color: 'red', fontSize: '8px', marginLeft: '5px', marginTop: '3px' }}></i>}
                                    </div>
                                    <div className="relative col-md-8">
                                        <input
                                            type={hidden ? 'text' : 'password'} // Perubahan di sini
                                            id={field.name}
                                            name={field.name}
                                            value={value}
                                            onChange={this.handleChange}
                                            placeholder={'Masukan Password'}
                                            className={`form-input ${error ? 'is-invalid' : ''} ${field.className || ''}`} // Support custom class
                                            disabled={field.readOnly || this.props.readOnly}
                                        />
                                        <i className={`${hidden ? 'far fa-eye-slash' : 'far fa-eye'
                                        }`} onClick={() => this.togglePasswordVisibility(field.name)} style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} aria-hidden="true"></i>
                                        {error && <div className="invalid-feedback">{error}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'confirmPassword':
                return (
                    <div key={field.name} className="form-group">
                        <div className="container-fluid">
                            <div className="row" style={fieldStyle}>
                                <div className="col-md-12 form-control">
                                    <div className="col-md-4" style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <label htmlFor={field.name}>{field.label}</label>
                                        {isRequired && <i className="fa fa-asterisk" aria-hidden="true" style={{ color: 'red', fontSize: '8px', marginLeft: '5px', marginTop: '3px' }}></i>}
                                    </div>
                                    <div className="relative col-md-8">
                                        <input
                                            type={newHidden ? 'text' : 'password'} // Perubahan di sini
                                            id={field.name}
                                            name={field.name}
                                            value={value}
                                            onChange={this.handleChange}
                                            placeholder={'Masukan Password Konfirmasi'}
                                            className={`form-input ${error ? 'is-invalid' : ''} ${field.className || ''}`} // Support custom class
                                            disabled={field.readOnly || this.props.readOnly}
                                        />
                                        <i className={`${newHidden ? 'far fa-eye-slash' : 'far fa-eye'
                                        }`} onClick={() => this.togglePasswordVisibility(field.name)} style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} aria-hidden="true"></i>
                                        {error && <div className="invalid-feedback">{error}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'resetPassword':
                return (
                    <div key={field.name} className="form-group">
                        <div className="container-fluid">
                            <div className="row" style={fieldStyle}>
                                <div className="col-md-12 form-control" style={{ justifyContent: 'end' }}>
                                    <div className="text-blue-500 text-sm">
                                        {field.forgotPassword && <Link to="/reset-password">Lupa Password?</Link>}  
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
                            <div className="row" style={fieldStyle}>
                                <div className="col-md-12 form-control">
                                    <div className="col-md-4" style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <label htmlFor={field.name}>{field.label}</label>
                                        {isRequired && <i className="fa fa-asterisk" aria-hidden="true" style={{ color: 'red', fontSize: '8px', marginLeft: '5px', marginTop: '3px' }}></i>}
                                    </div>
                                    <div className="col-md-8">
                                        <input
                                            type="file"
                                            id={field.name}
                                            name={field.name}
                                            accept={field.accept || 'image/*'}
                                            onChange={(e) => this.handleFileChange(e, field)}
                                            className={`form-input ${error ? 'is-invalid' : ''} ${field.className || ''}`} // Support custom class
                                            disabled={field.readOnly || this.props.readOnly}
                                            multiple={field.multiple}
                                        />
                                        {error && <div className="invalid-feedback">{error}</div>}
                                    </div>
                                </div>
                                {/* PREVIEW */}
                                <div className="slider-image w-full flex flex-wrap gap-2 overflow-x-auto">
                                    {field.multiple && Array.isArray(previews) &&
                                        previews.map((src, i) => (
                                            <img key={i} src={src} alt={`Preview-${i}`} style={{ maxWidth: 100, margin: 10 }} />
                                    ))}

                                    {!field.multiple && previews && (
                                        <img src={previews} alt="Preview" style={{ maxWidth: 100, marginTop: 10 }} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
                
            default:
                return (
                    <div key={field.name} className="form-group">
                        <div className="container-fluid">
                            <div className="row" style={fieldStyle}>
                                <div className="col-md-12 form-control">
                                    <div className="col-md-4" style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <label htmlFor={field.name}>{field.label}</label>
                                        {isRequired && <i className="fa fa-asterisk" aria-hidden="true" style={{ color: 'red', fontSize: '8px', marginLeft: '5px', marginTop: '3px' }}></i>}
                                    </div>
                                    <div className="col-md-8">
                                        <input
                                            type={field.type || 'text'}
                                            id={field.name}
                                            name={field.name}
                                            value={typeof value === 'number' ? formatNumber(value) : value}
                                            onChange={this.handleChange}
                                            className={`form-input ${error ? 'is-invalid' : ''}`}
                                            placeholder={field.placeholder}
                                            required={field.required}
                                            pattern={field.pattern}
                                            disabled={field.readOnly || this.props.readOnly}
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

                    {this.props.submitButtonText && 
                        <div className="text-center col-md-12">
                            <button type="submit" className="btn btn-primary">
                                {submitButtonText || 'Submit'}
                            </button>
                        </div>
                    }

                    <div>
                        <footer>{renderFooter ? renderFooter() : null}</footer>
                    </div>
                </form>
            </div>
        );
    }
}

export default Form;