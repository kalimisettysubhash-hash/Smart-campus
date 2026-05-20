import { useState, useEffect } from "react";
import { useCart } from "../../context/useCart";
import { useAuth } from "../../context/useAuth";
import "./Marketplace.css";

function Marketplace() {
  const { currentUser } = useAuth();
  const { cartItems, addToCart, removeFromCart, clearCart, getCartItemCount, getCartTotal } = useCart();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let localData = [];
        try {
          const response = await fetch("/student-products.json");
          if (response.ok) {
            localData = await response.json();
          }
        } catch (e) {
          console.warn("Could not fetch local student-products.json", e);
        }
        
        let apiBooks = [];
        try {
          const booksRes = await fetch("https://www.googleapis.com/books/v1/volumes?q=engineering+programming+textbook&maxResults=6");
          const booksData = await booksRes.json();
          if (booksData.items) {
            apiBooks = booksData.items.map(item => ({
              id: item.id,
              title: item.volumeInfo.title,
              name: item.volumeInfo.title,
              price: item.saleInfo?.listPrice?.amount ? Math.round(item.saleInfo.listPrice.amount) : Math.floor(Math.random() * 800) + 200,
              category: "Textbooks",
              condition: "New",
              description: item.volumeInfo.description ? item.volumeInfo.description.substring(0, 120) + "..." : "Standard university textbook.",
              image: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || null,
              sellerName: "Campus Bookstore",
              isPromoted: false
            }));
          }
        } catch (e) {
          console.warn("Could not fetch books from API", e);
        }

        let apiGear = [];
        try {
          const gearRes = await fetch("https://fakestoreapi.com/products/category/electronics?limit=4");
          const gearData = await gearRes.json();
          apiGear = gearData.map(item => ({
            id: `gear-${item.id}`,
            title: item.title,
            name: item.title,
            price: Math.round(item.price * 80),
            category: "Electronics",
            condition: "Like New",
            description: item.description.substring(0, 120) + "...",
            image: item.image,
            sellerName: "Tech Hub API",
            isPromoted: true
          }));
        } catch (e) {
          console.warn("Could not fetch gear from API", e);
        }

        const mockCampusProducts = [
          {
            id: 'mock-1',
            title: 'Casio fx-991EX Scientific Calculator',
            name: 'Casio fx-991EX Scientific Calculator',
            price: 850,
            category: 'Electronics',
            condition: 'Used - Good',
            description: 'Perfect for engineering exams. Used for 2 semesters, all buttons work perfectly. Comes with cover.',
            image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=500&q=80',
            sellerName: 'Rahul (Mech)',
            isPromoted: true
          },
          {
            id: 'mock-2',
            title: 'Python & ML Tutoring - 1 Hour',
            name: 'Python & ML Tutoring - 1 Hour',
            price: 500,
            category: 'Services',
            condition: 'Digital',
            description: 'Struggling with data science assignments? I offer 1-on-1 tutoring sessions via Zoom or in the library.',
            image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&q=80',
            sellerName: 'Priya (CS Senior)',
            isPromoted: true
          },
          {
            id: 'mock-3',
            title: 'Hostel Mini-Fridge (50L)',
            name: 'Hostel Mini-Fridge (50L)',
            price: 4500,
            category: 'Electronics',
            condition: 'Used - Acceptable',
            description: 'Graduating and selling my mini fridge. Keeps drinks ice cold. Must pick up from Block B.',
            image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500&q=80',
            sellerName: 'Amit_99',
            isPromoted: false
          },
          {
            id: 'mock-4',
            title: 'Premium Drafting Kit & T-Square',
            name: 'Premium Drafting Kit & T-Square',
            price: 1200,
            category: 'Stationery',
            condition: 'Like New',
            description: 'Complete architecture/civil drafting kit. Barely used.',
            image: 'https://images.unsplash.com/photo-1603807008857-ad66b70431aa?w=500&q=80',
            sellerName: 'Sara (Arch)',
            isPromoted: false
          },
          {
            id: 'mock-5',
            title: 'Used Mountain Bike (Firefox)',
            name: 'Used Mountain Bike (Firefox)',
            price: 3200,
            category: 'Other',
            condition: 'Used - Good',
            description: 'Great for getting across the campus quickly. Just replaced the chain and brakes.',
            image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500&q=80',
            sellerName: 'Campus Wheels',
            isPromoted: true
          }
        ];

        const savedProducts = JSON.parse(localStorage.getItem('userProducts')) || [];

        setProducts([...savedProducts, ...mockCampusProducts, ...apiGear, ...apiBooks, ...localData]);
      } catch (error) {
        console.error("Error in master product fetch:", error);
        const savedProducts = JSON.parse(localStorage.getItem('userProducts')) || [];
        setProducts(savedProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Textbooks");
  const [condition, setCondition] = useState("Used - Good");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [isPromoted, setIsPromoted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSellerProduct, setSelectedSellerProduct] = useState(null);

  const searchInput = (e) => setSearchTerm(e.target.value);

  const categories = ["All", "Textbooks", "Study Materials", "Electronics", "Stationery", "Services", "Other"];

  const filteredProducts = products.filter((product) => {
    const productName = product.title || product.name || "";
    const matchesSearch = productName.toLowerCase().includes((searchTerm || "").toLowerCase());
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getConditionClass = (cond) => {
    if (!cond) return "cond-default";
    if (cond.includes("New")) return "cond-new";
    if (cond.includes("Good")) return "cond-good";
    if (cond.includes("Acceptable")) return "cond-accept";
    return "cond-other";
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!name || !price) return;

    const addToList = (imgString) => {
      const newProduct = {
        id: Date.now(),
        name,
        title: name,
        price: parseFloat(price),
        category,
        condition,
        description,
        isPromoted,
        image: imgString,
        sellerName: currentUser?.userId || "Student"
      };

      const updatedProducts = [newProduct, ...products];
      setProducts(updatedProducts);
      
      const savedProducts = JSON.parse(localStorage.getItem('userProducts')) || [];
      localStorage.setItem('userProducts', JSON.stringify([newProduct, ...savedProducts]));

      setName("");
      setPrice("");
      setCategory("Textbooks");
      setCondition("Used - Good");
      setDescription("");
      setImage(null);
      setIsPromoted(false);
      setShowModal(false);
    };

    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => addToList(reader.result);
      reader.readAsDataURL(image);
    } else {
      addToList(null);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    const order = {
      id: `ORD-${Date.now()}`,
      buyer: currentUser?.userId || "Student",
      total: getCartTotal(),
      items: cartItems,
      createdAt: new Date().toISOString(),
    };
    const orders = JSON.parse(localStorage.getItem("marketplaceOrders")) || [];

    localStorage.setItem("marketplaceOrders", JSON.stringify([order, ...orders]));
    clearCart();
    setCheckoutMessage(`Order ${order.id} placed successfully. Seller contact details are saved in your order history.`);
    setTimeout(() => setCheckoutMessage(""), 4000);
  };

  const handleMessageSeller = (product) => {
    alert(`Message request sent to ${product.sellerName || "the seller"} for "${product.title || product.name}".`);
  };

  return (
    <div className="marketplace-container">
      <div className="marketplace-content">
        
        <div className="marketplace-header">
          <div>
            <div className="marketplace-title-wrapper">
             
              <h1 className="marketplace-title">Campus Store</h1>
            </div>
            <p className="marketplace-subtitle">
              The premium marketplace for students. Buy and sell textbooks, notes, and gear directly with your peers.
            </p>
          </div>
          
          <div className="marketplace-actions">
            <div className="search-wrapper">
              <div className="search-icon-container">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search listings..."
                className="search-input"
                onChange={searchInput}
              />
            </div>
            
            <button
              onClick={() => setShowCart(true)}
              className="btn-cart"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Cart ({getCartItemCount()})
            </button>

            <button
              onClick={() => {
                setCategory("Services");
                setShowModal(true);
              }}
              className="btn-market-service"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              Market a Service
            </button>
            <button
              onClick={() => {
                setCategory("Textbooks");
                setShowModal(true);
              }}
              className="btn-sell"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Sell an Item
            </button>
          </div>
        </div>

        <div className="categories-wrapper">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`category-btn ${activeCategory === cat ? "active" : "inactive"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner-large"></div>
            <p className="loading-text">Loading inventory...</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => {
              const inCart = cartItems.find(item => item.id === product.id);
              return (
                <div key={product.id} className="product-card">
                  <div className="product-image-container">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.title || product.name} 
                        className="product-image" 
                      />
                    ) : (
                      <div className="product-image-placeholder">
                        <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="product-price-tag">
                      Rs. {product.price}
                    </div>
                    {product.condition && (
                      <div className={`product-condition-badge ${getConditionClass(product.condition)}`}>
                        {product.condition}
                      </div>
                    )}
                    {product.isPromoted && (
                      <div className="product-promoted-badge">
                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        Promoted
                      </div>
                    )}
                  </div>

                  <div className="product-details">
                    <div className="product-category">
                      {product.category || "General"}
                    </div>
                    <h3 className="product-title">
                      {product.title || product.name}
                    </h3>
                    {product.description && (
                      <p className="product-desc">
                        {product.description}
                      </p>
                    )}
                    
                    <div className="product-footer">
                      <button 
                        onClick={() => setSelectedSellerProduct(product)}
                        className="btn-details-icon"
                        title="View Details"
                      >
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                      <div className="action-buttons-group">
                        <button 
                          onClick={() => addToCart(product)}
                          className={`btn-add-cart ${inCart ? 'in-cart' : ''}`}
                        >
                          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {inCart ? `(${inCart.quantity})` : 'Cart'}
                        </button>
                        <button
                        onClick={() => {
                         addToCart(product);
                         setSelectedSellerProduct(product);
                         }}
                         className="btn-buy-now"
                        >
                        Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredProducts.length === 0 && !loading && (
          <div className="empty-state">
            <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="empty-title">No items found</h3>
            <p className="empty-desc">We couldn't find any listings matching your current search or category filter.</p>
            <button 
              onClick={() => { setSearchTerm(""); setActiveCategory("All"); }}
              className="btn-clear-filters"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {showCart && (
        <div className="modal-overlay">
          <div className="modal-backdrop" onClick={() => setShowCart(false)}></div>
          <div className="modal-content cart-modal">
            <div className="modal-header">
              <h2 className="modal-title">Your Cart</h2>
              <button onClick={() => setShowCart(false)} className="btn-close">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="cart-body">
              {checkoutMessage && (
                <div className="checkout-message">{checkoutMessage}</div>
              )}
              {cartItems.length === 0 ? (
                <p style={{textAlign: 'center', padding: '2rem', color: '#64748b'}}>Your cart is empty.</p>
              ) : (
                <div className="cart-items-list">
                  {cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-details">
                        <h4>{item.title || item.name}</h4>
                        <p>Rs. {item.price}</p>
                      </div>
                      <div className="cart-item-actions">
                        <button onClick={() => removeFromCart(item.id)} className="btn-remove">Remove</button>
                      </div>
                    </div>
                  ))}
                  <div className="cart-total" style={{marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold'}}>
                    <span>Total:</span>
                    <span>Rs. {getCartTotal()}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowCart(false)} className="btn-modal-close">Continue Shopping</button>
              {cartItems.length > 0 && (
                <button type="button" className="btn-modal-submit" onClick={handleCheckout}>
                  Place Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedSellerProduct && (
        <div className="modal-overlay">
          <div className="modal-backdrop" onClick={() => setSelectedSellerProduct(null)}></div>
          
          <div className="modal-content seller">
            <div className="modal-header">
              <h2 className="modal-title">Seller Details</h2>
              <button 
                onClick={() => setSelectedSellerProduct(null)}
                className="btn-close"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="seller-body">
              <div className="seller-profile">
                <div className="seller-avatar">
                  {(selectedSellerProduct.sellerName || "Anonymous")[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="seller-name">{selectedSellerProduct.sellerName || "Student Seller"}</h3>
                  <p className="seller-dept">Computer Science Dept.</p>
                </div>
              </div>

              <div className="seller-item-info">
                <p className="seller-item-label">Item of Interest</p>
                <p className="seller-item-title">{selectedSellerProduct.title || selectedSellerProduct.name}</p>
              </div>

              <div className="contact-options">
                <h4 style={{fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem'}}>Contact Information</h4>
                <a
                  href={`mailto:${currentUser?.email || "student@aurora.edu"}?subject=Campus Store inquiry: ${encodeURIComponent(selectedSellerProduct.title || selectedSellerProduct.name)}`}
                  className="contact-btn"
                >
                  <div className="contact-icon-wrapper">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="contact-text">Email Seller</span>
                </a>
                
                <button className="contact-btn" onClick={() => handleMessageSeller(selectedSellerProduct)}>
                  <div className="contact-icon-wrapper">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <span className="contact-text">In-App Message</span>
                </button>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setSelectedSellerProduct(null)}
                className="btn-modal-close"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-backdrop" onClick={() => setShowModal(false)}></div>
          
          <div className="modal-content add">
            <div className="modal-header">
              <h2 className="modal-title">List an Item</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="btn-close"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="add-form-body">
              <form id="add-product-form" onSubmit={handleAddProduct}>
                <div className="form-grid-layout">
                  <div className="form-full-width">
                    <label className="form-label">Listing Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Engineering Mathematics 10th Ed."
                      className="form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Price (Rs.)</label>
                    <div className="add-input-wrapper">
                      <div className="add-input-prefix">Rs.</div>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0"
                        className="form-input"
                        style={{paddingLeft: '2rem'}}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {categories.filter(c => c !== "All").map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Condition</label>
                    <select
                      className="form-select"
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                    >
                      <option value="New">New</option>
                      <option value="Like New">Like New</option>
                      <option value="Used - Good">Used - Good</option>
                      <option value="Used - Acceptable">Used - Acceptable</option>
                      <option value="Digital">Digital / Service</option>
                    </select>
                  </div>

                  <div className="form-full-width">
                    <label className="form-label">Description (Optional)</label>
                    <textarea
                      placeholder="Add details about the item's condition, features, or your service offering."
                      rows="3"
                      className="form-textarea"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="form-full-width">
                    <label className="checkbox-marketing-label">
                      <input 
                        type="checkbox" 
                        className="marketing-checkbox"
                        checked={isPromoted} 
                        onChange={(e) => setIsPromoted(e.target.checked)} 
                      />
                      <span className="checkbox-text">
                        <strong>Feature this listing</strong>
                        <span className="checkbox-subtext">Highlight this listing as a promoted student service or item.</span>
                      </span>
                    </label>
                  </div>

                  <div className="form-full-width">
                    <label className="form-label">Photos</label>
                    <div className="file-upload-area">
                      <div className="file-upload-content">
                        <svg className="file-upload-icon" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="file-upload-label">
                          <label htmlFor="file-upload" className="file-upload-link">
                            <span>Upload a file</span>
                            <input 
                              id="file-upload" 
                              type="file" 
                              className="file-upload-input" 
                              accept="image/*"
                              onChange={(e) => setImage(e.target.files[0])} 
                            />
                          </label>
                          <p>or drag and drop</p>
                        </div>
                        <p className="file-upload-hint">
                          PNG, JPG, WEBP up to 5MB
                        </p>
                        {image && (
                          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <img src={URL.createObjectURL(image)} alt="Preview" style={{ height: '120px', borderRadius: '12px', objectFit: 'cover', border: '2px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                            <div className="file-upload-selected" style={{ margin: 0 }}>
                              {image.name}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn-modal-close"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="add-product-form"
                className="btn-modal-submit"
              >
                Publish Listing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Marketplace;
