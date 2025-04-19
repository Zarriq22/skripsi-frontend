import { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Form from '../components/ui/Form';
import { withNavigate } from '../router/custom/withNavigate';

class Register extends Component {
  constructor(props) {
    super(props);

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
        type: 'password',
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
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('Register berhasil!');
      this.props.navigate('/');
    } catch (err) {
      alert('Register gagal: ' + err.response.data.message);
    }
  };

  renderFooter = () => {
    return (
      <div className='text-center mt-4'>
        <p>Sudah punya akun? <Link to="/" className='text-blue-600'>Login</Link></p>
      </div>
    )
  }

  render() {
    return (
      <div className="w-screen h-screen bg-gradient-to-r from-cyan-500 to-blue-500">
        <div className='container mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center'>
          <div className='w-[30%] p-4 border-2 rounded-2xl bg-white'>
            <h2 className='main-title text-center'>Welcome to ZarShop!</h2>
            <Form
              dataField={this.registerFields}
              onSubmit={this.handleSubmit}
              // formTitle="Welcome to ZarShop!"
              submitButtonText="Daftar"
              renderFooter={this.renderFooter}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withNavigate(Register);