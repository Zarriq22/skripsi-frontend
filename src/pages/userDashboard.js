import { Component } from "react";
import Layout from "../components/layout/layout";
import httpRequest from "../plugin/httpRequest";

class UserDashboard extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            detail: {}
        }

        this.content = ['Profil', 'Pengaturan', 'Keluar'];
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
                <Layout title="User Dashboard" showSidebar={false} profile={true} detail={this.state.detail} content={this.content}>
                    <h1>User Dashboard</h1>
                </Layout>
            </>
        );
    }
}

export default UserDashboard;