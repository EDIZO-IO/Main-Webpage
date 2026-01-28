import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Social media icons as SVG components
const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

// Arattai - Tamil chat app icon
const ArattaiIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
        <circle cx="8" cy="10" r="1.5" />
        <circle cx="12" cy="10" r="1.5" />
        <circle cx="16" cy="10" r="1.5" />
    </svg>
);

// Official Facebook "f" logo
const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

// Official Instagram camera icon
const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
);

// Official X (Twitter) logo
const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

// Official YouTube play icon
const YouTubeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

const socialLinks = [
    {
        name: 'WhatsApp',
        url: 'https://whatsapp.com/channel/0029VbAcqFjG3R3hEF6IsT2O',
        icon: <WhatsAppIcon />,
        gradient: 'from-green-400 to-emerald-600',
        shadowColor: 'rgba(37, 211, 102, 0.5)',
    },
    {
        name: 'Arattai',
        url: 'https://aratt.ai/@edizo_official',
        icon: <ArattaiIcon />,
        gradient: 'from-emerald-400 to-teal-600',
        shadowColor: 'rgba(52, 211, 153, 0.5)',
    },
    {
        name: 'YouTube',
        url: 'https://youtube.com/@edizo_official?si=EXnhLt8M6BmaCt3a',
        icon: <YouTubeIcon />,
        gradient: 'from-red-500 to-red-700',
        shadowColor: 'rgba(239, 68, 68, 0.5)',
    },
    {
        name: 'Facebook',
        url: 'https://www.facebook.com/profile.php?id=61576742758066',
        icon: <FacebookIcon />,
        gradient: 'from-blue-500 to-blue-700',
        shadowColor: 'rgba(59, 130, 246, 0.5)',
    },
    {
        name: 'Instagram',
        url: 'https://www.instagram.com/edizo_official',
        icon: <InstagramIcon />,
        gradient: 'from-pink-500 via-purple-500 to-orange-400',
        shadowColor: 'rgba(236, 72, 153, 0.5)',
    },
    {
        name: 'X',
        url: 'https://x.com/edizo_official',
        icon: <XIcon />,
        gradient: 'from-gray-700 to-gray-900',
        shadowColor: 'rgba(55, 65, 81, 0.5)',
    },
];

const SocialMediaFab = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = useCallback(() => setIsOpen(prev => !prev), []);

    return (
        <>
            {/* Background Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/20  z-40"
                        onClick={toggleMenu}
                    />
                )}
            </AnimatePresence>

            {/* FAB Container */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-center gap-3">
                {/* Social Media Links */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col-reverse gap-3 mb-2"
                        >
                            {socialLinks.map((link, index) => (
                                <motion.a
                                    key={link.name}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Connect with us on ${link.name}`}
                                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                                    transition={{ delay: index * 0.05, duration: 0.2 }}
                                    whileHover={{ scale: 1.15, x: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group relative flex items-center"
                                >
                                    {/* Tooltip */}
                                    <motion.span
                                        initial={{ opacity: 0, x: 10 }}
                                        whileHover={{ opacity: 1, x: 0 }}
                                        className="absolute right-full mr-4 px-4 py-2 rounded-xl text-sm font-bold text-white whitespace-nowrap pointer-events-none"
                                        style={{
                                            background: 'rgba(15, 23, 42, 0.9)',
                                            backdropFilter: 'blur(8px)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                                        }}
                                    >
                                        {link.name}
                                        <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full border-8 border-transparent border-l-slate-900/90" />
                                    </motion.span>

                                    {/* Icon Button */}
                                    <div
                                        className="flex items-center justify-center w-12 h-12 rounded-2xl text-white backdrop-blur-3xl"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.15)',
                                            border: '1px solid rgba(255, 255, 255, 0.25)',
                                            boxShadow: `0 8px 32px ${link.shadowColor}`,
                                        }}
                                    >
                                        <div className={`p-2 rounded-xl bg-gradient-to-br ${link.gradient}`}>
                                            {link.icon}
                                        </div>
                                    </div>
                                </motion.a>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main FAB Button */}
                <motion.button
                    onClick={toggleMenu}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative flex items-center justify-center w-16 h-16 rounded-2xl text-white shadow-2xl focus:outline-none focus:ring-4 focus:ring-orange-400/50"
                    style={{
                        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.95) 0%, rgba(239, 68, 68, 0.95) 100%)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        boxShadow: '0 8px 40px rgba(249, 115, 22, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                    }}
                    aria-label={isOpen ? 'Close social media menu' : 'Open social media menu'}
                    aria-expanded={isOpen}
                >
                    {/* Glow Effect */}
                    {!isOpen && (
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 blur-xl -z-10"
                        />
                    )}

                    {isOpen ? <CloseIcon /> : <ShareIcon />}
                </motion.button>

                {/* Pulse Ring Animation when closed */}
                {!isOpen && (
                    <motion.div
                        animate={{ scale: [1, 1.5, 1.5], opacity: [0.4, 0, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-2xl border-2 border-orange-400 pointer-events-none"
                    />
                )}
            </div>
        </>
    );
};

export default SocialMediaFab;
