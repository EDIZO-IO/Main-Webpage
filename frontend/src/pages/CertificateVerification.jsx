// frontend/src/pages/CertificateVerification.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle,
    XCircle,
    Info,
    Search,
    Award,
    Calendar,
    User,
    BookOpen,
    Shield,
    Sparkles,
    ArrowLeft,
    Eye,
    Share2,
    X,
    ExternalLink
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import logo from '../assets/images/logo.png';
import brandName from '../assets/images/brand-name.png';
import signature from '../assets/images/logo.png'; // Using logo as stamp/signature for now

// API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const CertificateVerification = () => {
    const [certificateId, setCertificateId] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showCertificateModal, setShowCertificateModal] = useState(false);
    const [searchParams] = useSearchParams();

    const navigate = useNavigate();
    const opacity = 0;
    const y = 20;
    const x = 0;
    const scale = 1;
    const stiffness = 100;
    const damping = 10;
    const duration = 1;
    const rotate = 360;
    const ease = "linear";
    const top = 0;
    const left = 0;
    const bottom = 0;
    const zIndex = 1;
    const repeat = Infinity;

    // Auto-verify if ID is provided in URL
    useEffect(() => {
        const idFromUrl = searchParams.get('id');
        if (idFromUrl) {
            setCertificateId(idFromUrl.toUpperCase());
            // Trigger verification after setting the ID
            verifyById(idFromUrl);
        }
    }, [searchParams]);

    const verifyById = async (id) => {
        setVerificationResult(null);
        setError('');
        setIsLoading(true);

        const trimmedId = id.trim();

        if (!trimmedId) {
            setError('Please enter a certificate ID.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/certificates/${encodeURIComponent(trimmedId)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok && data.isValid) {
                setVerificationResult({ isValid: data.isValid, data: data.data });
            } else {
                setVerificationResult({
                    isValid: data.isValid,
                    message: data.message || 'Certificate not found.'
                });
            }
        } catch (err) {
            console.error("Verification failed:", err);
            setError('Network error. Please check your connection and try again.');
            setVerificationResult(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async () => {
        verifyById(certificateId);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleVerify();
        }
    };

    const handleShareLink = () => {
        if (!verificationResult?.data) return;

        const shareUrl = `${window.location.origin}/verification?id=${encodeURIComponent(verificationResult.data.certificateId)}`;
        navigator.clipboard.writeText(shareUrl);
        alert('Verification link copied to clipboard!');
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        try {
            // Check if dateStr is already formatted or standard date string
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <>
            <PageHeader
                title="Certificate Verification"
                subtitle="Verify the authenticity of internship certificates issued by EDIZO"
            />

            <section className="py-16 bg-gradient-to-b from-white to-gray-50 min-h-[60vh]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Link */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-8"
                    >
                        <button
                            onClick={() => navigate('/internships')}
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Internships
                        </button>
                    </motion.div>

                    {/* Verification Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden"
                    >
                        {/* Card Header */}
                        <div className="bg-gradient-to-r from-red-600 to-orange-500 p-6 text-white">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                    <Shield className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Verify Certificate</h2>
                                    <p className="text-white/80">Enter the unique Certificate ID to verify authenticity</p>
                                </div>
                            </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-8">
                            {/* Search Input */}
                            <div className="mb-6">
                                <label htmlFor="certificateId" className="block text-gray-700 text-sm font-semibold mb-2">
                                    Certificate ID
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="certificateId"
                                        className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-800 placeholder-gray-400 text-lg transition-all"
                                        placeholder="e.g., EDIZO-WEB-DEV-2024-001"
                                        value={certificateId}
                                        onChange={(e) => setCertificateId(e.target.value.toUpperCase())}
                                        onKeyPress={handleKeyPress}
                                        disabled={isLoading}
                                    />
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                </div>
                                <p className="text-gray-500 text-sm mt-2">
                                    The certificate ID can be found at the bottom of your certificate
                                </p>
                            </div>

                            {/* Verify Button */}
                            <motion.button
                                onClick={handleVerify}
                                disabled={isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold py-4 px-6 rounded-xl hover:from-red-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                            >
                                {isLoading ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate }}
                                            transition={{ duration, ease: "linear", repeat: Infinity }}
                                        >
                                            <Search className="w-5 h-5" />
                                        </motion.div>
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        <Award className="w-5 h-5" />
                                        Verify Certificate
                                    </>
                                )}
                            </motion.button>

                            {/* Error Message */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3"
                                    >
                                        <XCircle className="w-5 h-5 flex-shrink-0" />
                                        <p className="font-medium">{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Verification Result */}
                            <AnimatePresence>
                                {verificationResult && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        className="mt-8"
                                    >
                                        {verificationResult.isValid && verificationResult.data ? (
                                            <div className="bg-green-50 border-2 border-green-200 rounded-2xl overflow-hidden">
                                                {/* Success Header */}
                                                <div className="bg-green-100 p-6 text-center border-b border-green-200">
                                                    <motion.div
                                                        initial={{ scale }}
                                                        animate={{ scale }}
                                                        transition={{ type: "spring", stiffness, delay: 0.2 }}
                                                    >
                                                        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-3" />
                                                    </motion.div>
                                                    <h3 className="text-2xl font-bold text-green-800">Certificate Verified!</h3>
                                                    <p className="text-green-600">This certificate is authentic and valid</p>
                                                </div>

                                                {/* Certificate Details */}
                                                <div className="p-6 space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-green-100">
                                                            <Award className="w-5 h-5 text-green-600 mt-0.5" />
                                                            <div>
                                                                <p className="text-sm text-gray-500">Certificate ID</p>
                                                                <p className="font-bold text-gray-900">{verificationResult.data.certificateId}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-green-100">
                                                            <User className="w-5 h-5 text-green-600 mt-0.5" />
                                                            <div>
                                                                <p className="text-sm text-gray-500">Intern Name</p>
                                                                <p className="font-bold text-gray-900">{verificationResult.data.internName}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-green-100">
                                                            <BookOpen className="w-5 h-5 text-green-600 mt-0.5" />
                                                            <div>
                                                                <p className="text-sm text-gray-500">Program</p>
                                                                <p className="font-bold text-gray-900">{verificationResult.data.programName}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-green-100">
                                                            <Sparkles className="w-5 h-5 text-green-600 mt-0.5" />
                                                            <div>
                                                                <p className="text-sm text-gray-500">Status</p>
                                                                <p className="font-bold text-green-600">{verificationResult.data.status}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                                        <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-green-100">
                                                            <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
                                                            <div>
                                                                <p className="text-sm text-gray-500">Start Date</p>
                                                                <p className="font-semibold text-gray-900">{formatDate(verificationResult.data.startDate)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-green-100">
                                                            <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
                                                            <div>
                                                                <p className="text-sm text-gray-500">End Date</p>
                                                                <p className="font-semibold text-gray-900">{formatDate(verificationResult.data.endDate)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-green-100">
                                                            <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
                                                            <div>
                                                                <p className="text-sm text-gray-500">Issue Date</p>
                                                                <p className="font-semibold text-gray-900">{formatDate(verificationResult.data.issueDate)}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
                                                            onClick={() => setShowCertificateModal(true)}
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            View Certificate
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                                                            onClick={handleShareLink}
                                                        >
                                                            <Share2 className="w-4 h-4" />
                                                            Share Link
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
                                                <motion.div
                                                    initial={{ scale }}
                                                    animate={{ scale }}
                                                    transition={{ type: "spring", stiffness }}
                                                >
                                                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                                                </motion.div>
                                                <h3 className="text-2xl font-bold text-red-800 mb-2">Certificate Not Found</h3>
                                                <p className="text-red-600 mb-4">{verificationResult.message}</p>
                                                <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                                                    <Info className="w-4 h-4" />
                                                    <span>Double-check the ID or contact support if you believe this is an error.</span>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Info Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200"
                    >
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Info className="w-5 h-5 text-red-500" />
                            About Certificate Verification
                        </h3>
                        <ul className="text-gray-600 space-y-2 text-sm">
                            <li>• All EDIZO internship certificates have a unique Certificate ID</li>
                            <li>• The Certificate ID format: EDIZO-[PROGRAM]-[YEAR]-[NUMBER]</li>
                            <li>• Certificates are issued upon successful completion of the internship program</li>
                            <li>• For Object issues, contact us at <a href="mailto:edizoofficial@gmail.com" className="text-red-600 hover:underline">edizoofficial@gmail.com</a></li>
                        </ul>
                    </motion.div>
                </div>
            </section>

            {/* Certificate View Modal */}
            <AnimatePresence>
                {showCertificateModal && verificationResult?.data && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowCertificateModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 10 }}
                            className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setShowCertificateModal(false)}
                                className="absolute top-4 right-4 z-10 p-2 bg-white/90 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-700" />
                            </button>

                            {/* Certificate Content - Exact Template Match */}
                            <div
                                style={{
                                    width: '100%',
                                    aspectRatio: '1.414 / 1',
                                    backgroundColor: '#ffffff',
                                    fontFamily: "'Inter', 'Segoe UI', sans-serif",
                                    color: '#333',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* --- Top & Bottom Red Borders --- */}
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '12px', backgroundColor: '#ef4444', zIndex: 10 }}></div>
                                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '12px', backgroundColor: '#ef4444', zIndex: 10 }}></div>

                                {/* --- Right Side EDIZO Logo --- */}
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    right: '5%',
                                    transform: 'translateY(-50%)',
                                    zIndex: 1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <img
                                        src={logo}
                                        alt="EDIZO Logo"
                                        style={{
                                            width: 'clamp(250px, 25vw, 480px)',
                                            height: 'auto',
                                            opacity: 0.9
                                        }}
                                    />
                                </div>

                                {/* --- Watermark (Light red EDIZO logo in center) --- */}
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '35%',
                                    transform: 'translate(-50%, -50%)',
                                    opacity: 0.06,
                                    zIndex: 0,
                                    pointerEvents: 'none'
                                }}>
                                    <img src={logo} alt="Watermark" style={{ width: '400px', height: 'auto' }} />
                                </div>

                                {/* --- Main Content Container --- */}
                                <div style={{
                                    position: 'relative',
                                    zIndex,
                                    padding: '35px 30px 30px 50px',
                                    height: '100%',
                                    boxSizing: 'border-box',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}>

                                    {/* Header: EDIZO Logo on Left, MSME + QR on Right */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px', paddingRight: '40%' }}>
                                        {/* Edizo Logo + PVT LTD */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <img src={logo} alt="Edizo Logo" style={{ height: '55px', objectFit: 'contain' }} />
                                            <div>
                                                <div style={{
                                                    fontSize: 'clamp(24px, 4vw, 32px)',
                                                    fontWeight: '900',
                                                    color: '#ef4444',
                                                    letterSpacing: '2px',
                                                    lineHeight
                                                }}>EDIZO</div>
                                                <div style={{
                                                    fontSize: 'clamp(12px, 2vw, 16px)',
                                                    fontWeight: '700',
                                                    color: '#ef4444',
                                                    letterSpacing: '3px'
                                                }}>PVT LTD</div>
                                            </div>
                                        </div>

                                        {/* MSME & QR */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{
                                                    fontWeight: '900',
                                                    fontSize: 'clamp(14px, 2vw, 18px)',
                                                    lineHeight: '1',
                                                    color: '#1f2937',
                                                    fontFamily: 'Arial Black, sans-serif',
                                                    letterSpacing: '0px'
                                                }}>MSME</div>
                                                <div style={{ fontSize: '5px', fontWeight: 'bold', color: '#333' }}>सूक्ष्म, लघु एवं मध्यम उद्यम</div>
                                                <div style={{ fontSize: '4px', fontWeight: 'bold', color: '#333' }}>MICRO, SMALL & MEDIUM ENTERPRISES</div>
                                            </div>
                                            {/* QR Code Placeholder */}
                                            <div style={{
                                                width: '35px',
                                                height: '35px',
                                                border: '1px solid #333',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: 'linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)',
                                                backgroundSize: '6px 6px',
                                                backgroundPosition: '0 0, 0 3px, 3px -3px, -3px 0px'
                                            }}>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Body */}
                                    <div style={{ flex, paddingLeft: '5px', maxWidth: '60%' }}>
                                        {/* CERTIFICATE Title - Red Italic Style */}
                                        <h1 style={{
                                            fontSize: 'clamp(36px, 6vw, 56px)',
                                            fontFamily: "'Times New Roman', Georgia, serif",
                                            fontStyle: 'italic',
                                            fontWeight: 'normal',
                                            color: '#ef4444',
                                            margin: '0 0 0 0',
                                            letterSpacing: '3px',
                                            textShadow: '1px 1px 0px rgba(0,0,0,0.1)'
                                        }}>
                                            CERTIFICATE
                                        </h1>

                                        {/* of Completion - Red Cursive */}
                                        <h2 style={{
                                            fontSize: 'clamp(16px, 2.5vw, 22px)',
                                            fontFamily: "'Times New Roman', Georgia, serif",
                                            fontStyle: 'italic',
                                            fontWeight: '400',
                                            color: '#ef4444',
                                            margin: '0 0 20px 0',
                                        }}>
                                            of Completion
                                        </h2>

                                        {/* This is to certify that */}
                                        <p style={{
                                            fontSize: 'clamp(11px, 1.5vw, 14px)',
                                            color: '#333',
                                            marginBottom: '8px',
                                            fontWeight: '400'
                                        }}>
                                            This is to certify that
                                        </p>

                                        {/* Candidate Name */}
                                        <div style={{
                                            fontSize: 'clamp(22px, 4vw, 36px)',
                                            fontWeight: '800',
                                            color: '#000',
                                            margin: '5px 0 15px 0',
                                            fontFamily: "'Times New Roman', Georgia, serif",
                                        }}>
                                            {verificationResult.data.internName}
                                        </div>

                                        {/* Description */}
                                        <p style={{
                                            fontSize: 'clamp(10px, 1.4vw, 13px)',
                                            color: '#333',
                                            lineHeight: '1.6',
                                            marginBottom: '15px',
                                            maxWidth: '100%'
                                        }}>
                                            has successfully completed the <strong>{verificationResult.data.programName}</strong> webinar conducted by EDIZO on <strong>{formatDate(verificationResult.data.issueDate)}</strong> via Zoom.
                                        </p>

                                        {/* Certificate ID and Date */}
                                        <div style={{ fontSize: 'clamp(8px, 1.1vw, 10px)', color: '#ef4444', marginBottom: '20px' }}>
                                            <p style={{ margin: '2px 0', fontWeight: '600' }}>CERTIFICATE ID: {verificationResult.data.certificateId}</p>
                                            <p style={{ margin: '2px 0', fontWeight: '600' }}>DATE: {formatDate(verificationResult.data.issueDate)}</p>
                                        </div>
                                    </div>

                                    {/* Footer: Signatures */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-end',
                                        maxWidth: '55%',
                                        paddingLeft: '10px',
                                        marginBottom: '25px'
                                    }}>
                                        {/* Mentor Signature */}
                                        <div style={{ textAlign: 'center', width: '100px' }}>
                                            <div style={{ width: '100%', height: '1px', backgroundColor: '#333', marginBottom: '5px' }}></div>
                                            <p style={{ fontSize: '10px', fontWeight: '600', color: '#333', margin: '0', letterSpacing: '1px' }}>MENTOR</p>
                                        </div>

                                        {/* CEO Signature */}
                                        <div style={{ textAlign: 'center', width: '100px' }}>
                                            {/* Signature Image - handwritten style */}
                                            <div style={{
                                                height: '25px',
                                                marginBottom: '0px',
                                                display: 'flex',
                                                alignItems: 'flex-end',
                                                justifyContent: 'center',
                                                fontFamily: "'Brush Script MT', cursive",
                                                fontSize: '18px',
                                                color: '#333'
                                            }}>
                                                <img src={signature} alt="CEO Signature" style={{ height: '25px', objectFit: 'contain' }} />
                                            </div>
                                            <div style={{ width: '100%', height: '1px', backgroundColor: '#333', marginBottom: '5px', marginTop: '3px' }}></div>
                                            <p style={{ fontSize: '10px', fontWeight: '600', color: '#333', margin: '0', letterSpacing: '1px' }}>CEO</p>
                                        </div>
                                    </div>

                                    {/* Footer URL */}
                                    <div style={{
                                        width: '100%',
                                        textAlign: 'center',
                                        position: 'absolute',
                                        bottom: '18px',
                                        left: 0,
                                        zIndex: 10
                                    }}>
                                        <p style={{
                                            fontSize: '12px',
                                            fontWeight: '900',
                                            color: '#000',
                                            letterSpacing: '2px',
                                            margin: 0
                                        }}>WWW.EDIZO.IN</p>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                                <div className="flex items-center gap-2 text-green-600">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-medium text-sm">Verified Certificate</span>
                                </div>
                                <button
                                    onClick={handleShareLink}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-gray-700 font-medium text-sm"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Copy Share Link
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CertificateVerification;
