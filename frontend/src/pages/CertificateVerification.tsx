// frontend/src/pages/CertificateVerification.tsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
    Download,
    Share2
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import logo from '../assets/images/logo.png';
import brandName from '../assets/images/brand-name.png';
import signature from '../assets/images/logo.png'; // Using logo as stamp/signature for now

// API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface CertificateData {
    certificateId: string;
    internName: string;
    programName: string;
    startDate: string;
    endDate: string;
    issueDate: string;
    status: string;
    email?: string;
}

interface VerificationResult {
    isValid: boolean;
    data?: CertificateData;
    message?: string;
}

const CertificateVerification: React.FC = () => {
    const [certificateId, setCertificateId] = useState('');
    const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const certificateRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    const handleDownloadPDF = async () => {
        if (!certificateRef.current || !verificationResult?.data) return;

        try {
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`EDIZO_Certificate_${verificationResult.data.certificateId}.pdf`);
        } catch (err) {
            console.error("PDF generation failed:", err);
            alert("Failed to generate PDF. Please try again.");
        }
    };

    const handleVerify = async () => {
        setVerificationResult(null);
        setError('');
        setIsLoading(true);

        const trimmedId = certificateId.trim();

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
                setVerificationResult({ isValid: true, data: data.data });
            } else {
                setVerificationResult({
                    isValid: false,
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

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleVerify();
        }
    };

    const formatDate = (dateStr: string) => {
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
                variant="internships"
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
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
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
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
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
                                                            onClick={handleDownloadPDF}
                                                        >
                                                            <Download className="w-4 h-4" />
                                                            Download Certificate
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(window.location.href + '?id=' + verificationResult.data?.certificateId);
                                                                alert('Verification link copied!');
                                                            }}
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
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring", stiffness: 200 }}
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
                            <li>• For any issues, contact us at <a href="mailto:edizoofficial@gmail.com" className="text-red-600 hover:underline">edizoofficial@gmail.com</a></li>
                        </ul>
                    </motion.div>
                </div>
            </section>

            {/* Hidden Certificate Template for PDF Generation */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                <div
                    ref={certificateRef}
                    style={{
                        width: '1123px',
                        height: '794px', // A4 Landscape
                        backgroundColor: '#ffffff',
                        fontFamily: "'Inter', 'Segoe UI', sans-serif",
                        color: '#333',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* --- Top & Bottom Red Borders --- */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '24px', backgroundColor: '#ef4444', zIndex: 10 }}></div>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '24px', backgroundColor: '#ef4444', zIndex: 10 }}></div>

                    {/* --- Right Side Graphic (Abstract Shapes) --- */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '350px',
                        height: '100%',
                        zIndex: 1,
                        overflow: 'hidden'
                    }}>
                        {/* Large Red Blob on Right */}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            right: '-140px',
                            transform: 'translateY(-50%)',
                            width: '450px',
                            height: '700px',
                            backgroundColor: '#ef4444', // Red color
                            borderRadius: '100px 0 0 100px / 50% 0 0 50%', // Asymmetric curve
                            zIndex: 2,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {/* White Circle Cutout inside the red blob (Top) */}
                            <div style={{
                                position: 'absolute',
                                top: '25%',
                                left: '40px',
                                width: '180px',
                                height: '180px',
                                backgroundColor: '#ffffff',
                                borderRadius: '50%',
                                zIndex: 3,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                {/* Inner Red Ring/Dot */}
                                <div style={{
                                    width: '90px',
                                    height: '90px',
                                    border: '20px solid #ef4444',
                                    borderRadius: '50%',
                                }}></div>
                            </div>

                            {/* White Circle Cutout inside the red blob (Bottom) */}
                            <div style={{
                                position: 'absolute',
                                bottom: '-30px',
                                left: '70px',
                                width: '120px',
                                height: '120px',
                                backgroundColor: '#ffffff',
                                borderRadius: '50%',
                                zIndex: 3
                            }}></div>
                        </div>
                    </div>

                    {/* --- Watermark --- */}
                    <div style={{
                        position: 'absolute',
                        top: '55%',
                        left: '45%',
                        transform: 'translate(-50%, -50%)',
                        opacity: 0.04,
                        zIndex: 0
                    }}>
                        <img src={logo} alt="Watermark" style={{ width: '500px', height: 'auto', filter: 'grayscale(100%)' }} />
                    </div>


                    {/* --- Main Content Container --- */}
                    <div style={{
                        position: 'relative',
                        zIndex: 5,
                        padding: '70px 60px 0px 80px', // Adjusted padding
                        height: '100%',
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>

                        {/* Header: Logos */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px', paddingRight: '250px' }}>
                            {/* Edizo Logo */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <img src={logo} alt="Edizo Logo" style={{ height: '70px', objectFit: 'contain' }} />
                                <img src={brandName} alt="Edizo Text" style={{ height: '35px', objectFit: 'contain' }} />
                            </div>

                            {/* MSME & QR */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    {/* MSME Logo Simulator */}
                                    <div style={{ fontWeight: '900', fontSize: '24px', lineHeight: '1', color: '#1f2937', fontFamily: 'Arial, sans-serif', letterSpacing: '-1px' }}>IIISIIIE</div>
                                    <div style={{ fontSize: '7px', fontWeight: 'bold' }}>सूक्ष्म, लघु एवं मध्यम उद्यम</div>
                                    <div style={{ fontSize: '6px', fontWeight: 'bold' }}>MICRO, SMALL & MEDIUM ENTERPRISES</div>
                                </div>
                                {/* QR Code */}
                                <div style={{ width: '45px', height: '45px', border: '2px solid #333', padding: '2px' }}>
                                    <div style={{ width: '100%', height: '100%', backgroundColor: '#000', opacity: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{ width: '10px', height: '10px', backgroundColor: '#fff' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Body */}
                        <div style={{ flex: 1, paddingLeft: '10px', maxWidth: '650px' }}>
                            {/* Title */}
                            <h1 style={{
                                fontSize: '64px',
                                fontFamily: "'Times New Roman', serif", // Serif for "CERTIFICATE"
                                textTransform: 'uppercase',
                                fontWeight: 'normal',
                                color: '#333',
                                margin: '0',
                                letterSpacing: '4px',
                                // Trying to simulate the outline/fancy look
                                textShadow: '2px 2px 0px #e5e7eb'
                            }}>
                                CERTIFICATE
                            </h1>
                            <h2 style={{
                                fontSize: '32px',
                                fontFamily: "sans-serif",
                                fontWeight: '700',
                                color: '#4b5563',
                                margin: '-10px 0 40px 5px',
                            }}>
                                of Completion
                            </h2>

                            <p style={{ fontSize: '20px', color: '#444', marginBottom: '15px' }}>
                                This is to certify that
                            </p>

                            {/* Candidate Name */}
                            <div style={{
                                fontSize: '50px',
                                fontWeight: '800',
                                color: '#111827',
                                margin: '10px 0 25px 0',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                {verificationResult?.data?.internName || '{{NAME}}'}
                            </div>

                            {/* Description */}
                            <p style={{ fontSize: '18px', color: '#374151', lineHeight: '1.6', marginBottom: '30px', maxWidth: '600px' }}>
                                has successfully completed the <strong>{verificationResult?.data?.programName}</strong> internship conducted by <strong>EDIZO</strong> from <strong>{formatDate(verificationResult?.data?.startDate || '')}</strong> to <strong>{formatDate(verificationResult?.data?.endDate || '')}</strong> via Online Mode.
                            </p>

                            <div style={{ fontSize: '12px', color: '#4b5563', marginBottom: '40px' }}>
                                <p style={{ margin: '4px 0' }}><strong>CERTIFICATE ID:</strong> {verificationResult?.data?.certificateId}</p>
                                <p style={{ margin: '4px 0' }}><strong>DATE:</strong> {formatDate(verificationResult?.data?.issueDate || '')}</p>
                            </div>
                        </div>

                        {/* Footer: Signatures */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px', maxWidth: '600px', paddingLeft: '20px' }}>
                            {/* Mentor Signature */}
                            <div style={{ textAlign: 'center', width: '150px' }}>
                                <div style={{ width: '100%', height: '1px', backgroundColor: '#333', marginBottom: '8px' }}></div>
                                <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#444' }}>MENTOR</p>
                            </div>

                            {/* CEO Signature */}
                            <div style={{ textAlign: 'center', width: '150px' }}>
                                <img src={signature} alt="Signature" style={{ height: '40px', marginBottom: '0px', marginLeft: 'auto', marginRight: 'auto', display: 'block' }} />
                                <div style={{ width: '100%', height: '1px', backgroundColor: '#333', marginBottom: '8px', marginTop: '5px' }}></div>
                                <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#444' }}>CEO</p>
                            </div>
                        </div>

                        {/* Footer URL */}
                        <div style={{ width: '100%', textAlign: 'center', position: 'absolute', bottom: '30px', left: 0 }}>
                            <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', letterSpacing: '2px' }}>WWW.EDIZO.IN</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CertificateVerification;
