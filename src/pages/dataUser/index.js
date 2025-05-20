import React, { Component } from "react";
import httpRequest from "../../plugin/httpRequest";
import DataTable from "../../components/ui/DataTable";
import ModalUser from "./modalUser";
import Button from "../../components/ui/Button";

class DataProduk extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataUser: []
        };

        this.columns = [
            { 
                header: "No", 
                render: (row, index) => index + 1 
            },
            { 
                header: "Nama User", 
                field: "initialName", 
                sortable: true,
                className: 'capitalize'
            },
            { 
                header: "Role", 
                field: "userType",
                sortable: true 
            },
        ]

        this.dataTableRef = React.createRef();
        this.showModalAddRef = React.createRef();
        this.shoeModalDetailRef = React.createRef();
        
        this.onToolbarPreparing = [
            {
                label: 'Detail User',
                action: this.handleDetail
            }
        ]
    }

    componentDidMount() {
        this.getAllData();
    }

    getAllData = async () => {
        let getAllUser = await httpRequest(process.env.REACT_APP_BASE_URL, 'users', 'GET');
        let result = []

        for (let val of getAllUser) {
            let dataValue = {
                ...val,
                userType: val.userType === 1 ? 'Admin' : 'User'
            }

            result.push(dataValue)
        }

        if (result) {
            this.setState({ 
                dataUser: result
            });
        }
        this.refreshData();
    };

    showModalTambah = () => {
        this.showModalAddRef.current.showModal({
            userType: 1
        });
    };

    handleDetail = (user) => {
        this.shoeModalDetailRef.current.showModal(user);
    };

    refreshData = () => {
        this.dataTableRef.current.refreshData();
    };

    render() {
        const { dataUser } = this.state;

        return (
            <div className="container-fluid px-0">
                <h2 className="main-title">Data User</h2>
                <div className="flex justify-end mb-2">
                    <Button 
                        text="Tambah Admin" 
                        onClick={this.showModalTambah}
                        cssClass="bg-button-add"
                    />
                </div>
                <div className="table-responsive">
                    <DataTable
                        ref={this.dataTableRef}
                        columns={this.columns}
                        data={dataUser}
                        height={'calc(100vh - 320px)'}
                        menuRightClick={true}
                        onToolbarPreparing={this.onToolbarPreparing}
                    />
                </div>

                <ModalUser 
                    ref={this.showModalAddRef}
                    refreshData={this.getAllData}
                    type={'add'}
                />

                <ModalUser 
                    ref={this.shoeModalDetailRef}
                    refreshData={this.getAllData}
                    type={'detail'}
                />
            </div>
        );
    }
}

export default DataProduk;
