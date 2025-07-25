import React, { Component } from "react";
import Popup from "../../components/ui/Popup";
import Form from "../../components/ui/Form";
import ScrollView from "../../components/ui/Scroll";
import httpRequest from "../../plugin/httpRequest";
import { category, gender } from "../../plugin/lookup";
import LoadingRequest from "../../components/ui/loading";
import axios from "axios";

class ModalProduk extends Component {
    constructor(props) {
        super(props);

        this.state = {
            popupVisible: false,
            formData: {},
            loadingRequest: false
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
                name: 'kategori',
                label: 'Kategori Produk',
                required: true,
                placeholder: 'Masukkan Kategori Produk',
                type: 'select',
                className: 'form-input',
                dataSource: 'kategori',
            },
            {
                name: 'gender',
                label: 'Gender Produk',
                required: true,
                placeholder: 'Masukkan Gender Produk',
                type: 'select',
                className: 'form-input',
                dataSource: 'gender',
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
                name: 'images',
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
            popupVisible: false,
            formData: {}
        });
    }
    
    setFormData = (data) => {
        if (this.formRef.current) {
            this.formRef.current.setFormData(data);
        }
    };

    onSubmit = async () => {
        const data = this.formRef.current.state.formData;     
        const uploadImageId = this.formRef.current.state.uploadImageId;    
        const files = data.images;                                 
        const isEdit = Boolean(data._id);

        this.setState({ loadingRequest: true, status: '' });

        try {
            const productPayload = { values: {
                ...data,
                link: `detail-product/${data._id}`
            }, key: data._id };
            const method = isEdit ? 'PUT' : 'POST';

            const productRes = await httpRequest(
                process.env.REACT_APP_BASE_URL,
                'products',
                method,
                productPayload
            );

            const productId = isEdit ? data._id : productRes?.data?._id;
            let uploadId = data.uploadImageId || uploadImageId;

            if (files && files.length) {
                const formData = new FormData();
                files.forEach(file => formData.append('file', file));
                formData.append('productId', productId);

                const uploadUrl = uploadId
                    ? `${process.env.REACT_APP_BASE_URL}upload/${uploadId}?mode=append`
                    : `${process.env.REACT_APP_BASE_URL}upload`;

                const method = uploadId ? 'put' : 'post';

                const response = await axios({
                    method,
                    url: uploadUrl,
                    data: formData,
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                uploadId = response.data.upload._id;
            }

            if (uploadId && (!isEdit || !data.uploadId)) {
                await httpRequest(
                    process.env.REACT_APP_BASE_URL,
                    'products',
                    'PUT',
                    {
                        key: productId,
                        values: { 
                            uploadImageId: uploadId,
                            link: `detail-product/${productId}`
                        }
                    }
                );
            }   

            this.hideModal();
            this.props.refreshData();
            this.setState({ loadingRequest: false, status: 'Sukses menyimpan produk!' });

        } catch (err) {
            console.error(err);
            this.setState({ loadingRequest: false, status: 'Gagal menyimpan produk!' });
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
                    kategori: category(),
                    gender: gender()
                }}
            />
        )
    }

    render() {
        const element = this.renderElement()
        const { loadingRequest } = this.state
        return (
            <Popup 
                visible={this.state.popupVisible}
                onHiding={this.hideModal}
                title={`Form ${this.props.type === 'edit' ? 'Edit' : 'Tambah'} Produk`}
                height={'50vh'}
                width={'w-[85%] md:w-[50vw]'}
                toolbarItems={this.toolbarItems}
            >
                <div>
                    <ScrollView width="100%" height="100%">
                        {element}
                    </ScrollView>
                </div>

                {loadingRequest && <LoadingRequest />}
            </Popup>
        )
    }
}

export default ModalProduk