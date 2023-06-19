import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import App from './App';


describe('App', () => {
  beforeEach(() => {
    render(<App />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders product list', () => {
    const productList = screen.getByRole('list');
    expect(productList).toBeInTheDocument();
  });

  test('displays payment form when a product is selected', () => {
    const product = screen.getByText('Product 1');
    fireEvent.click(product);

    const paymentForm = screen.getByLabelText('Select A Payment Option:');
    expect(paymentForm).toBeInTheDocument();
  });

  test('makes payment with momo option and valid phone number', async () => {
    const product = screen.getByText('Product 1');
    fireEvent.click(product);

    const momoOption = screen.getByLabelText('Momo');
    fireEvent.click(momoOption);

    const phoneInput = screen.getByPlaceholderText('0545104648');
    fireEvent.change(phoneInput, { target: { value: '0545104648' } });

    const submitButton = screen.getByText('Proceed To Payment');
    fireEvent.click(submitButton);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/checkout', {
      productId: 1,
      productName: 'Product 1',
      productDec: 'Description 1',
      paymentOption: 'momo',
      phone: '0545104648',
    });

    await waitFor(() => {
      const successModal = screen.getByText('Payment Successful');
      expect(successModal).toBeInTheDocument();
    });
  });

  test('makes payment with credit card option and valid card details', async () => {
    const product = screen.getByText('Product 1');
    fireEvent.click(product);

    const creditCardOption = screen.getByLabelText('Credit Card');
    fireEvent.click(creditCardOption);

    const cardNumberInput = screen.getByPlaceholderText('####-####-####-####');
    fireEvent.change(cardNumberInput, { target: { value: '1111222233334444' } });

    const expiryInput = screen.getByPlaceholderText('MM/YYYY');
    fireEvent.change(expiryInput, { target: { value: '12/2025' } });

    const cvcInput = screen.getByPlaceholderText('000');
    fireEvent.change(cvcInput, { target: { value: '123' } });

    const submitButton = screen.getByText('Proceed To Payment');
    fireEvent.click(submitButton);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/checkout', {
      productId: 1,
      productName: 'Product 1',
      productDec: 'Description 1',
      paymentOption: 'creditCard',
      cardNumber: '1111222233334444',
      expiry: '12/2025',
      cvc: '123',
    });

    await waitFor(() => {
      const successModal = screen.getByText('Payment Successful');
      expect(successModal).toBeInTheDocument();
    });
  });

  test('displays error modal when payment fails', async () => {
    const product = screen.getByText('Product 1');
    fireEvent.click(product);

    const creditCardOption = screen.getByLabelText('Credit Card');
    fireEvent.click(creditCardOption);

    const cardNumberInput = screen.getByPlaceholderText('####-####-####-####');
    fireEvent.change(cardNumberInput, { target: { value: '111122223333.'}})
  })})
