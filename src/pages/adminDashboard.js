import React, { Component } from "react";
import httpRequest from "../plugin/httpRequest";
import DataProduk from "./dataProduk";
import axios from "axios";

class AdminDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            detail: {},
            selectedFile: null,
            status: '',
            previewUrl: '',
            files: []
        }

        this.dataProductRef = React.createRef();
    }

    componentWillMount() {
        this.getUser()
        this.fetchFiles();
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

    fetchFiles = async () => {
        try {
            const res = await httpRequest(process.env.REACT_APP_BASE_URL, 'upload', 'GET');
            this.setState({ files: res });
        } catch (err) {
            console.error('Error fetching files:', err);
        }
    };

    handleFileChange = (event) => {
        const file = event.target.files[0];
        this.setState({
            selectedFile: file,
            previewUrl: URL.createObjectURL(file) // Untuk preview image
        });
    };

    handleUpload = async () => {
        const { selectedFile } = this.state;
        if (!selectedFile) return alert("Pilih file dulu bro");

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
        const res = await axios.post(process.env.REACT_APP_BASE_URL + 'upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        this.setState({ status: 'Upload sukses! Path: ' + res.data.file.path });
        } catch (error) {
        console.error(error);
        this.setState({ status: 'Upload gagal!' });
        }
    };

    render() {
        return (
            <div className="pb-4">
                <DataProduk />
            </div>
        );
    }
}

export default AdminDashboard;