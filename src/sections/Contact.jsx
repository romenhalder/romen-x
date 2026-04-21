import { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Mail, Phone, MapPin, Github, Linkedin, Send, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import profile from '../data/profile.json';

const SUBJECTS = [
  'Job Opportunity',
  'Collaboration',
  'General Inquiry',
  'Patent Inquiry',
];

const INITIAL_FORM = { name: '', email: '', subject: SUBJECTS[0], message: '' };

function ContactInfo() {
  const items = [
    { icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { icon: Phone, label: 'Phone', value: profile.phone, href: `tel:${profile.phone}` },
    { icon: MapPin, label: 'Location', value: profile.location, href: null },
    { icon: Github, label: 'GitHub', value: 'romenhalder', href: profile.github },
    { icon: Linkedin, label: 'LinkedIn', value: 'romenhalder', href: profile.linkedin },
  ];

  return (
    <div className="space-y-4">
      {items.map(({ icon: Icon, label, value, href }, i) => (
        <motion.div
          key={label}
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-accent)' }}
          >
            <Icon size={18} style={{ color: 'var(--color-accent1)' }} />
          </div>
          <div>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{label}</p>
            {href ? (
              <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                className="text-sm font-medium hover:underline"
                style={{ color: 'var(--color-text-primary)' }}>
                {value}
              </a>
            ) : (
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{value}</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function Contact() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.message.trim()) errs.message = 'Message is required';
    else if (form.message.trim().length < 20) errs.message = 'Message must be at least 20 characters';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      // Formspree integration — replace with your Formspree endpoint from .env.local
      const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;

      if (endpoint) {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Failed');
        toast.success('Message sent! I\'ll get back to you soon.');
      } else {
        // Fallback: mailto
        const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
        window.location.href = mailto;
        toast.success('Opening your email client...');
      }
      setForm(INITIAL_FORM);
    } catch {
      toast.error('Failed to send message. Please try email directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section py-20" style={{ background: 'var(--color-surface)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading title="Get In Touch" subtitle="Open to job opportunities, collaborations, and interesting conversations" />

        <div className="grid lg:grid-cols-2 gap-10 mt-4">
          {/* Left: Info */}
          <motion.div
            className="glass-strong rounded-2xl p-8"
            style={{ border: '1px solid var(--border-accent)' }}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-space font-bold text-xl mb-6" style={{ color: 'var(--color-text-primary)' }}>
              Contact Info
            </h3>
            <ContactInfo />
          </motion.div>

          {/* Right: Form */}
          <motion.div
            className="glass-strong rounded-2xl p-8"
            style={{ border: '1px solid var(--border-accent)' }}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-space font-bold text-xl mb-6" style={{ color: 'var(--color-text-primary)' }}>
              Send a Message
            </h3>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="form-input w-full px-4 py-3 rounded-xl text-sm"
                  aria-required="true"
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs mt-1"
                    style={{ color: '#FF6B6B' }}
                  >{errors.name}</motion.p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="form-input w-full px-4 py-3 rounded-xl text-sm"
                  aria-required="true"
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs mt-1"
                    style={{ color: '#FF6B6B' }}
                  >{errors.email}</motion.p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                  Subject
                </label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="form-input w-full px-4 py-3 rounded-xl text-sm"
                  style={{ cursor: 'pointer' }}
                >
                  {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                  Message *
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project or opportunity..."
                  rows={5}
                  className="form-input w-full px-4 py-3 rounded-xl text-sm resize-none"
                  aria-required="true"
                  aria-invalid={!!errors.message}
                />
                {errors.message && (
                  <motion.p
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs mt-1"
                    style={{ color: '#FF6B6B' }}
                  >{errors.message}</motion.p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 btn-ripple cursor-pointer disabled:opacity-70"
                style={{ background: 'var(--gradient-accent)', color: 'white' }}
                aria-label="Send message"
              >
                {loading ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
