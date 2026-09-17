// Data Produk Komputer ToyyaStore
const products = [
    {
        id: 1,
        name: "Laptop Asus ROG Strix G15",
        category: "laptop",
        price: 18500000,
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "PC Gaming Rig RTX 4070",
        category: "pc",
        price: 24000000,
        image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Processor Intel Core i7-13700K",
        category: "component",
        price: 6500000,
        image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Monitor Gaming Curved 144Hz 27 inch",
        category: "accessory",
        price: 3200000,
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Keyboard Mechanical RGB Blue Switch",
        category: "accessory",
        price: 650000,
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Laptop Lenovo ThinkPad X1 Carbon",
        category: "laptop",
        price: 21000000,
        image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 7,
        name: "VGA Nvidia RTX 4060 Ti 8GB",
        category: "component",
        price: 7200000,
        image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 8,
        name: "Mouse Wireless Ergonomic Gaming",
        category: "accessory",
        price: 350000,
        image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80"
    }
];

// Keranjang Belanja State
let cart = [];

// Format Rupiah Helper
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
}

// Render Produk ke Grid
function renderProducts(filter = "all") {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = "";

    const filtered = filter === "all" ? products : products.filter(p => p.category === filter);

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">${formatRupiah(product.price)}</div>
                <button class="btn btn-primary btn-block" onclick="addToCart(${product.id})">
                    <i class="fa-solid fa-cart-plus"></i> Tambah
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Filter Button Click Listener
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        const filter = e.target.getAttribute('data-filter');
        renderProducts(filter);
    });
});

// Tambah ke Keranjang
function addToCart(productId) {
    const item = products.find(p => p.id === productId);
    const cartItem = cart.find(c => c.id === productId);

    if (cartItem) {
        cartItem.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }

    updateCartUI();
}

// Update UI Keranjang
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const totalPriceEl = document.getElementById('cart-total-price');

    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.innerText = totalQty;

    cartItems.innerHTML = "";
    let totalPrice = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p style='text-align:center; color:#64748b;'>Keranjang masih kosong.</p>";
    } else {
        cart.forEach(item => {
            totalPrice += item.price * item.qty;
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div>
                    <strong>${item.name}</strong>
                    <div>${formatRupiah(item.price)} x ${item.qty}</div>
                </div>
                <button class="btn btn-outline" style="padding: 4px 8px; font-size: 0.8rem;" onclick="removeFromCart(${item.id})">Hapus</button>
            `;
            cartItems.appendChild(div);
        });
    }

    totalPriceEl.innerText = formatRupiah(totalPrice);
}

// Hapus dari Keranjang
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// Modal Logic
const modal = document.getElementById('cart-modal');
const cartIcon = document.getElementById('cart-icon');
const closeModal = document.getElementById('close-modal');

cartIcon.addEventListener('click', () => { modal.style.display = 'flex'; });
closeModal.addEventListener('click', () => { modal.style.display = 'none'; });

window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

// Checkout WA Logic
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Keranjang belanja Anda masih kosong!");
        return;
    }

    let message = "Halo ToyyaStore, saya mau pesan produk berikut:%0A";
    let total = 0;

    cart.forEach(item => {
        message += `- ${item.name} (${item.qty}x) = ${formatRupiah(item.price * item.qty)}%0A`;
        total += item.price * item.qty;
    });

    message += `%0ATotal Pembayaran: *${formatRupiah(total)}*`;

    const waNum = "6281234567890"; // Ganti dengan nomor WA Anda
    window.open(`https://wa.me/${waNum}?text=${message}`, '_blank');
});

// Mobile Navbar Toggle
const mobileToggle = document.getElementById('mobile-toggle');
const navMenu = document.getElementById('nav-menu');

mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Submit Form Kontak Simulation
document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert("Terima kasih! Pesan Anda telah dikirim ke ToyyaStore.");
    document.getElementById('contact-form').reset();
});

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
});
