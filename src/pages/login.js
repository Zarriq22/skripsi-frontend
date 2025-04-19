import { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from '../components/ui/Form';
import { withNavigate } from '../router/custom/withNavigate';
import httpRequest from '../plugin/httpRequest';

class Login extends Component {
  constructor (props) {
    super (props)

    this.loginFields = [
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
      }
    ];
  }

  handleSubmit = async (formData) => {
    if (formData) {
      try {
        const res = await httpRequest(process.env.REACT_APP_BASE_URL, 'auth/login', 'POST', {
          values: formData
        });

        localStorage.setItem('userData', JSON.stringify(res));

        if (res) {
          const role = res.user.role;
          this.props.navigate(role === 'admin' ? '/admin-dashboard' : '/user-dashboard');
        }
      } catch (err) {
        console.log(err)
        console.error("Full Error Object:", err); // <== Tambahan ini bro
        alert('Login gagal: ' + err.response?.data?.message || 'Error');
      }
    }
  };

  renderFooter = () => {
    return (
      <div className='text-center mt-4'>
        <p>Belum punya akun? <Link to="/register" className='text-blue-600'>Register</Link></p>
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
              dataField={this.loginFields}
              onSubmit={this.handleSubmit}
              // formTitle="Welcome to ZarShop!"
              submitButtonText="Login"
              renderFooter={this.renderFooter}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withNavigate(Login);