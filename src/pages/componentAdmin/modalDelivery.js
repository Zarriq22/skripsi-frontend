import React, { Component } from "react";
import Popup from "../../components/ui/Popup";
import Form from "../../components/ui/Form";
import ScrollView from "../../components/ui/Scroll";
import httpRequest from "../../plugin/httpRequest";
import { statusPesanan } from "../../plugin/lookup";

class ModalDelivery extends Component {
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
                name: 'resi',
                label: 'No Resi',
                required: true,
                placeholder: 'Masukkan No Resi',
                className: 'form-input'
            },
            {
                name: 'status',
                label: 'Status',
                required: true,
                placeholder: 'Masukkan Status',
                type: 'select',
                dataSource: 'status',
            }
        ]

        this.toolbarItems  = [
            {
                text: 'Kirim',
                onClick: this.onSubmit,
                cssClass: 'bg-button-popup-save'
            },
        ]

        this.formRef = React.createRef();
    }

    showModal = (data = null) => {
        this.setState({ popupVisible: true, id: data[0]._id }, () => {
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
        let data = this.formRef.current.state.formData
        const { id } = this.state
        try {
            let result = await httpRequest(process.env.REACT_APP_BASE_URL, 'pesanan', 'PUT', {
                values: data,
                key: id
            })
            
            if (result) {
                this.hideModal()
            }
        } catch (e) {
            console.log(e)
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
                    status: statusPesanan() // Tambahkan dataSource dengan nama yang sesuai
                }}
            />
        )
    }

    render() {
        const element = this.renderElement()
        return (
            <Popup 
                visible={this.state.popupVisible}
                onHiding={this.hideModal}
                title={`Form Kirim Produk`}
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

export default ModalDelivery