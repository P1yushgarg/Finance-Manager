import { useState, useRef, useEffect } from 'react';
import { PlusCircle, CreditCard, Banknote, Camera, Image as ImageIcon, Loader2, CheckCircle2, X } from 'lucide-react';
import Tesseract from 'tesseract.js';

const AddTransactionForm = ({ onAdd, isModal, onClose, autoTriggerScan }) => {
    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [category, setCategory] = useState('Groceries');
    const [customCategory, setCustomCategory] = useState('');
    const [method, setMethod] = useState('UPI');
    
    // OCR scanning states
    const [isScanning, setIsScanning] = useState(false);
    const [scanStatus, setScanStatus] = useState('');
    const [billImage, setBillImage] = useState('');
    const [imageName, setImageName] = useState('');
    
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (autoTriggerScan && fileInputRef.current) {
            fileInputRef.current.click();
        }
    }, [autoTriggerScan]);

    const categoriesList = [
        'Groceries',
        'Food & Dining',
        'Rent & Housing',
        'Bills & Utilities',
        'Transportation',
        'Shopping',
        'Entertainment',
        'Healthcare',
        'Education',
        'Travel',
        'Others',
        'Custom'
    ];

    const extractAmount = (text) => {
        const lowerText = text.toLowerCase();
        
        const totalPatterns = [
            /(?:grand\s+)?total\s*[:\-\s]*₹?\s*([\d,]+(?:\.\d{2})?)/i,
            /amount\s*(?:due)?\s*[:\-\s]*₹?\s*([\d,]+(?:\.\d{2})?)/i,
            /net\s*[:\-\s]*₹?\s*([\d,]+(?:\.\d{2})?)/i,
            /due\s*[:\-\s]*₹?\s*([\d,]+(?:\.\d{2})?)/i,
            /inr\s*[:\-\s]*₹?\s*([\d,]+(?:\.\d{2})?)/i,
            /rs\.?\s*[:\-\s]*₹?\s*([\d,]+(?:\.\d{2})?)/i,
            /₹\s*([\d,]+(?:\.\d{2})?)/i
        ];

        for (const pattern of totalPatterns) {
            const match = lowerText.match(pattern);
            if (match && match[1]) {
                const cleaned = match[1].replace(/,/g, '');
                const val = parseFloat(cleaned);
                if (val > 0) return val;
            }
        }

        const priceRegex = /[\d,]+\.\d{2}/g;
        const prices = lowerText.match(priceRegex);
        if (prices) {
            const parsedPrices = prices.map(p => parseFloat(p.replace(/,/g, ''))).filter(val => val > 0 && val < 100000);
            if (parsedPrices.length > 0) {
                return Math.max(...parsedPrices);
            }
        }
        return '';
    };

    const extractRecipient = (text) => {
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        
        const isInvalidRecipient = (line) => {
            const lower = line.toLowerCase();
            if (/^[\d\s\W_]+$/.test(line)) return true;
            if (/\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/.test(line)) return true;
            if (lower.includes('tel') || lower.includes('phone') || lower.includes('mobile') || lower.includes('+91')) return true;
            if (lower.includes('www.') || lower.includes('.com') || lower.includes('.in') || lower.includes('http')) return true;
            if (/^\d+\s+[a-zA-Z]/.test(line) && (lower.includes('street') || lower.includes('road') || lower.includes('floor') || lower.includes('lane'))) return true;
            return false;
        };

        for (const line of lines) {
            if (!isInvalidRecipient(line)) {
                return line.substring(0, 30).trim();
            }
        }
        return 'Scanned Merchant';
    };

    const extractCategory = (text) => {
        const lowerText = text.toLowerCase();
        
        const categoryKeywords = {
            'Food & Dining': ['restaurant', 'food', 'foods', 'dining', 'cafe', 'coffee', 'starbucks', 'pizza', 'burger', 'kitchen', 'lunch', 'dinner', 'breakfast', 'bistro', 'bar', 'bakery', 'hotel', 'sweet', 'zomato', 'swiggy', 'mcdonalds', 'kfc', 'cafe', 'tea', 'juice', 'dosa', 'paneer', 'masala', 'biryani', 'curry'],
            'Groceries': ['supermarket', 'grocery', 'groceries', 'mart', 'store', 'milk', 'bread', 'veg', 'fruit', 'flour', 'rice', 'soap', 'oil', 'butter', 'cheese', 'dairy', 'walmart', 'd-mart', 'reliance', 'grocery store'],
            'Bills & Utilities': ['electric', 'water', 'electricity', 'gas', 'power', 'wifi', 'broadband', 'internet', 'mobile recharge', 'bill', 'telephone', 'insurance', 'tax', 'utility', 'utilities', 'recharge'],
            'Transportation': ['taxi', 'metro', 'cab', 'uber', 'ola', 'bus', 'train', 'ticket', 'petrol', 'diesel', 'fuel', 'toll', 'parking', 'garage', 'auto', 'railway'],
            'Shopping': ['apparel', 'clothes', 'shopping', 'shoes', 'wear', 'shirt', 'jeans', 'dress', 'bag', 'zara', 'h&m', 'amazon', 'flipkart', 'store', 'fashion', 'mall', 'clothing', 'retail'],
            'Entertainment': ['movie', 'cinema', 'theatre', 'ticket', 'pvr', 'bookmyshow', 'netflix', 'spotify', 'game', 'club', 'concert', 'fun', 'play', 'show', 'amusement'],
            'Healthcare': ['hospital', 'pharmacy', 'medical', 'medicine', 'doctor', 'clinic', 'dental', 'health', 'drug', 'lab', 'test', 'pharma', 'chemist'],
            'Education': ['school', 'college', 'tuition', 'fees', 'books', 'course', 'academy', 'stationary', 'exam', 'class', 'university'],
            'Travel': ['flight', 'hotel', 'resort', 'air', 'ticket', 'trip', 'travel', 'booking', 'tour', 'stay', 'airbnb', 'flight ticket']
        };

        for (const [cat, keywords] of Object.entries(categoryKeywords)) {
            for (const keyword of keywords) {
                if (lowerText.includes(keyword)) {
                    return cat;
                }
            }
        }
        return 'Others';
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsScanning(true);
        setScanStatus("Compressing image...");
        setImageName(file.name);

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new window.Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                const MAX_SIZE = 800;
                if (width > height) {
                    if (width > MAX_SIZE) {
                        height = Math.round((height * MAX_SIZE) / width);
                        width = MAX_SIZE;
                    }
                } else {
                    if (height > MAX_SIZE) {
                        width = Math.round((width * MAX_SIZE) / height);
                        height = MAX_SIZE;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                const base64Image = canvas.toDataURL('image/jpeg', 0.7);
                setBillImage(base64Image);
                
                setScanStatus("Running AI OCR Scan...");
                
                Tesseract.recognize(
                    base64Image,
                    'eng',
                    { logger: m => {
                        if (m.status === 'recognizing text') {
                            setScanStatus(`Scanning: ${Math.round(m.progress * 100)}%`);
                        }
                    }}
                ).then(({ data: { text } }) => {
                    const parsedAmount = extractAmount(text);
                    const parsedRecipient = extractRecipient(text);
                    const parsedCategory = extractCategory(text);
                    
                    if (parsedAmount) setAmount(parsedAmount.toString());
                    if (parsedRecipient) setRecipient(parsedRecipient);
                    if (parsedCategory) setCategory(parsedCategory);
                    
                    setIsScanning(false);
                    setScanStatus('');
                }).catch(err => {
                    console.error("OCR scanning error", err);
                    setIsScanning(false);
                    setScanStatus('');
                });
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || !recipient) return;

        const finalCategory = category === 'Custom' ? (customCategory.trim() || 'Others') : category;

        onAdd({
            amount: parseFloat(amount),
            recipient,
            category: finalCategory,
            method,
            date: new Date().toISOString(),
            billImage
        });

        setAmount('');
        setRecipient('');
        setCustomCategory('');
        setCategory('Groceries');
        setBillImage('');
        setImageName('');
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', width: '100%' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <PlusCircle size={20} color="var(--primary)" /> Add New Expense
                </span>
                {isModal && (
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="btn-icon-soft" 
                        style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <X size={16} />
                    </button>
                )}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Bill Scanner Section */}
                <div style={{ marginBottom: '0.2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Scan Receipt Photo (Free OCR DB)</label>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                    />
                    
                    {isScanning ? (
                        <div style={{ background: 'rgba(249, 115, 22, 0.05)', border: '1px dashed var(--primary)', borderRadius: '10px', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', color: 'var(--primary)' }}>
                            <Loader2 className="animate-spin" size={20} />
                            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{scanStatus}</span>
                        </div>
                    ) : billImage ? (
                        <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--success)' }}>
                                <CheckCircle2 size={18} />
                                <span style={{ fontSize: '0.85rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>{imageName || 'Bill Attached'}</span>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => { setBillImage(''); setImageName(''); }} 
                                style={{ fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 500 }}
                            >
                                Remove
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="btn-secondary"
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem', borderRadius: '10px', fontSize: '0.85rem' }}
                            >
                                <Camera size={16} /> Click Bill
                            </button>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="btn-secondary"
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem', borderRadius: '10px', fontSize: '0.85rem' }}
                            >
                                <ImageIcon size={16} /> Upload Receipt
                            </button>
                        </div>
                    )}
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Amount (₹)</label>
                    <input
                        type="number"
                        className="input-field"
                        placeholder="e.g. 500"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        min="1"
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Paid To</label>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. Starbucks, Amazon..."
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Category</label>
                    <select
                        className="input-field"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {categoriesList.map(c => (
                            <option key={c} value={c}>
                                {c === 'Custom' ? 'Custom (Enter below)...' : c}
                            </option>
                        ))}
                    </select>
                </div>

                {category === 'Custom' && (
                    <div className="animate-slide-up" style={{ marginTop: '0.2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Custom Category Name</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="e.g. Subscriptions, Gym..."
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                            required
                        />
                    </div>
                )}

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Payment Method</label>
                    <div style={{ display: 'flex', gap: '0.6rem' }}>
                        {[
                            { label: 'UPI',  icon: <Banknote  size={15} /> },
                            { label: 'Cash', icon: <Banknote  size={15} /> },
                            { label: 'Bank', icon: <CreditCard size={15} /> },
                        ].map(({ label, icon }) => (
                            <button
                                key={label}
                                type="button"
                                className={`flex-center ${method === label ? 'btn-primary' : 'btn-secondary'}`}
                                style={{ flex: 1, gap: '0.4rem', padding: '0.5rem' }}
                                onClick={() => setMethod(label)}
                            >
                                {icon} {label}
                            </button>
                        ))}
                    </div>
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
                    Add Record
                </button>
            </form>
        </div>
    );
};

export default AddTransactionForm;
