import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

const products: Product[] = [
  { id: 1, name: 'Product 1', description: 'Description 1', price: 30 },
  { id: 2, name: 'Product 2', description: 'Description 2', price: 20 },
  { id: 3, name: 'Product 3', description: 'Description 3', price: 40 },
  { id: 4, name: 'Product 4', description: 'Description 4', price: 60 },
  { id: 5, name: 'Product 5', description: 'Description 5', price: 70 },
  { id: 6, name: 'Product 6', description: 'Description 6', price: 80 },

];

const API_URL = 'http://localhost:5000/api/checkout';

const App: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [paymentOption, setPaymentOption] = useState('');
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCVC] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(false);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handlePaymentOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentOption(event.target.value);
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    const inputValue = event.target.value;
    const phoneValue = inputValue.replace(/\D/g, ''); // Remove non-digit characters
    const mobileValue = phoneValue.slice(0, 10); // Take the first ten digits

    setPhone(mobileValue);
  };

  const handleCardNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputCardNumber = event.target.value;
    const numericCardNumber = inputCardNumber.replace(/\D/g, ''); // Remove non-digit characters
  
    let formattedCardNumber = numericCardNumber;
  
    // Validate card number length
    if (numericCardNumber.length > 16) {
      formattedCardNumber = numericCardNumber.slice(0, 16); // Truncate to 16 digits
    }
  
    // Insert hyphens every four digits
    formattedCardNumber = formattedCardNumber.replace(/(\d{4})/g, '$1-');
  
    // Remove trailing hyphens
    formattedCardNumber = formattedCardNumber.replace(/-$/, '');
  
    setCardNumber(formattedCardNumber);
  };

  const handleExpiryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExpiry(event.target.value);
  };
  
  const handleCVCChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/\D/g, ''); // Remove non-digit characters
    const cvcValue = numericValue.slice(0, 3); // Take the first three digits
  
    setCVC(cvcValue);
  };


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (paymentOption === 'momo' && phone) {
      const formattedPhone = phone.replace(/\D/g, ''); // Remove non-digit characters
      if (formattedPhone.length !== 10) {
      alert('Phone Number must be 10 digits!');
        return;
      }
      const paymentData = {
        productId: selectedProduct?.id,
        productName: selectedProduct?.name,
        productDec: selectedProduct?.description,
        paymentOption,
        phone: formattedPhone,
      };
    
      await makePayment(paymentData);
    } else if (paymentOption === 'creditCard' && cardNumber && expiry && cvc) {
      const formattedCardNumber = cardNumber.replace(/\D/g, ''); // Remove non-digit characters
      const formattedCVC = cvc.replace(/\D/g, '');
      //const formattedexpiry = expiry.replace(/\D/g, '');

      if (formattedCardNumber.length === 16 && formattedCVC.length === 3) {
      const paymentData = {
        productId: selectedProduct?.id,
        productName: selectedProduct?.name,
        productDec: selectedProduct?.description,
        paymentOption,
        cardNumber,
        expiry,
        cvc,
      };
      await makePayment(paymentData);
    }else{  alert('Invalid Card Number or CVC length'); }
   }else {
      alert('Please fill in all the required payment details.');
    }
  };

  const makePayment = async (paymentData: any) => {
    try {
      const response = await axios.post(API_URL, paymentData);
      if (response.status === 200) {
        setPaymentSuccess(true);
      }
    } catch (error) {
      console.log(error);
      setPaymentError(true);
    }
  };

  const closeModal = () => {
    setPaymentSuccess(false);
    setPaymentError(false);
    setSelectedProduct(null);
    setPaymentOption('');
    setPhone('');
    setCardNumber('');
    setExpiry('');
    setCVC('');
  };

  //HTML Render View 

  return (
    <div className="container">
      <div className="py-5 text-center">
      <p className="text-white"><h2><b>Acme Media Ltd.</b></h2></p>
      </div>
      {selectedProduct ? (
        <div className="row">
          <div className="col-md-4 order-md-2 mb-4">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-white"><b>Your Cart</b></span>
            </h4>
            <ul className="list-group mb-3">
              <li className="list-group-item d-flex justify-content-between lh-condensed" style={{ backgroundColor: '#242852', color: '#8F92C3' }}>
                <div>
                  <h6 className="my-0 text-white">{selectedProduct.name}</h6>
                  <small className="text">{selectedProduct.description}</small>
                </div>
                <span className="text">${selectedProduct.price.toFixed(2)}</span>
              </li>
            </ul>
          </div>

          <div className="col-md-8 order-md-1">
            <h4 className="mb-3 text-white"><b>Payment</b></h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-white"> Select A Payment Option:</label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentOption"
                    value="momo"
                    checked={paymentOption === 'momo'}
                    onChange={handlePaymentOptionChange}
                  />
                  <label className="form-check-label text-white">Momo</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentOption"
                    value="creditCard"
                    checked={paymentOption === 'creditCard'}
                    onChange={handlePaymentOptionChange}
                  />
                  <label className="form-check-label text-white">Credit Card</label>
                </div>
              </div>

              {paymentOption === 'momo' && (
                <div className="mb-3">
                  <label className="form-label text-white" >Phone Number:</label>
                  <input
                  style={{ backgroundColor: '#242852', color: '#8F92C3' }}
                    type="text"
                    className="form-control"
                    placeholder='0545104648'
                    value={phone}
                    onChange={handlePhoneChange}
                  />
                </div>
              )}

              {paymentOption === 'creditCard' && (
                <div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-white">Card Number:</label>
                      <input
                       style={{ backgroundColor: '#242852', color: '#8F92C3' }}
                        type="text"
                        placeholder='####-####-####-####'
                        className="form-control"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label text-white">Expiry:</label>
                      <input
                       style={{ backgroundColor: '#242852', color: '#8F92C3' }}
                        type="text"
                        className="form-control"
                        placeholder="MM/YYYY"
                        value={expiry}
                        onChange={handleExpiryChange}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label text-white">CVC:</label>
                      <input
                       style={{ backgroundColor: '#242852', color: '#8F92C3' }}
                        type="text"
                        placeholder='000'
                        maxLength={3}
                        className="form-control"
                        value={cvc}
                        onChange={handleCVCChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              <hr className="mb-4" />
              <button className="btn  btn-lg btn-block" type="submit" style={{ backgroundColor: ' #18C2C0', color: 'white' }}>
                Proceed To Payment
              </button>
            </form>
          </div>
        </div>
      ) : (
        
        <div className="text-center">
           <p className="text-white"><h5>Please select a product to proceed with the checkout.</h5></p>
          <ul className="list-group mt-3 "  >
            {products.map((product) => (
              <li
                key={product.id}
                className="list-group-item d-flex justify-content-between align-items-center" 
                onClick={() => handleProductSelect(product)}
                style={{ backgroundColor: '#242852', color: 'white' }}
              >
                {product.name}
                <span className="badge rounded-pill" style={{ backgroundColor: ' #18C2C0', color: 'white' }}>${product.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
{paymentSuccess && (
  <div className="modal" style={{ display: 'block' }}>
    <div className="modal-dialog modal-success">
      <div className="modal-content">
        <div className="modal-header bg-success">
          <h5 className="modal-title text-white">Payment Successful</h5>
          <button type="button" className="btn-close" onClick={closeModal}></button>
        </div>
        <div className="modal-body">
          <p className="text-black">Thank you for your payment.</p>
          <p className="text-black">Product: {selectedProduct?.name}</p>
          <p className="text-black">Price: ${selectedProduct?.price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  </div>
)}

{paymentError && (
  <div className="modal" style={{ display: 'block' }}>
  <div className="modal-dialog">
    <div className="modal-content">
    <div className="modal-header bg-danger">
        <h5 className="modal-title text-white">Payment Failed</h5>
        <button type="button" className="btn-close" onClick={closeModal}></button>
      </div>
      <div className="modal-body">
        <p>Payment Failed. Please try again.</p>
      </div>
    </div>
  </div>
</div>
)}

    </div>
  );
};

export default App;