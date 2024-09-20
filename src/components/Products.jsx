import React, { useEffect, useState } from 'react';
import { auth, db } from "../config/FireBaseConfig";
import { getDocs, collection, addDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { storage } from '../config/FireBaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        productName: '',
        productDesc: '',
        Sizes: [],
        category: '',
        Price: 0,
        imageUrl: '',
        AddedBy:''
    });
    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const name = user.displayName || user.email.split('@')[0];
            setFormData((prevData) => ({ ...prevData, AddedBy: name })); 
        }
    }, []);

    const productsCollectionRef = collection(db, "Products");
    const categoryCollectionRef = collection(db, "Category");

    const uploadImage = async (file) => {
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = await uploadImage(file);
            setFormData((prevData) => ({ ...prevData, imageUrl: url }));
        }
    };

    const getProducts = async () => {
        try {
            setLoading(true);
            const data = await getDocs(productsCollectionRef);
            const filteredData = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setProducts(filteredData);
        } catch (err) {
            toast.error("Error fetching products");
        } finally {
            setLoading(false);
        }
    };

    const getCategory = async () => {
        try {
            setLoading(true);
            const data = await getDocs(categoryCollectionRef);
            const filteredData = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setCategories(filteredData);
        } catch (err) {
            toast.error("Error fetching categories");
        } finally {
            setLoading(false);
        }
    };

    const addProduct = async () => {
        try {
            await addDoc(productsCollectionRef, formData);
            toast.success("Product added successfully");
            getProducts();
            resetForm();
        } catch (err) {
            console.error("Error adding product:", err);
            toast.error("Error adding product");
        }
    };

    const resetForm = () => {
        setFormData({
            productName: '',
            productDesc: '',
            Sizes: [],
            category: '',
            Price: 0,
            imageUrl: '',
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSizeChange = (e) => {
        const { value } = e.target;
        setFormData(prevData => {
            const updatedSizes = prevData.Sizes.includes(value)
                ? prevData.Sizes.filter(size => size !== value)
                : [...prevData.Sizes, value];
            return { ...prevData, Sizes: updatedSizes };
        });
    };

    useEffect(() => {
        getProducts();
        getCategory();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.imageUrl) {
            await addProduct();
        } else {
            toast.error("Please upload an image before adding the product.");
        }
    };

    return (
        <div className="mx-auto p-6">
            <h2 className="text-2xl font-bold text-center mb-4">Products List</h2>
            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : (
                <div className="flex flex-wrap gap-6 justify-center">
    {products.map(product => (
        <div key={product.id} className="bg-white w-80 h-112 shadow-lg rounded-lg overflow-hidden border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl">
            <img src={product.imageUrl} alt={product.productName} className="w-full relative  h-66 object-cover object-center transition-transform transform hover:scale-110" />
            <div className="p-4">
                <h1 className="text-xl font-semibold mb-2">{product.productName}</h1>
                <p className=" text-sm text-gray-700 font-medium">Price: ${product.Price}</p>
                <p className=" text-sm text-gray-700">Sizes: {product.Sizes?.join(", ") || 'N/A'}</p>
                <p className=" text-sm text-gray-700">Category: {product.category}</p>
                <p className=" text-based text-gray-900">Added By: {product.AddedBy}</p>
            </div>
        </div>
    ))}
</div>
            )}

            <h2 className="text-2xl font-bold mt-8 mb-4">Add New Product</h2>
            <form className="bg-white shadow-md rounded-lg p-6 space-y-4 border border-gray-200" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="productName"
                    placeholder="Product Name"
                    value={formData.productName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    name="productDesc"
                    placeholder="Product Description"
                    value={formData.productDesc}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="space-y-2">
                    <p className="text-gray-700">Sizes:</p>
                    <div className="flex space-x-4">
                        {["S", "M", "L", "XL"].map(size => (
                            <label key={size} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    value={size}
                                    onChange={handleSizeChange}
                                    checked={formData.Sizes.includes(size)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span>{size}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.Type}>
                            {category.Type}
                        </option>
                    ))}
                </select>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full"
                />
                <input
                    type="number"
                    name="Price"
                    placeholder="Price"
                    value={formData.Price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                >
                    Add Product
                </button>
            </form>
        </div>
    );
};

export default Products;
