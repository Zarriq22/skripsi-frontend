import React, { Component } from "react";
import httpRequest from "../plugin/httpRequest";
import DataProduk from "./dataProduk";

class AdminDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            detail: {}
        }

        this.dataProductRef = React.createRef();
    }

    componentWillMount() {
        this.getUser()
    }

    getUser = async () => {
        let userData = JSON.parse(localStorage.getItem('userData'))
        let getMe = await httpRequest(process.env.REACT_APP_BASE_URL, `users/${userData.user.id}`, 'GET')
        if (userData) {
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
            <div className="pb-4">
                <DataProduk />
            </div>
        );
    }
}

export default AdminDashboard;