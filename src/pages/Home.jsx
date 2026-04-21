import { Link } from 'react-router-dom';
import { TrendingUp, ShieldCheck, PieChart, ArrowRight } from 'lucide-react';
import Footer from '../components/layout/Footer';

const Home = () => {
    return (
        <>
            <div className="container" style={{ padding: '4rem 2rem' }}>
                {/* Hero Section */}
                <section className="animate-slide-up" style={{ textAlign: 'center', margin: '4rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                    <h1 style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1.1, maxWidth: '800px' }}>
                        Take Control of Your <br />
                        <span className="text-gradient">Financial Future</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', lineHeight: 1.6 }}>
                        Track expenses, analyze spending habits using beautiful charts, and achieve your financial goals with simplicity and aesthetics.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <Link to="/signup" className="btn-primary flex-center" style={{ gap: '0.5rem' }}>
                            Get Started <ArrowRight size={18} />
                        </Link>
                        <Link to="/login" className="btn-secondary">
                            View Dashboard
                        </Link>
                    </div>
                </section>

                {/* Features Section */}
                <section className="animate-slide-up delay-100" style={{ marginTop: '8rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 700 }}>Why FinX Manager?</h2>
                        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Everything you need to manage your money in one place.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <FeatureCard
                            icon={<TrendingUp size={32} color="var(--primary)" />}
                            title="Track Spends"
                            desc="Easily add and categorize your transactions, whether it's through Card or UPI."
                        />
                        <FeatureCard
                            icon={<PieChart size={32} color="var(--secondary)" />}
                            title="Visual Analytics"
                            desc="Understand where your money goes with our beautiful, dynamic charts and insights."
                        />
                        <FeatureCard
                            icon={<ShieldCheck size={32} color="var(--success)" />}
                            title="Secure & Private"
                            desc="Your data stays yours. We prioritize security to keep your financial info safe."
                        />
                    </div>
                </section>

                {/* How it works */}
                <section className="animate-slide-up delay-200 glass-panel" style={{ marginTop: '8rem', padding: '4rem 2rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem' }}>How It Works</h2>
                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '3rem' }}>
                        <div style={{ maxWidth: '250px' }}>
                            <div className="flex-center" style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid var(--primary)', margin: '0 auto 1.5rem auto', fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>1</div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Sign Up</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Create a personal profile in seconds.</p>
                        </div>
                        <div style={{ maxWidth: '250px' }}>
                            <div className="flex-center" style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid var(--primary)', margin: '0 auto 1.5rem auto', fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>2</div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Add Info</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Log your spending streams like UPI or Cards.</p>
                        </div>
                        <div style={{ maxWidth: '250px' }}>
                            <div className="flex-center" style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid var(--primary)', margin: '0 auto 1.5rem auto', fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>3</div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Gain Insights</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Watch your financial standing through clear graphs.</p>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            {icon}
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{title}</h3>
        </div>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>{desc}</p>
    </div>
);

export default Home;
