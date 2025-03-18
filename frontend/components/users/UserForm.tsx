'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { User } from '@/store/auth';

export default function UserForm({ user, isEdit = false }: { user?: User; isEdit?: boolean }) {
  const [formData, setFormData] = useState<User>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: 'User',
    status: 'Active',
    password: '',
    address: {
      street: '',
      number: '',
      city: '',
      postalCode: '',
    },
    profilePicture: '',
  });

  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const mapRef = useRef<HTMLDivElement>(null); 
  const router = useRouter();

  
  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        address: user.address || {
          street: '',
          number: '',
          city: '',
          postalCode: '',
        },
      });
    }
  }, [user]);

  
  useEffect(() => {
    if (typeof window !== 'undefined' && window.google && mapRef.current) {
      
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: { lat: 23.634, lng: -102.552 },
        zoom: 8,
      });
      setMap(mapInstance);

      
      const markerInstance = new google.maps.Marker({
        map: mapInstance,
        position: { lat: 23.634, lng: -102.552 },
      });
      setMarker(markerInstance);

      
      const input = document.getElementById('autocomplete') as HTMLInputElement;
      const autocompleteInstance = new google.maps.places.Autocomplete(input, {
        types: ['address'],
      });

      autocompleteInstance.addListener('place_changed', () => {
        const place = autocompleteInstance.getPlace();
        if (!place.geometry || !place.geometry.location) {
          console.log('No se encontró la ubicación');
          return;
        }

        
        mapInstance.setCenter(place.geometry.location);
        markerInstance.setPosition(place.geometry.location);

        
        const addressComponents = place.address_components;
        if (addressComponents) {
          const street = addressComponents.find((component) =>
            component.types.includes('route')
          )?.long_name;
          const number = addressComponents.find((component) =>
            component.types.includes('street_number')
          )?.long_name;
          const city = addressComponents.find((component) =>
            component.types.includes('locality')
          )?.long_name;
          const postalCode = addressComponents.find((component) =>
            component.types.includes('postal_code')
          )?.long_name;
          const country = addressComponents.find((component) =>
            component.types.includes('country')
          )?.long_name;

          setFormData((prevData) => ({
            ...prevData,
            address: {
              ...prevData.address,
              street: street || '',
              number: number || '',
              city: city || '',
              postalCode: postalCode || '',
            },
          }));
        }
      });

      setAutocomplete(autocompleteInstance);
    }
  }, []);

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [name]: value,
      },
    });
  };

  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          profilePicture: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = isEdit ? `http://localhost:4000/users/${user?.id}` : 'http://localhost:4000/users';
      const method = isEdit ? 'PUT' : 'POST';
      const token = localStorage.getItem('token');

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        console.log('Error saving user');
      }
    } catch (error) {
      console.error('Request failed', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyCkG631siR6mHCPRlNxmTbCeVrplnbATbE&libraries=places`}
        strategy="afterInteractive"
      />
      <h2 className="text-2xl font-bold mb-6">{isEdit ? 'Edit User' : 'Create User'}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">

        {formData.profilePicture && (
    <div className="flex justify-center">
      <img
        src={formData.profilePicture}
        alt="Profile Picture"
        className="h-32 w-32 rounded-full object-cover"
      />
    </div>
  )}

          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          {!isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required={!isEdit}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <input
              type="file"
              name="profilePicture"
              onChange={handleFileChange}
              accept=".jpg,.png"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-700">Address</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Autocomplete Address</label>
                <input
                  id="autocomplete"
                  type="text"
                  placeholder="Search address..."
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Street</label>
                <input
                  type="text"
                  name="street"
                  value={formData.address.street}
                  onChange={handleAddressChange}
                  placeholder="Street"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Number</label>
                <input
                  type="text"
                  name="number"
                  value={formData.address.number}
                  onChange={handleAddressChange}
                  placeholder="Number"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.address.city}
                  onChange={handleAddressChange}
                  placeholder="City"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.address.postalCode}
                  onChange={handleAddressChange}
                  placeholder="Postal Code"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
             
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700">Map</h3>
            <div ref={mapRef} className="h-64 w-full rounded-md shadow-sm"></div>
          </div>
        </div>


        <div className="col-span-full flex justify-between">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {isEdit ? 'Update User' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
}