import { useState } from 'react';
import { Mail, MapPin, Phone, CheckCircle } from 'lucide-react';
import Footer from '../components/layout/Footer';

const ContactUs = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate an API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1500);
    };

    return (
        <>
            <div className="container dashboard-grid" style={{ padding: '4rem 2rem 8rem 2rem', alignItems: 'start', maxWidth: '1200px', margin: '0 auto' }}>

                {/* Contact Info */}
                <div className="col-span-5 animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div>
                        <h1 className="text-hero" style={{ marginBottom: '1rem' }}>Get in Touch.</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>We’d love to hear from you. Reach out to us for support, partnerships, or just to say hello!</p>
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}>
                                <Mail size={24} />
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Email Us</p>
                                <p style={{ fontWeight: 600 }}>support@finxmanager.com</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '12px', color: 'var(--secondary)' }}>
                                <Phone size={24} />
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Call Us</p>
                                <p style={{ fontWeight: 600 }}>+91 98765 43210</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--success)' }}>
                                <MapPin size={24} />
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Headquarters</p>
                                <p style={{ fontWeight: 600 }}>New Delhi, India</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="col-span-7 animate-slide-up delay-200">
                    {isSubmitted ? (
                        <div className="glass-panel flex-center" style={{ padding: '4rem 3rem', flexDirection: 'column', textAlign: 'center', height: '100%' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <CheckCircle size={40} color="var(--success)" />
                            </div>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '1rem' }}>Message Sent!</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                            <button className="btn-primary" onClick={() => setIsSubmitted(false)}>Send Another Message</button>
                        </div>
                    ) : (
                        <form className="glass-panel" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleSubmit}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Send a Message</h3>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="input-group">
                                    <label>First Name</label>
                                    <input type="text" className="input-field" placeholder="John" required />
                                </div>
                                <div className="input-group">
                                    <label>Last Name</label>
                                    <input type="text" className="input-field" placeholder="Doe" required />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Email Address</label>
                                <input type="email" className="input-field" placeholder="john@example.com" required />
                            </div>

                            <div className="input-group">
                                <label>Message</label>
                                <textarea className="input-field" rows={5} placeholder="How can we help you?" style={{ resize: 'vertical' }} required></textarea>
                            </div>

                            <button type="submit" className="btn-primary" style={{ padding: '1rem', marginTop: '1rem', opacity: isSubmitting ? 0.7 : 1 }} disabled={isSubmitting}>
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    )}
                </div>

            </div>
            <Footer />
        </>
    );
};

export default ContactUs;
