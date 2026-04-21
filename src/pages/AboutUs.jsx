import Footer from '../components/layout/Footer';
import { Users, Award, Shield } from 'lucide-react';

const AboutUs = () => {
    return (
        <>
            <div className="container" style={{ padding: '4rem 2rem 8rem 2rem' }}>
                <header style={{ textAlign: 'center', marginBottom: '4rem' }} className="animate-fade-in">
                    <h1 className="text-hero">About FinX<span className="text-gradient">Manager</span></h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '1rem auto 0 auto' }}>
                        We're a passionately dedicated team building the best personal finance tools to give you absolute control over your financial journey.
                    </p>
                </header>

                {/* Vision Section */}
                <section className="dashboard-grid animate-slide-up" style={{ marginBottom: '6rem' }}>
                    <div className="col-span-4 glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '16px', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                            <Users size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '1rem' }}>User First</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>We design every feature focusing exclusively on clarity, aesthetics, and solving real user problems.</p>
                    </div>
                    <div className="col-span-4 glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '16px', color: 'var(--secondary)', marginBottom: '1.5rem' }}>
                            <Award size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '1rem' }}>Premium Design</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>We believe personal finance shouldn't be boring. Our modern aesthetics make managing money enjoyable.</p>
                    </div>
                    <div className="col-span-4 glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '16px', color: 'var(--success)', marginBottom: '1.5rem' }}>
                            <Shield size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '1rem' }}>Secure Always</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Your data integrity and privacy is paramount. We adhere to top-tier development standards.</p>
                    </div>
                </section>

                {/* Team Section */}
                <section className="animate-slide-up delay-200" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>Meet the Team</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '4rem' }}>The brilliant minds behind FinX Manager.</p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: 'center' }}>
                        <TeamCard
                            name="Piyush Garg"
                            initial="P"
                            bgGradient="linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))"
                        />
                        <TeamCard
                            name="Mayank Rana"
                            initial="M"
                            bgGradient="linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(244, 63, 94, 0.2))"
                        />
                        <TeamCard
                            name="Muskan Garg"
                            initial="M"
                            bgGradient="linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(20, 184, 166, 0.2))"
                        />
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

const TeamCard = ({ name, role, initial, bgGradient }) => (
    <div className="glass-panel" style={{ width: '280px', padding: '3rem 2rem', textAlign: 'center', transition: 'transform 0.3s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
        <div style={{ width: '100px', height: '100px', margin: '0 auto 1.5rem auto', borderRadius: '50%', background: bgGradient, border: '2px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold' }}>
            {initial}
        </div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '0.5rem' }}>{name}</h3>
        <p style={{ color: 'var(--text-muted)' }}>{role}</p>
    </div>
);

export default AboutUs;
