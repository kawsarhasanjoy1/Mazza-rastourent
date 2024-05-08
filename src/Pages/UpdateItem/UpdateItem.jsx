import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AuthContext } from '../../Provider/AuthProvider';
import ConvertLink from '../../Hooks/Image/ConvertLink';
import { useLoaderData, useNavigate } from 'react-router-dom';
import useUpdateProduct from '../../Hooks/useUpdateProduct/useUpdateProduct';

const UpdateItem = () => {
    const [option, setOption] = useState('')
    const { user } = useContext(AuthContext)
    const [selectedFile, setSelectedFile] = useState(null);
    const singleProduct = useLoaderData()
    const singleId = singleProduct?._id
    const navigate = useNavigate()
    useEffect(() => {
        setOption(singleProduct?.category)
    }, [])

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const handleChange = (e) => {
        setOption(e.target.value)

    };


    const HandleToPost = (e) => {
        e.preventDefault()
        const form = e.target
        const category = option;
        const name = form.name.value
        const email = form.email.value;
        const price = form.price.value;
        const photo = form.file.files[0];
        const description = form.description.value
        ConvertLink(photo)
            .then(data => {
                if (data.success) {
                    const image = data?.data?.display_url;
                    const host = { name: user?.displayName, photo: user?.photoURL }
                    const product = { category, name, email, price, photo: image, description, host: host }

                    useUpdateProduct(singleId, product)
                        .then(data => {
                            toast.success('item-updated successful')
                            navigate('/dashboard/manage-all-item')
                        }).catch(error => {
                            const err = error.message
                            toast.error(err)
                        })
                }
            })
    }


    return (
        <form onSubmit={HandleToPost}>
            <p className=' text-2xl font-bold uppercase mb-4'>Update-item</p>
            <div className=' space-y-6'>
                <input type="text" defaultValue={singleProduct?.name} name='name' placeholder="Item name" className="bg-transparent text-black input w-full border border-green-300 " />

                <div className="mb-4">
                    <label htmlFor="selectedOption" className="block text-sm font-medium text-gray-700">
                        Select an Option:
                    </label>
                    <select
                        id="selectedOption"
                        name="selectedOption"
                        onChange={handleChange}
                        defaultValue={singleProduct?.category}
                        className="mt-1 block w-full py-3 rounded-md px-3 border border-green-300 bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option disabled defaultValue={'select category'}>select category</option>
                        <option value="Pizza">Pizza</option>
                        <option value="burger">Burger</option>
                        <option value="salad">Salad</option>
                        <option value="drink">Drink</option>
                    </select>
                </div>
                <input type="email" name='email' defaultValue={singleProduct?.email} placeholder="Email Address" className="bg-transparent text-black input w-full border border-green-300 " />
                <input type="text" name='price' defaultValue={singleProduct?.price} placeholder="Product Price" className="bg-transparent text-black input w-full border border-green-300 " />
                <div className="container mx-auto mt-4">
                    <div className="mb-4">
                        <div className=' border-dotted border-2 pb-2 pt-1 border-green-300 rounded-md px-5'>
                            <input
                                type="file"
                                name='file'
                                id="fileInput"
                                accept=".jpg, .jpeg, .png, .gif, .pdf" // Specify allowed file types
                                onChange={handleFileChange}
                                className="mt-1 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm  w-full "
                            />
                        </div>
                    </div>
                </div>
                <input type="text" defaultValue={singleProduct?.description} name='description' placeholder="Description" className="bg-transparent text-black input w-full border border-green-300 py-12 rounded-[20px]" />
                <button className=' bg-green-400 px-6 py-2  hover:bg-green-600 text-white uppercase font-bold '>Update-Item</button>
            </div>
        </form>
    );
};

export default UpdateItem;