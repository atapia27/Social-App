import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { registerUser } from '../redux/slices/authSlice';
import { AppDispatch } from '../redux/store';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [icon, setIcon] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const icons = [
    { name: "Bear", image: "/Icons/Bear.png" },
    { name: "Cat", image: "/Icons/Cat.png" },
    { name: "Cheeta", image: "/Icons/Cheeta.png" },
    { name: "Cow", image: "/Icons/Cow.png" },
    { name: "Crocodile", image: "/Icons/Crocodile.png" },
    { name: "Dog", image: "/Icons/Dog.png" },
    { name: "Hamster", image: "/Icons/Hamster.png" },
    { name: "Jaguar", image: "/Icons/Jaguar.png" },
    { name: "Penguin", image: "/Icons/Penguin.png" },
    { name: "Sloth", image: "/Icons/Sloth.png" },
    { name: "Turtle", image: "/Icons/Turtle.png" },
    { name: "Walrus", image: "/Icons/Walrus.png" }, 
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(registerUser(email, username, icon)).then(() => {
      router.push('/'); // Redirect to home or another page upon successful registration
    }).catch((error) => {
      console.error('Registration failed', error);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {icons.map((iconOption) => (
            <div key={iconOption.name} className={`icon-option p-2 border-2 ${icon === iconOption.name ? 'border-blue-500' : 'border-gray-200'} rounded-lg cursor-pointer hover:border-gray-400 transform transition duration-200`} onClick={() => setIcon(iconOption.name)}>
              <img src={iconOption.image} alt={iconOption.name} className="h-12 w-12" />
              <span className="text-xs text-center">{iconOption.name}</span>
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
