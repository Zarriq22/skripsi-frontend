import { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Form from '../components/ui/Form';
import { withNavigate } from '../router/custom/withNavigate';
import alert from '../components/ui/Alert';
import LoadingRequest from '../components/ui/loading';
import httpRequest from '../plugin/httpRequest';

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingRequest: false
    }

    this.registerFields = [
      {
        name: 'username',
        label: 'Username',
        type: 'text',
        required: true,
        placeholder: 'Masukkan username',
        className: 'form-input' 
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        placeholder: 'Masukkan password',
        className: 'form-input'
      },
      {
        name: 'confirmPassword',
        label: 'Confirm Password',
        type: 'confirmPassword',
        required: true,
        placeholder: 'Masukkan password',
        className: 'form-input'
      },
      {
        name: 'initialName',
        label: 'Initial Name',
        type: 'text',
        placeholder: 'Masukkan initial name',
        className: 'form-input'
      },
      {
        name: 'avatar',
        label: 'Avatar',
        type: 'file',
        accept: 'image/*',
        className: 'form-input'
      }
    ]
  }

  handleSubmit = async (formData) => {
    this.setState({ loadingRequest: true });
    try {
      await httpRequest(process.env.REACT_APP_BASE_URL, 'auth/register', 'POST', {
        values: formData
      });

      this.setState({ loadingRequest: false });
      alert('Register berhasil', 'Informasi');
      this.props.navigate('/login');
    } catch (err) {
      this.setState({ loadingRequest: false });
      alert('Register gagal: ' + err.response.data.message, 'Informasi');
    }
  };

  renderFooter = () => {
    return (
      <div className='text-center mt-4'>
        <p>Sudah punya akun? <Link to="/login" className='text-blue-600'>Login</Link></p>
      </div>
    )
  }

  render() {
    const { loadingRequest } = this.state
    return (
      <div className="w-screen h-screen bg-gradient-to-r from-cyan-500 to-blue-500">
        <div className='container mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center'>
          <div className='lg:w-[35%] p-4 border-2 rounded-2xl bg-white'>
            <h2 className='main-title text-center'>Welcome to Zarrion<i className="text-cyan-500">F</i></h2>
            <Form
              dataField={this.registerFields}
              onSubmit={this.handleSubmit}
              submitButtonText="Daftar"
              renderFooter={this.renderFooter}
            />
          </div>
        </div>
        {loadingRequest && <LoadingRequest />}
      </div>
    );
  }
}

export default withNavigate(Register);