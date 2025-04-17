import { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Form from '../components/ui/Form';
import { withNavigate } from '../router/custom/withNavigate';

// function Register() {
//   const [form, setForm] = useState({ username: '', password: '', inisiaisAdmin: false });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('http://localhost:5000/api/auth/register', form);
//       alert('Register berhasil!');
//     } catch (err) {
//       alert('Register gagal: ' + err.response.data.message);
//     }
//   };

//   return (
//     <div className="w-screen h-screen bg-gradient-to-r from-cyan-500 to-blue-500">
//       <div className='container mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center'>
//         <div className='w-[30%] p-4 border-2 rounded-2xl'>
//           <form>
//             <h2 className='text-2xl font-bold mb-4 text-center mb-4'>Welcome to ZarShop!</h2>
//             <div className='flex flex-col gap-2'>
//               <div className='flex items-center'>
//                 <div className='w-[20%] flex justify-between'>
//                   <label class="block text-sm font-medium text-black w-1/2">Username</label>
//                   <span>:</span>
//                 </div>
//                 <div>
//                   <input type="text" placeholder="Username" className='ml-4 form-input' onChange={e => setForm({ ...form, username: e.target.value })}/>
//                 </div>
//               </div>
//               <div className='flex items-center'>
//                 <div className='w-[20%] flex justify-between'>
//                   <label class="block text-sm font-medium text-black">Password</label>
//                   <span>:</span>
//                 </div>
//                 <div>
//                   <input type="password" placeholder="Password" className='ml-4 form-input' onChange={e => setForm({ ...form, password: e.target.value })} />
//                 </div>
//               </div>
//             </div>
//             <div className='flex flex-col gap-2 align-middle items-center mt-4'>
//               <div>
//                 <button type="submit" className='btn btn-danger' onClick={handleSubmit}>Daftar</button>
//                 <Button 
//                   text="Daftar"
//                   cssClass="btn btn-primary"
//                   onClick={handleSubmit}
//                 />
//               </div>
//               <div>
//                 <p>Sudah Punya Akun? <Link to="/" className='text-white'>Login</Link></p>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

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
          <div className='w-[30%] p-4 border-2 rounded-2xl'>
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