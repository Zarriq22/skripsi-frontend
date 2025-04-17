import { Component } from "react";
import Layout from "../components/layout/layout";
import httpRequest from "../plugin/httpRequest";

class AdminDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            detail: {}
        }

        this.content = ['Keluar']
    }

    componentWillMount() {
        this.getUser()
    }

    getUser = async () => {
        let userData = JSON.parse(localStorage.getItem('userData'))
        let getMe = await httpRequest(process.env.REACT_APP_BASE_URL, `users/${userData.user.id}`, 'GET')
        this.setState({
            detail: {
                name: getMe.initialName,
                avatar: getMe.avatar
            }       
        })
    }

    render() {
        return (
            <>
                <Layout title="Admin Dashboard" showSidebar={true} detail={this.state.detail} content={this.content}>
                    <h1>Admin Dashboard</h1>
                </Layout>
            </>
        );
    }
}

export default AdminDashboard;