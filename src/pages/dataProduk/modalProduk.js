import React, { Component } from "react";
import Popup from "../../components/ui/Popup";
import Form from "../../components/ui/Form";
import ScrollView from "../../components/ui/Scroll";
import httpRequest from "../../plugin/httpRequest";

class ModalProduk extends Component {
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
                name: 'productName',
                label: 'Nama Produk',
                required: true,
                placeholder: 'Masukkan Nama Produk',
                className: 'form-input'
            },
            {
                name: 'price',
                label: 'Harga Produk',
                type: 'number',
                required: true,
                placeholder: 'Masukkan Harga Produk',
                className: 'form-input'
            },
            {
                name: 'stock',
                label: 'Stok Produk',
                type: 'number',
                placeholder: 'Masukkan Stok Produk',
                className: 'form-input',
                defaultValue: 0
            },
            {
                name: 'description',
                label: 'Deskripsi Produk',
                type: 'textarea',
                required: true,
                placeholder: 'Masukkan Deskripsi Produk',
                className: 'form-input'
            },
            {
                name: 'image',
                label: 'Gambar Produk',
                type: 'file',
                required: true,
                placeholder: 'Masukkan Gambar Produk',
                className: 'form-input',
                multiple: true
            }
        ]

        this.toolbarItems  = [
            {
                text: 'Simpan',
                onClick: this.onSubmit,
                cssClass: 'bg-button-popup-save'
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
            />
        )
    }

    render() {
        const element = this.renderElement()
        return (
            <Popup 
                visible={this.state.popupVisible}
                onHiding={this.hideModal}
                title={`Form ${this.props.type === 'edit' ? 'Edit' : 'Tambah'} Produk`}
                height={'50vh'}
                width={'30vw'}
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

export default ModalProduk