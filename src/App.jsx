import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Buffer } from 'buffer';


const App = () => {
  const API_URL = "https://upoad-image-db.vercel.app/api/product";

  const [form, setForm] = useState({
    prd_name: '',
    prd_price: 0, // Default price set to 0
    prd_desc: '',
    image: null,
    preview: ''
  });
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      const updatprods = response.data.map((product) => {
        if (product.image && product.image.data) {
          // Convert buffer to Base64
          const base64Image = `data:image/jpeg;base64,${Buffer.from(
            product.image.data
          ).toString('base64')}`;
          return { ...product, image: base64Image };
        }
        return product;
    });
      setProducts(updatprods);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Create or Update a product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('prd_name', form.prd_name);
      formData.append('prd_price', form.prd_price);
      formData.append('prd_desc', form.prd_desc);
      if (form.image) {
        formData.append('image', form.image);
      }

      if (editingId) {
        // Update product
        await axios.put(`${API_URL}/${editingId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setEditingId(null);
      } else {
        // Create product
        await axios.post(API_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      // Reset form and fetch products after submission
      setForm({ prd_name: '', prd_price: 0, prd_desc: '', image: null, preview: '' });
      fetchProducts();
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error.message);
    }
  };

  // Delete a product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Handle file changes (for image preview)
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setForm({ ...form, image: file, preview: reader.result });
      };

      reader.readAsDataURL(file); // Convert file to Base64 for preview
    }
  };

  // Prefill form for editing
  const editProduct = (product) => {
    setForm({
      prd_name: product.prd_name,
      prd_price: product.prd_price,
      prd_desc: product.prd_desc,
      image: null, // Reset image for editing
      preview: product.image, // Use existing image URL
    });
    setEditingId(product._id);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Product Management</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Product Name"
          value={form.prd_name}
          onChange={(e) => setForm({ ...form, prd_name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={form.prd_price}
          onChange={(e) => setForm({ ...form, prd_price: e.target.value })}
          required
        />
        <textarea
          type="text"
          placeholder="Description"
          value={form.prd_desc}
          onChange={(e) => setForm({ ...form, prd_desc: e.target.value })}
          required
        />
        <input type="file" onChange={handleFileChange} />
        {form.preview && (
          <img
            src={form.preview}
            alt="Preview"
            style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px' }}
          />
        )}
        <button type="submit">{editingId ? 'Update Product' : 'Create Product'}</button>
      </form>

      {/* Product Cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {products.map((product) => (
          console.log('image checking',product),
          <div
            key={product._id}
            style={{
              border: '1px solid #ccc',
              padding: '16px',
              borderRadius: '8px',
              maxWidth: '200px',
            }}
          >
            <img
              src={product.image}
              alt={product.prd_name}
              style={{ width: '100%', height: '100px', objectFit: 'cover' }}
            />
            <h3>{product.prd_name}</h3>
            <p>Price: ${product.prd_price}</p>
            <p>{product.prd_desc}</p>
            <p>Date: {dayjs(product.uploadedAt).format('DD/MM/YYYY')}</p>
            <button onClick={() => editProduct(product)}>Edit</button>
            <button onClick={() => deleteProduct(product._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;






// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import dayjs from 'dayjs';

// const App = () => {
//   const API_URL = "https://upoad-image-db.vercel.app/api/product";

//   const [form, setForm] = useState({ prd_name: '', prd_price:Number, prd_desc: '', image: null, preview: '' });
//   const [products, setProducts] = useState([]);
//   const [editingId, setEditingId] = useState(null);

//   // Fetch all products
//   const fetchProducts = async () => {
//     try {
//       const response = await axios.get(API_URL);
//       const updatprods = response.data.map(product => ({
//         ...product,
//         image: product.image || '', // Ensure image field exists
//       }));
//       setProducts(updatprods);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   // Create or Update a product
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       formData.append('prd_name', form.prd_name);
//       formData.append('prd_price', form.prd_price);
//       formData.append('prd_desc', form.prd_desc);
//       if (form.image) {
//         formData.append('image', form.image);
//       }

//       if (editingId) {
//         // Update product
//         await axios.put(`${API_URL}/${editingId}`, formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//         setEditingId(null);
//       } else {
//         // Create product
//         await axios.post(API_URL, formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//       }

//       setForm({ prd_name: '', prd_price:Number, prd_desc: '', image: null, preview: '' });
//       fetchProducts();
//     } catch (error) {
//       console.error("Error submitting form:", error.response?.data || error.message);
//     }
//   };

//   // Delete a product
//   const deleteProduct = async (id) => {
//     try {
//       await axios.delete(`${API_URL}/${id}`);
//       setProducts(products.filter((p) => p._id !== id));
//     } catch (error) {
//       console.error("Error deleting product:", error);
//     }
//   };

//   // Handle file changes
//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       const reader = new FileReader();

//       reader.onloadend = () => {
//         setForm({ ...form, image: file, preview: reader.result });
//         console.log("form.preview", form.preview);
//       };

//       reader.readAsDataURL(file); // Convert file to Base64 for preview
//     }
//   };

//   // Prefill form for editing
//   const editProduct = (product) => {
//     setForm({
//       prd_name: product.prd_name,
//       prd_price: product.prd_price,
//       prd_desc: product.prd_desc,
//       image: null, // Reset image for editing
//       preview: product.image, // Use existing image URL
//     });
//     setEditingId(product._id);
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   return (
//     <div>
//       <h1>Product Management</h1>

//       {/* Form */}
//       <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
//         <input
//           type="text"
//           placeholder="Product prd_name"
//           value={form.prd_name}
//           onChange={(e) => setForm({ ...form, prd_name: e.target.value })}
//           required
//         />
//         <input
//           type="number"
//           placeholder="prd_price"
//           value={form.prd_price}
//           onChange={(e) => setForm({ ...form, prd_price: e.target.value })}
//           required
//         />
//         <textarea
//           type="text"
//           placeholder="prd_desc"
//           value={form.prd_desc}
//           onChange={(e) => setForm({ ...form, prd_desc: e.target.value })}
//           required
//         />
//         <input type="file" onChange={handleFileChange} />
//         {form.preview && (
//           <img
//             src={form.preview}
//             alt="Preview"
//             style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px' }}
//           />
//         )}
//         <button type="submit">{editingId ? 'Update Product' : 'Create Product'}</button>
//       </form>

//       {/* Product Cards */}
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
//         {products.map((product) => (
//           <div
//             key={product._id}
//             style={{
//               border: '1px solid #ccc',
//               padding: '16px',
//               borderRadius: '8px',
//               maxWidth: '200px',
//             }}
//           >
//             <img
//               src={product.image}
//               alt={product.prd_name}
//               style={{ width: '100%', height: '100px', objectFit: 'cover' }}
//             />
//             <h3>{product.prd_name}</h3>
//             <p>prd_price: ${product.prd_price}</p>
//             <p>{product.prd_desc}</p>
//             <p>Date: {dayjs(product.date).format('DD/MM/YYYY')}</p>
//             <button onClick={() => editProduct(product)}>Edit</button>
//             <button onClick={() => deleteProduct(product._id)}>Delete</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default App;





// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import dayjs from 'dayjs';

// const App = () => {
//   const API_URL = "https://upoad-image-db.vercel.app/api/product";

//   const [form, setForm] = useState({ prd_name: '', prd_price: '', prd_desc: '', image: '' });
//   const [products, setProducts] = useState([]);
//   const [editingId, setEditingId] = useState(null);

//   // Fetch all products
//   const fetchProducts = async () => {
//     try {
//       const response = await axios.get(API_URL);
//       // const buff= response.data.image.data;
//       // console.log("Buffer:", buff.toString('base64'));
//       setProducts(response.data);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   // Create or Update a product
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       formData.append('prd_name', form.prd_name);
//       formData.append('prd_price', form.prd_price);
//       formData.append('prd_desc', form.prd_desc);
//       const response = await axios.post('https://upoad-image-db.vercel.app/api/product', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data', // Important for file upload
//         },
//       });
  
//       console.log('Product created successfully:', response.data);
//       setForm({ prd_name: '', prd_price: '', prd_desc: '', image: '' });
//       fetchProducts(); // Refresh the product list
//     } catch (error) {
//       console.error('Error submitting form:', error.response.data);
//     }
      

//       if (editingId) {
//         // Update product
//         await axios.put(`${API_URL}/${editingId}`, form);
//         setEditingId(null);
//       } else {
      
//         // Create product
//         const response = await axios.post(API_URL, form, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         console.log("Response:", response.data);
//       }
//       // Clear form and refresh products
//       setForm({ prd_name: '', prd_price: '', prd_desc: '', image: '' });
//       fetchProducts();
//     } catch (error) {
//       console.error("Error submitting form:", error.response?.data || error.message);
//     }
//   };
  

//   // Delete a product
//   const deleteProduct = async (id) => {
//     try {
//       await axios.delete(`${API_URL}/${id}`);
//       setProducts(products.filter((p) => p._id !== id));
//     } catch (error) {
//       console.error("Error deleting product:", error);
//     }
//   };

//   // Handle file changes
//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       const reader = new FileReader();
  
//       reader.onloadend = () => {
//         setForm({ ...form, image: file, preview: reader.result }); // Store both file and preview URL
//       };
  
//       reader.readAsDataURL(file); // Convert file to Base64 for preview
//       console.log("Selected File:", file);
//     }
//   };

//   // Prefill form for editing
//   const editProduct = (product) => {
//     setForm(product);
//     setEditingId(product._id);
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   return (
//     <div>
//       <h1>Product Management</h1>

//       {/* Form */}
//       <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
//         <input
//           type="text"
//           placeholder="Product prd_name"
//           value={form.prd_name}
//           onChange={(e) => setForm({ ...form, prd_name: e.target.value })}
//           required
//         />
//         <input
//           type="number"
//           placeholder="prd_price"
//           value={form.prd_price}
//           onChange={(e) => setForm({ ...form, prd_price: e.target.value })}
//           required
//         />
//         <textarea
//           placeholder="prd_desc"
//           value={form.prd_desc}
//           onChange={(e) => setForm({ ...form, prd_desc: e.target.value })}
//           required
//         />
//         <input type="file" onChange={handleFileChange} />
//         <button type="submit">{editingId ? 'Update Product' : 'Create Product'}</button>
//       </form>

//       {/* Product Cards */}
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
//         {products.map((product) => (
//           <div
//             key={product._id}
//             style={{
//               border: '1px solid #ccc',
//               padding: '16px',
//               borderRadius: '8px',
//               maxWidth: '200px',
//             }}
//           >
//             <img
//               src={product.image}
//               alt={product.prd_name}
//               style={{ width: '100%', height: '100px', objectFit: 'cover' }}
//             />
//             <h3>{product.prd_name}</h3>
//             <p>prd_price: ${product.prd_price}</p>
//             <p>{product.prd_desc}</p>
//             <p>Date: {dayjs(product.date).format('DD/MM/YYYY')}</p>
//             <button onClick={() => editProduct(product)}>Edit</button>
//             <button onClick={() => deleteProduct(product._id)}>Delete</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default App;






// import React, { useState, useEffect } from 'react'
// import axios from 'axios'
// import dayjs from "dayjs"; // Import dayjs for timestamp formatting
// // import { response } from 'express';

// const App = () => {
//   const API_URL= "https://upoad-image-db.vercel.app/api/product";

//   const [form, setForm] = useState({ prd_name: '', prd_price: '', prd_desc: '', image: '' });
//   const [product, setProduct] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   // const [image, setImage]= useState(null);
//   // const [productprd_name, setProductprd_name]= useState("");
//   // const [prodctprd_price, setProductprd_price]= useState(""); 
//   // const [prdprd_desc, setPrdprd_desc]= useState("");

// const fetchProducts =  async() => {
//   try{ 
//     const response = await axios.post(API_URL);
//     console.log(response.data);
//     setProduct(response.data);
//     }
//     catch(error){
//       console.log("fetching error",error);

//     }
//   }

//   const creatProduct = async () => {
//     try{
//       const response = await axios.post(API_URL, {
//         productprd_name: productprd_name,
//         productprd_price: prodctprd_price,
//         productprd_desc: prdprd_desc,
//         createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"), // Use dayjs for timestamp formatting 
//         image: image, // Include the image file in the request      

//       });
//       setProduct(...product, response.data);
//       setProductprd_name("");
//       setProductprd_price("");
//       setPrdprd_desc("");
//       setImage(null);
//     }catch(error){
//       console.log("Error Creating Product",error);
//     }

//     const updateProduct = async (id)=>{
//       try{
//         const response = await axios.put(`${API_URL}/${id}`, {
//           productprd_name: productprd_name,
//         productprd_price: prodctprd_price,
//         productprd_desc: prdprd_desc,
//         createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"), // Use dayjs for timestamp formatting 
//         image: image, // Include the image file in the request 
//         });
//         setProduct(product.map((prds)=>(prds._id === id ? response.data : prds)));
//         setProductprd_name("");
//         setProductprd_price("");
//         setPrdprd_desc("");
//         setImage(null);
//       }
//       catch(error){
//         console.log("Error editing Product", error);
//       }
//     };

//     const deleteProduct = async (id) => {
//       try {
//         await axios.delete(`${API_URL}/${id}`);
//         setProduct(product.filter((prds) => prds._id !== id));
  
       
//       } catch (error) {
//         console.error("Error deleting post", error);
//       }
//     };

//    const handleFileChange =(e)=>{
//     console.log("Event:", e); // Debugging log
//     if (e.target && e.target.files && e.target.files[0]) {
//       console.log(e.target.files[0]);
//       const selectedFile = e.target.files[0];
//       console.log("Selected File:", selectedFile); // Log selected file
//     setImage(selectedFile);

//     }
//   }
//   const handleSubmit =async (e)=>{
//     e.preventDefault();
// try{
//     if (editingId) {
//       // Update product
//       await axios.put(`http://localhost:3001/products/${editingId}`, form);
//       setEditingId(null);
//     } else {
//       // Create product
//       await axios.post('http://localhost:3001/products', form);
//     }
//     setForm({ prd_name: '', prd_price: '', prd_desc: '', image: '' });
//     const response = await axios.get('http://localhost:3001/products');
//     setProduct(response.data);
//   } catch (err) {
//     console.error(err);
//   }
//   }

//   useEffect(()=>{
//     fetchProducts();
// }, []);
//   return (
//     <div>
//       <h1>Products</h1>

//       {/* Product Form */}
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Product prd_name"
//           value={form.prd_name}
//           onChange={(e) => setForm({ ...form, prd_name: e.target.value })}
//           required
//         />
//         <input
//           type="number"
//           placeholder="prd_price"
//           value={form.prd_price}
//           onChange={(e) => setForm({ ...form, prd_price: e.target.value })}
//           required
//         />
//         <textarea
//           placeholder="prd_desc"
//           value={form.prd_desc}
//           onChange={(e) => setForm({ ...form, prd_desc: e.target.value })}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Image URL"
//           value={form.image}
//           onChange={(e) => setForm({ ...form, image: e.target.value })}
//           required
//         />
//         <button type="submit">{editingId ? 'Update' : 'Create'} Product</button>
//       </form>

//       {/* Product Cards */}
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
//         {product.map((product) => (
//           <div key={product._id} style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
//             <img src={product.image} alt={product.prd_name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
//             <h3>{product.prd_name}</h3>
//             <p>prd_price: ${product.prd_price}</p>
//             <p>{product.prd_desc}</p>
//             <p>Date: {new Date(product.date).toLocaleDateString()}</p>
//             <button onClick={() => updateProduct(product)}>Edit</button>
//             <button onClick={() => deleteProduct(product._id)}>Delete</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }
// }
// export default App
