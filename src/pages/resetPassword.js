import { Component } from "react";
import Form from "../components/ui/Form";
import httpRequest from "../plugin/httpRequest";
import alert from "../components/ui/Alert";
import notify from "../components/ui/Notify";
import { withNavigate } from "../router/custom/withNavigate";

class CreateNewPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: ''
        }

        this.userFields = [
            {
                name: 'username',
                label: 'Username',
                type: 'text',
                required: true,
                placeholder: 'Masukkan username',
                className: 'form-input' 
            }
        ];

        this.resetFields = [
            {
                name: 'password',
                label: 'Password Baru',
                type: 'password',
                required: true,
                placeholder: 'Masukkan password baru',
                className: 'form-input'
            },
            {
                name: 'confirmPassword',
                label: 'Confirm Password',
                type: 'confirmPassword',
                required: true,
                placeholder: 'Masukkan password baru',
                className: 'form-input'
            },
        ];
    }

    handleSubmit = async (formData) => {
        const navigate = this.props.navigate
        let getUser
        try {
            getUser = await httpRequest(process.env.REACT_APP_BASE_URL, `users/username/${formData.username}`, 'GET')

            this.setState({
                userId: getUser._id
            })
        } catch (e) {
            alert(`${e.response.data.message}`, 'Informasi')
        }

        if (formData.password && formData.confirmPassword) {
            try {
                const result = await httpRequest(process.env.REACT_APP_BASE_URL, `users/${getUser._id}`, 'PUT', {
                    values: {
                        password: formData.password
                    }
                })

                if (result.message === 'User diperbarui') {
                    notify('Password berhasil dirubah', 'success')
                    navigate('/')
                }
            } catch (e) {
                alert(`Terjadi Kesalahan Sistem!`, 'Informasi')
            }
        }
    }

    render() {
        const { userId } = this.state
        return (
            <div className="w-screen h-screen bg-gradient-to-r from-cyan-500 to-blue-500">
                <div className='container mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center'>
                    <div className='lg:w-[35%] p-4 border-2 rounded-2xl bg-white'>
                        <h2 className='main-title text-center'>Create New Password</h2>
                        <Form
                            dataField={userId ? this.resetFields : this.userFields}
                            onSubmit={this.handleSubmit}
                            submitButtonText={userId ? 'Reset Password' : 'Cari Username'}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default withNavigate(CreateNewPassword)