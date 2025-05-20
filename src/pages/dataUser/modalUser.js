import React, { Component } from "react";
import Popup from "../../components/ui/Popup";
import Form from "../../components/ui/Form";
import ScrollView from "../../components/ui/Scroll";
import httpRequest from "../../plugin/httpRequest";
import { userType } from "../../plugin/lookup";

class ModalUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            popupVisible: false,
            formData: {}
        }

        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);

        this.dataField = [
            {
                name: 'initialName',
                label: 'Inisial Nama',
                className: 'form-input capitalize',
                placeholder: 'Masukkan Inisial Nama',
            },
            {
                name: 'username',
                label: 'Username',
                className: 'form-input',
                placeholder: 'Masukkan Username',
            },
            {
                name: 'password',
                label: 'Password',
                type: 'password',
                className: 'form-input',
                visible: this.props.type === 'add' ? true : false
            },
            {
                name: 'userType',
                label: 'Tipe User',
                type: 'select',
                className: 'form-input',
                dataSource: 'userTypes',
                readOnly: true
            },
            {
                name: 'avatar',
                label: 'Avatar User',
                type: 'file',
                className: 'form-input',
            }
        ]

        this.toolbarItems  = [
            {
                text: 'Simpan',
                onClick: this.onSubmit,
                cssClass: 'bg-button-popup-save',
                visible: this.props.type === 'add' ? true : false
            },
            {
                text: 'Tutup',
                onClick: this.hideModal,
                cssClass: 'bg-button-popup-close'
            },
        ]

        this.formRef = React.createRef();
    }

    showModal = (data = null) => {
        this.setState({ popupVisible: true }, () => {
            if (data) {
                this.setFormData(data);
            }
        });
    };

    hideModal = () => {
        this.setState({ 
            popupVisible: false 
        });
    }
    
    setFormData = (data) => {
        if (this.formRef.current) {
            this.formRef.current.setFormData(data);
        }
    };

    onSubmit = async () => {
        let data = this.formRef.current.state.formData 
        if (data.id) {
            try {
                let result = await httpRequest(process.env.REACT_APP_BASE_URL, 'products', 'PUT', {
                    values: data,
                    key: data._id
                })
                
                if (result) {
                    this.hideModal()
                    this.props.refreshData()
                }
            } catch (e) {
                console.log(e)
            }
        } else {
            try {
                let result = await httpRequest(process.env.REACT_APP_BASE_URL, 'products', 'POST', {
                    values: data
                })
                
                if (result) {
                    this.hideModal()
                    this.props.refreshData()
                }
            } catch (e) {
                console.log(e)
            }
        }
    };

    renderElement = () => {
        return (
            <Form
                ref={this.formRef}
                dataField={this.dataField}
                onSubmit={this.onSubmit}
                formTitle={this.props.formTitle}
                dataSource={{ 
                    userTypes: userType() // Tambahkan dataSource dengan nama yang sesuai
                }}
                readOnly={this.props.type === 'detail' ? true : false}
            />
        )
    }

    render() {
        const element = this.renderElement()
        return (
            <Popup 
                visible={this.state.popupVisible}
                onHiding={this.hideModal}
                title={`Form ${this.props.type === 'detail' ? 'Detail User' : 'Tambah Admin'}`}
                height={'50vh'}
                width={'w-[85%] md:w-[30vw]'}
                toolbarItems={this.toolbarItems}
            >
                <div>
                    <ScrollView width="100%" height="100%">
                        {element}
                    </ScrollView>
                </div>
            </Popup>
        )
    }
}

export default ModalUser