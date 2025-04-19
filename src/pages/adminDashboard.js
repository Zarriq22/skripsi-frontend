import React, { Component } from "react";
import Layout from "../components/layout/layout";
import httpRequest from "../plugin/httpRequest";
import DataProduk from "./dataProduk";
import DataUser from "./dataUser";

class AdminDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            detail: {}
        }

        this.content = ['Keluar']

        this.dataProductRef = React.createRef();
    }

    componentWillMount() {
        this.getUser()
    }

    getUser = async () => {
        let userData = JSON.parse(localStorage.getItem('userData'))
        let getMe = await httpRequest(process.env.REACT_APP_BASE_URL, `users/${userData.user.id}`, 'GET')
        if (userData && userData.user.role === 'admin') {
            this.setState({
                detail: {
                    name: getMe.initialName,
                    avatar: getMe.avatar
                }       
            })
        }
    }

    render() {
        return (
            <>
                <Layout title="Admin Dashboard" showSidebar={true} detail={this.state.detail} content={this.content}>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-12" style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                                <div className="col-md-6" style={{ paddingRight: '24px' }}>
                                    <DataProduk />
                                </div>
                                <div className="col-md-6" style={{ paddingRight: '24px' }}>
                                    <DataUser />
                                </div>
                            </div>
                        </div>
                    </div>
                </Layout>
            </>
        );
    }
}

export default AdminDashboard;