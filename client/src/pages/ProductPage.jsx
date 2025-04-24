import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/NavBar';
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/";
// Simple SVG icon components to replace Lucide icons
const IconShoppingCart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="21" r="1"></circle>
    <circle cx="19" cy="21" r="1"></circle>
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
  </svg>
);

const IconStar = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const IconArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"></path>
    <path d="M19 12H5"></path>
  </svg>
);

const IconTruck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 17h4V5H2v12h3"></path>
    <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L16 6h-4v11h3"></path>
    <circle cx="7.5" cy="17.5" r="2.5"></circle>
    <circle cx="17.5" cy="17.5" r="2.5"></circle>
  </svg>
);

const IconShield = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const IconRefreshCw = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2v6h-6"></path>
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
    <path d="M3 22v-6h6"></path>
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
  </svg>
);

// Modified IconHeart with animation capabilities
const IconHeart = ({ isAnimating }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill={isAnimating ? "currentColor" : "none"} 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={`transition-transform duration-300 ${isAnimating ? 'scale-125' : 'scale-100'}`}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
  </svg>
);

// This component accepts props instead of using react-router and API calls
const ProductPage = () => {
  const { id: productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("black");
  const { addToCart, cartItems } = useCart();
  const [quantity, setQuantity] = useState(1);
  const { addToWishlist } = useWishlist();
  const navigate = useNavigate();
  // Add state for heart animation
  const [heartAnimating, setHeartAnimating] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/cart"); // or "/checkout" if you have a dedicated page
  };

  const handleAddToWishlist = () => {
    // Trigger heart animation
    setHeartAnimating(true);
    
    // Reset animation after 1 second
    setTimeout(() => {
      setHeartAnimating(false);
    }, 1000);

    // Add to wishlist
    addToWishlist(product);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/products/${productId}`); 
        setProduct(res.data); 
        const colorOptions = ["brown", "black", "red", "blue", "green", "purple", "pink", "navy", "tan"];
        const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
        setSelectedColor( res.data.colors?.[0] || res.data.colors?.[0] || randomColor);
      } catch (err) {
        setError("Failed to load product"); 
      } finally {
        setLoading(false); 
      }
    };


    fetchProduct(); 
  }, [productId]); 
  
    const colorPalettes = useMemo(() => ({
        brown: {
            primary: "bg-amber-900",
            primaryHover: "hover:bg-amber-800",
            secondary: "bg-amber-50",
            light: "bg-amber-100",
            text: "text-amber-900",
            accent: "bg-amber-500",
            gradient: "from-amber-50 to-amber-100",
            border: "border-amber-200"
        },
        black: {
            primary: "bg-gray-900",
            primaryHover: "hover:bg-gray-800",
            secondary: "bg-gray-50",
            light: "bg-gray-100",
            text: "text-gray-900",
            accent: "bg-gray-500",
            gradient: "from-gray-50 to-gray-100",
            border: "border-gray-200"
        },
        red: {
            primary: "bg-red-700",
            primaryHover: "hover:bg-red-600",
            secondary: "bg-red-50",
            light: "bg-red-100",
            text: "text-red-700",
            accent: "bg-red-500",
            gradient: "from-red-50 to-red-100",
            border: "border-red-200"
        },
        blue: {
            primary: "bg-blue-700",
            primaryHover: "hover:bg-blue-600",
            secondary: "bg-blue-50",
            light: "bg-blue-100",
            text: "text-blue-700",
            accent: "bg-blue-500",
            gradient: "from-blue-50 to-blue-100",
            border: "border-blue-200"
        },
        green: {
            primary: "bg-green-700",
            primaryHover: "hover:bg-green-600",
            secondary: "bg-green-50",
            light: "bg-green-100",
            text: "text-green-700",
            accent: "bg-green-500",
            gradient: "from-green-50 to-green-100",
            border: "border-green-200"
        },
        purple: {
            primary: "bg-purple-700",
            primaryHover: "hover:bg-purple-600",
            secondary: "bg-purple-50",
            light: "bg-purple-100",
            text: "text-purple-700",
            accent: "bg-purple-500",
            gradient: "from-purple-50 to-purple-100",
            border: "border-purple-200"
        },
        pink: {
            primary: "bg-pink-600",
            primaryHover: "hover:bg-pink-500",
            secondary: "bg-pink-50",
            light: "bg-pink-100",
            text: "text-pink-600",
            accent: "bg-pink-400",
            gradient: "from-pink-50 to-pink-100",
            border: "border-pink-200"
        },
        navy: {
            primary: "bg-indigo-900",
            primaryHover: "hover:bg-indigo-800",
            secondary: "bg-indigo-50",
            light: "bg-indigo-100",
            text: "text-indigo-900",
            accent: "bg-indigo-500",
            gradient: "from-indigo-50 to-indigo-100",
            border: "border-indigo-200"
        },
        tan: {
            primary: "bg-yellow-800",
            primaryHover: "hover:bg-yellow-700",
            secondary: "bg-yellow-50",
            light: "bg-yellow-100",
            text: "text-yellow-800",
            accent: "bg-yellow-600",
            gradient: "from-yellow-50 to-yellow-100",
            border: "border-yellow-200"
        },
        // Default fallback
        default: {
            primary: "bg-gray-900",
            primaryHover: "hover:bg-gray-800",
            secondary: "bg-gray-50",
            light: "bg-gray-100",
            text: "text-gray-900",
            accent: "bg-gray-500",
            gradient: "from-gray-50 to-gray-100",
            border: "border-gray-200"
        }
    }), []);

    // Get current color palette based on selected color
    const palette = colorPalettes[selectedColor] || colorPalettes.default;

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="p-8 text-center">
                <div className={`w-16 h-16 border-4 ${palette.border} border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
                <p className={`${palette.text} font-medium`}>Loading product details...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="p-8 text-center bg-white shadow-lg rounded-lg max-w-md">
                <div className="text-red-500 text-6xl mb-4">!</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
                <p className="text-red-500 mb-4">{error}</p>
                <button className={`flex items-center justify-center space-x-2 mx-auto px-4 py-2 ${palette.primary} text-white rounded-lg ${palette.primaryHover} transition`}>
                    <span className="mr-2"><IconArrowLeft /></span>
                    <span>Go Back</span>
                </button>
            </div>
        </div>
    );

    // Use the provided images or placeholders
    const productImages = product.images?.length ? product.images : [
        "/api/placeholder/600/600",
        "/api/placeholder/600/600"
    ];

    // Calculate discount price if available
    const originalPrice = product.discount > 0 
        ? (product.price / (1 - product.discount / 100)).toFixed(2)
        : null;

    // Available colors (could come from product data)
    const availableColors = product.colors || ["brown", "black", "tan", "navy"];

    // Color display names for better UI
    const colorNames = {
        brown: "Brown",
        black: "Black",
        tan: "Tan",
        navy: "Navy Blue",
        red: "Red",
        blue: "Blue",
        green: "Green",
        purple: "Purple",
        pink: "Pink"
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar fixed={true} cartBtn={true} />
        <div className={`bg-gradient-to-br ${palette.gradient} min-h-screen py-12 transition-colors duration-300`}>
            <div className="max-w-6xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="mb-6 flex items-center text-sm text-gray-500">
                    <span className={`hover:${palette.text} cursor-pointer`}>Home</span>
                    <span className="mx-2">›</span>
                    <span className={`hover:${palette.text} cursor-pointer`}>{product.category}</span>
                    <span className="mx-2">›</span>
                    <span className={`${palette.text} font-medium`}>{product.name}</span>
                </div>
                
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-0">
                        {/* Product Images */}
                        <div className="p-6 border-r border-gray-100">
                            <div className={`aspect-square overflow-hidden rounded-lg mb-4 ${palette.secondary}`}>
                                <img
                                    src={productImages[selectedImage]}
                                    alt={product.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            
                            {/* Thumbnails */}
                            <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
                                {productImages.map((img, index) => (
                                    <div 
                                        key={index} 
                                        className={`w-20 h-20 rounded-md cursor-pointer border-2 ${selectedImage === index ? palette.border : 'border-gray-200'}`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <img 
                                            src={img} 
                                            alt={`${product.name} thumbnail ${index + 1}`} 
                                            className="w-full h-full object-cover rounded-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-8">
                            <div className="flex items-center mb-2">
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">In Stock</span>
                                <div className="flex items-center ml-auto">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={i < 4 ? "text-amber-400" : "text-gray-300"}>
                                                <IconStar filled={i < 4} />
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-500 ml-1">(7)</span>
                                </div>
                            </div>

                            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                            
                            {/* Price */}
                            <div className="mt-2 mb-6">
                                <div className="flex items-baseline">
                                    <span className={`text-3xl font-bold ${palette.text}`}>₹{product.price}</span>
                                    {originalPrice && (
                                        <span className="text-lg text-gray-500 line-through ml-2">
                                            ₹{originalPrice}
                                        </span>
                                    )}
                                    {product.discount > 0 && (
                                        <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded">
                                            {product.discount}% OFF
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
                            </div>

                            {/* Color Selection
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Color: {colorNames[selectedColor] || selectedColor}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {availableColors.map((color) => (
                                        <button
                                            key={color}
                                            className={`w-10 h-10 rounded-full ${colorPalettes[color]?.primary || 'bg-gray-500'} ${selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-800' : ''}`}
                                            onClick={() => setSelectedColor(color)}
                                            aria-label={`Select ${colorNames[color] || color} color`}
                                        />
                                    ))}
                                </div>
                            </div> */}

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
                                <p className="text-gray-600">{product.description}</p>
                            </div>

                            {/* Details */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Details</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-sm">
                                        <span className="text-gray-500">Category:</span>
                                        <span className="text-gray-800 ml-1 font-medium">{product.category}</span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-gray-500">Type:</span>
                                        <span className="text-gray-800 ml-1 font-medium">{product.productType}</span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-gray-500">Seller:</span>
                                        <span className="text-gray-800 ml-1 font-medium">{product.seller?.name || "Unknown"}</span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-gray-500">Location:</span>
                                        <span className="text-gray-800 ml-1 font-medium">{product.location}</span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-gray-500">Available:</span>
                                        <span className="text-gray-800 ml-1 font-medium">{product.quantityAvailable} units</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 space-y-4">
                                <button className={`w-full py-3 px-8 ${palette.primary} ${palette.primaryHover} text-white font-medium rounded-lg flex items-center justify-center transition-colors`} onClick={handleAddToCart}>
                                    <span className="mr-2"><IconShoppingCart /></span>
                                    Add to Cart
                                </button>
                                <div className="grid grid-cols-5 gap-2">
                                    <button className={`col-span-4 py-3 px-8 border ${palette.border} ${palette.text} font-medium rounded-lg hover:${palette.secondary} transition-colors`} onClick={handleBuyNow}>
                                        Buy Now
                                    </button>
                                    <button
                                        className={`flex items-center justify-center border ${palette.border} ${palette.text} rounded-lg hover:${palette.secondary} transition-colors`}
                                        onClick={handleAddToWishlist}
                                        aria-label="Add to wishlist"
                                    >
                                        <IconHeart isAnimating={heartAnimating} />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 grid grid-cols-3 gap-2 border-t border-gray-100 pt-6">
                                <div className="flex flex-col items-center text-center p-2">
                                    <span className={`${palette.text} mb-2`}><IconTruck /></span>
                                    <span className="text-xs text-gray-600">Free Shipping</span>
                                </div>
                                <div className="flex flex-col items-center text-center p-2">
                                    <span className={`${palette.text} mb-2`}><IconShield /></span>
                                    <span className="text-xs text-gray-600">Secure Payment</span>
                                </div>
                                <div className="flex flex-col items-center text-center p-2">
                                    <span className={`${palette.text} mb-2`}><IconRefreshCw /></span>
                                    <span className="text-xs text-gray-600">Easy Returns</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default ProductPage;