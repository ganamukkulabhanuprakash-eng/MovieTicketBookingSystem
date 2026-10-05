import React, { useState } from 'react';
import { AlertCircle, CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const PaymentForm = ({ totalAmount, onPaymentComplete, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Formatting logic
    let formattedValue = value;
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').substring(0, 16);
      formattedValue = formattedValue.replace(/(\d{4})/g, '$1 ').trim();
    } else if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
      if (formattedValue.length > 2) {
        formattedValue = `${formattedValue.substring(0, 2)}/${formattedValue.substring(2)}`;
      }
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 3);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const isFormValid = () => {
    return (
      formData.cardNumber.replace(/\s/g, '').length === 16 &&
      formData.expiryDate.length === 5 &&
      formData.cvv.length === 3 &&
      formData.cardholderName.trim().length > 0
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentComplete({
        transactionId: `TXN${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        amount: totalAmount,
        status: 'SUCCESS',
        method: 'CREDIT_CARD'
      });
    }, 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-surface rounded-xl border border-border overflow-hidden">
      
      {/* Demo Banner */}
      <div className="bg-primary/10 text-primary p-3 text-sm flex items-center justify-between gap-2 border-b border-primary/20">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Demo payment interface</span>
        </div>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={isProcessing}
          onClick={() => {
            setIsProcessing(true);
            setTimeout(() => {
              setIsProcessing(false);
              onPaymentComplete({
                transactionId: `TXN${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
                amount: totalAmount,
                status: 'SUCCESS',
                method: 'DEMO_1_CLICK'
              });
            }, 600);
          }}
          className="text-xs py-1 px-3 h-auto"
        >
          {isProcessing ? 'Confirming...' : '⚡ Quick Demo Pay'}
        </Button>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Details
          </h2>
          <div className="text-xl font-bold text-primary">₹{totalAmount.toFixed(2)}</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Card Number"
            id="cardNumber"
            name="cardNumber"
            placeholder="0000 0000 0000 0000"
            value={formData.cardNumber}
            onChange={handleChange}
            required
            disabled={isProcessing}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Expiry Date"
              id="expiryDate"
              name="expiryDate"
              placeholder="MM/YY"
              value={formData.expiryDate}
              onChange={handleChange}
              required
              disabled={isProcessing}
            />
            <Input
              label="CVV"
              id="cvv"
              name="cvv"
              type="password"
              placeholder="123"
              value={formData.cvv}
              onChange={handleChange}
              required
              disabled={isProcessing}
            />
          </div>

          <Input
            label="Cardholder Name"
            id="cardholderName"
            name="cardholderName"
            placeholder="John Doe"
            value={formData.cardholderName}
            onChange={handleChange}
            required
            disabled={isProcessing}
          />

          <div className="pt-4 flex gap-3">
            <Button 
              type="button" 
              variant="ghost" 
              className="flex-1" 
              onClick={onCancel}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={!isFormValid() || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ₹${totalAmount.toFixed(2)}`
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
