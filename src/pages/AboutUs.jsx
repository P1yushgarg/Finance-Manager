import Footer from '../components/layout/Footer';
import { Users, Award, Shield } from 'lucide-react';

const AboutUs = () => {
    return (
        <>
            <div className="container marketing-page-wrapper" style={{ paddingBottom: '2rem' }}>
                <header style={{ textAlign: 'center', marginBottom: '2rem' }} className="animate-fade-in">
                    <h1 className="text-hero">About FinX<span className="text-gradient">Manager</span></h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '1rem auto 0 auto' }}>
                        We're a passionately dedicated team building the best personal finance tools to give you absolute control over your financial journey.
                    </p>
                    <div style={{ color: 'var(--primary)', fontWeight: 600, marginTop: '1rem', fontSize: '1.1rem' }}>by Piyush Garg</div>
                </header>

                {/* Vision Section */}
                <section className="animate-slide-up" style={{ marginBottom: '2rem' }}>
                    <div className="app-scroll-row" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
                        <div className="glass-panel app-scroll-item" style={{ padding: '2.5rem', textAlign: 'center', flex: '1 1 300px', maxWidth: '380px' }}>
                            <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '16px', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                                <Users size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '1rem' }}>User First</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>We design every feature focusing exclusively on clarity, aesthetics, and solving real user problems.</p>
                        </div>
                        <div className="glass-panel app-scroll-item" style={{ padding: '2.5rem', textAlign: 'center', flex: '1 1 300px', maxWidth: '380px' }}>
                            <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(249, 115, 22, 0.15)', borderRadius: '16px', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                                <Award size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '1rem' }}>Premium Design</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>We believe personal finance shouldn't be boring. Our modern aesthetics make managing money enjoyable.</p>
                        </div>
                        <div className="glass-panel app-scroll-item" style={{ padding: '2.5rem', textAlign: 'center', flex: '1 1 300px', maxWidth: '380px' }}>
                            <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '16px', color: 'var(--success)', marginBottom: '1.5rem' }}>
                                <Shield size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '1rem' }}>Secure Always</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Your data integrity and privacy is paramount. We adhere to top-tier development standards.</p>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default AboutUs;
