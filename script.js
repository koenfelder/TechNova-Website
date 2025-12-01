"use strict";

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNav();
    initSwitcher();
    initGame();
    initCart();
    initContact(); 
});

/* =========================================
   1. THEME TOGGLE
   ========================================= */
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    
    const savedTheme = localStorage.getItem('technova_theme');

    
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeBtn.textContent = 'Light Mode';
    } else {
        body.removeAttribute('data-theme');
        themeBtn.textContent = 'Dark Mode';
    }

    // Toggle Listener
    themeBtn.addEventListener('click', () => {
        if (body.getAttribute('data-theme') === 'dark') {
            // Switch to Light
            body.removeAttribute('data-theme');
            themeBtn.textContent = 'Dark Mode';
            localStorage.setItem('technova_theme', 'light');
        } else {
            // Switch to Dark
            body.setAttribute('data-theme', 'dark');
            themeBtn.textContent = 'Light Mode';
            localStorage.setItem('technova_theme', 'dark');
        }
    });
}

function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('main-nav');

    if(navToggle && nav) {
        navToggle.addEventListener('click', () => {
            if (nav.style.display === 'block') {
                nav.style.display = 'none';
            } else {
                nav.style.display = 'block';
                nav.style.position = 'absolute';
                nav.style.top = '70px';
                nav.style.right = '20px';
                nav.style.background = 'var(--bg-card)';
                nav.style.padding = '20px';
                nav.style.boxShadow = 'var(--shadow-lg)';
                nav.style.borderRadius = '8px';
                nav.style.zIndex = '1001';
            }
        });
    }
}

/* =========================================
   2. SWITCHER 
   ========================================= */
function initSwitcher() {
    const btn1 = document.getElementById('btn1');
    const btn2 = document.getElementById('btn2');
    const btn3 = document.getElementById('btn3');

    const p1 = document.getElementById('product1');
    const p2 = document.getElementById('product2');
    const p3 = document.getElementById('product3');

    function hideAll() {
        p1.classList.add('hidden');
        p2.classList.add('hidden');
        p3.classList.add('hidden');
    }

    if (btn1 && btn2 && btn3) {
        btn1.addEventListener('click', () => { hideAll(); p1.classList.remove('hidden'); });
        btn2.addEventListener('click', () => { hideAll(); p2.classList.remove('hidden'); });
        btn3.addEventListener('click', () => { hideAll(); p3.classList.remove('hidden'); });
    }
}

/* =========================================
   3. GUESSING GAME
   ========================================= */
function initGame() {
    const form = document.getElementById('gameForm');
    const input = document.getElementById('numGuess');
    const output = document.getElementById('gameOutput');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const userGuess = parseInt(input.value);
            const randomNum = Math.floor(Math.random() * 10) + 1;

            if (isNaN(userGuess) || userGuess < 1 || userGuess > 10) {
                output.textContent = "Please enter a valid number between 1 and 10.";
                output.style.color = "var(--error-color)";
                return;
            }

            if (userGuess === randomNum) {
                output.innerHTML = `<strong>You Won!</strong> The number was ${randomNum}.`;
                output.style.color = "var(--success)";
            } else {
                output.innerHTML = `Sorry, you guessed ${userGuess}, but the number was ${randomNum}. Try again!`;
                output.style.color = "var(--error-color)";
            }
        });
    }
}

/* =========================================
   4. SHOPPING CART 
   ========================================= */
function initCart() {
    let cartItems = []; 
    const taxRate = 0.08;
    const shippingRate = 15.00;

    const itemsList = document.getElementById('itemsList1');
    const elSubtotal = document.getElementById('subtotal1');
    const elTax = document.getElementById('tax1');
    const elShipping = document.getElementById('shipping1');
    const elTotal = document.getElementById('total1');
    const checkoutBtn = document.getElementById('checkout1');

    const fmt = (num) => `$${num.toFixed(2)}`;

    function updateCartDisplay() {
        itemsList.innerHTML = ""; 
        
        if (cartItems.length === 0) {
            itemsList.innerHTML = "<li>Your Cart is Empty</li>";
            elSubtotal.textContent = "$0.00";
            elTax.textContent = "$0.00";
            elShipping.textContent = "$0.00";
            elTotal.textContent = "$0.00";
            return;
        } 

        // Render Items
        cartItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = "cart-row";
            li.innerHTML = `
                <div>
                    <span class="cart-name" style="font-weight:600;">${item.name}</span>
                    <br>
                    <span class="cart-meta" style="font-size:0.9rem; color:var(--text-muted);">${fmt(item.price)}</span>
                </div>
                <button class="remove-btn" data-index="${index}">Remove</button>
            `;
            itemsList.appendChild(li);
        });

        // Calculations
        let subtotal = 0;
        cartItems.forEach(item => subtotal += item.price);
        const tax = subtotal * taxRate;
        const shipping = subtotal > 0 ? shippingRate : 0;
        const total = subtotal + tax + shipping;

        elSubtotal.textContent = fmt(subtotal);
        elTax.textContent = fmt(tax);
        elShipping.textContent = fmt(shipping);
        elTotal.textContent = fmt(total);

        
        const removeBtns = document.querySelectorAll('.remove-btn');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                cartItems.splice(idx, 1);
                updateCartDisplay(); 
            });
        });
    }

    // Add to Cart 
    const addBtns = document.querySelectorAll('.add-to-cart');
    addBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));
            
            cartItems.push({ name, price });
            updateCartDisplay();

            // Visual Feedback
            const originalText = btn.textContent;
            btn.textContent = "Added!";
            btn.style.borderColor = "var(--success)";
            btn.style.color = "var(--success)";
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.borderColor = "";
                btn.style.color = "";
            }, 1000);
        });
    });

    if(checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if(cartItems.length === 0) {
                alert("Your cart is empty!");
            } else {
                alert(`Thank you! Your total is ${elTotal.textContent}`);
                cartItems = [];
                updateCartDisplay();
            }
        });
    }
}

/* =========================================
   5. CONTACT FORM 
   ========================================= */
function initContact() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Grab Inputs
        const nameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const msgInput = document.getElementById('message');
        const contactPref = document.querySelector('input[name="contactPref"]:checked').value;

        // Grab Error Spans
        const nameErr = document.getElementById('nameError');
        const emailErr = document.getElementById('emailError');
        const phoneErr = document.getElementById('phoneError');
        const msgErr = document.getElementById('messageError');

        // Clear previous errors
        [nameErr, emailErr, phoneErr, msgErr].forEach(el => el.textContent = '');
        [nameInput, emailInput, phoneInput, msgInput].forEach(el => el.style.borderColor = '');

        let isValid = true;

        //  Name
        if (nameInput.value.trim() === '') {
            nameErr.textContent = "Name is required.";
            nameInput.style.borderColor = "var(--error-color)";
            isValid = false;
        }

        //  Email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value.trim())) {
            emailErr.textContent = "Please enter a valid email.";
            emailInput.style.borderColor = "var(--error-color)";
            isValid = false;
        }

        //  Phone 
        if (phoneInput.value.trim().length < 10) {
            phoneErr.textContent = "Please enter a valid phone number.";
            phoneInput.style.borderColor = "var(--error-color)";
            isValid = false;
        }

        //  Message
        if (msgInput.value.trim() === '') {
            msgErr.textContent = "Please enter a message.";
            msgInput.style.borderColor = "var(--error-color)";
            isValid = false;
        }

        if (isValid) {
            alert(`Thank you, ${nameInput.value}! We will contact you via ${contactPref}.`);
            contactForm.reset();
        }
    });
}