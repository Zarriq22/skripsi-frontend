import React, { Component } from "react";
import Button from "../../components/ui/Button";
import httpRequest from "../../plugin/httpRequest";
import ModalProduk from "./modalProduk";
import DataTable from "../../components/ui/DataTable";
import confirmAlert from "../../components/ui/ConfirrmAlert";
import notify from "../../components/ui/Notify";

class DataProduk extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataProduct: []
        };

        this.columns = [
            { 
                header: "No", 
                render: (row, index) => index + 1 
            },
            { 
                header: "Nama Produk", 
                field: "productName", 
                sortable: true 
            },
            { 
                header: "Harga", 
                field: "price", 
                type: 'number',
                sortable: true 
            },
            { 
                header: "Stok", 
                field: "stock", 
                type: 'number',
                sortable: true 
            },
            { 
                header: "Deskripsi", 
                field: "description", 
                sortable: true 
            }
        ]

        this.dataTableRef = React.createRef();
        this.showMoadlAddRef = React.createRef();
        this.showModalEditRef = React.createRef();

        this.onToolbarPreparing = [
            {
                label: "Ubah",
                action: this.handleEdit
            },
            {
                label: "Hapus",
                action: (data) => {
                    confirmAlert({
                        title: "Hapus Produk",
                        message: "Apakah anda yakin ingin menghapus produk ini ?",
                        buttons: [
                            {
                                label: "Ya",
                                onClick: () => {
                                    this.handleDelete(data);
                                }
                            },
                            {
                                label: "Tidak",
                                onClick: () => {}
                            }
                        ]
                    })
                }
            }
        ]
    }

    componentDidMount() {
        this.getAllData();
    }

    getAllData = async () => {
        let getAllProduct = await httpRequest(process.env.REACT_APP_BASE_URL, 'products', 'GET');

        if (getAllProduct) {
            this.setState({ dataProduct: getAllProduct });
        }
        this.refreshData();
    };

    showModalTambah = () => {
        this.showMoadlAddRef.current.showModal();
    };

    handleEdit = (product) => {
        this.showModalEditRef.current.showModal(product);
    };

    handleDelete = async (product) => {
        let id = product._id

        try {
            await httpRequest(process.env.REACT_APP_BASE_URL, `products/${id}`, 'DELETE');

            notify('Produk berhasil dihapus', 'success');
            this.getAllData()
        } catch (e) {
            console.log(e)
            notify('Produk gagal dihapus', 'error');
        }
    };
    
    keranjang = () => {

    }

    refreshData = () => {
        this.dataTableRef.current.refreshData();
    };

    render() {
        const { dataProduct } = this.state;

        return (
            <div className="container-fluid px-0">
                <h2 className="main-title">Data Produk</h2>
                <div className="table-responsive">
                    <div className="flex justify-end mb-2">
                        <Button 
                            text="Tambah Produk" 
                            onClick={this.showModalTambah}
                            cssClass="bg-button-add"
                        />
                    </div>
                    <DataTable
                        ref={this.dataTableRef}
                        columns={this.columns}
                        data={dataProduct}
                        height={'calc(100vh - 320px)'}
                        menuRightClick={true}
                        onToolbarPreparing={this.onToolbarPreparing}
                    />
                </div>

                <ModalProduk 
                    ref={this.showMoadlAddRef}
                    refreshData={this.getAllData}
                    type={'add'}
                />

                <ModalProduk 
                    ref={this.showModalEditRef}
                    refreshData={this.getAllData}
                    type={'edit'}
                />
            </div>
        );
    }
}

export default DataProduk;
