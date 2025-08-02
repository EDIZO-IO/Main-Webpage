import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Info } from 'lucide-react'; // Import icons for better UI

// CertificateVerification component for verifying internship certificates
const CertificateVerification = () => {
    // State to store the certificate ID entered by the user
    const [certificateId, setCertificateId] = useState('');
    // State to store the verification result data
    const [verificationResult, setVerificationResult] = useState(null);
    // State to manage loading status during API calls
    const [isLoading, setIsLoading] = useState(false);
    // State to store any error messages
    const [error, setError] = useState('');

    const navigate = useNavigate(); // Initialize navigate hook

    /**
     * Handles the certificate verification process.
     * Makes an API call to the Node.js backend to verify the certificate.
     */
    const handleVerify = async () => {
        // Clear previous results and errors
        setVerificationResult(null);
        setError('');
        setIsLoading(true); // Set loading state to true

        const trimmedId = certificateId.trim();

        if (!trimmedId) {
            setError('Please enter a certificate ID.');
            setIsLoading(false);
            return;
        }

        try {
            // This URL should point to your Node.js backend's GET endpoint for certificates
            const response = await fetch(`http://localhost:3001/api/certificates/${trimmedId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                // If the API call was successful (status 200)
                if (data.isValid) {
                    setVerificationResult({ isValid: true, data: data.data });
                } else {
                    setVerificationResult({ isValid: false, message: data.message || 'Certificate not found.' });
                }
            } else {
                // If the API call returned an error status (e.g., 404, 500)
                setError(data.message || 'An error occurred during verification.');
                setVerificationResult(null); // Clear any previous valid results
            }
        } catch (err) {
            // Catch any network errors or issues with the fetch request
            console.error("Verification failed:", err);
            setError('Network error or server issue. Please ensure the backend is running and accessible.');
            setVerificationResult(null); // Clear any previous valid results
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 font-inter">
            {/* Tailwind CSS CDN - Included for self-contained example in Canvas */}
            <script src="https://cdn.tailwindcss.com"></script>
            {/* Inter Font - Included for self-contained example in Canvas */}
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
            <style>
                {`
                .font-inter {
                    font-family: 'Inter', sans-serif;
                }
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                `}
            </style>

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
                    Certificate Verification
                </h1>

                <p className="text-gray-600 mb-6 text-center">
                    Enter the unique Certificate ID to verify its authenticity.
                </p>

                <div className="mb-6">
                    <label htmlFor="certificateId" className="block text-gray-700 text-sm font-medium mb-2">
                        Certificate ID
                    </label>
                    <input
                        type="text"
                        id="certificateId"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400 text-base shadow-sm"
                        placeholder="e.g., EDIZO-WEB-DEV-2024-001"
                        value={certificateId}
                        onChange={(e) => setCertificateId(e.target.value)}
                        disabled={isLoading}
                    />
                </div>

                <button
                    onClick={handleVerify}
                    className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verifying...
                        </>
                    ) : (
                        'Verify Certificate'
                    )}
                </button>

                {error && (
                    <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center shadow-md animate-fade-in flex items-center justify-center">
                        <XCircle className="mr-2" size={20} />
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                {verificationResult && (
                    <div className={`mt-6 p-4 rounded-lg shadow-md animate-fade-in ${verificationResult.isValid ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}>
                        {verificationResult.isValid ? (
                            <div className="flex flex-col items-center text-center">
                                <CheckCircle className="text-green-600 mb-3" size={48} />
                                <p className="text-2xl font-bold mb-3">Certificate Valid!</p>
                                <div className="text-left w-full space-y-2">
                                    <p><strong className="font-semibold">Intern Name:</strong> {verificationResult.data.internName}</p>
                                    <p><strong className="font-semibold">Program:</strong> {verificationResult.data.programName}</p>
                                    <p><strong className="font-semibold">Start Date:</strong> {new Date(verificationResult.data.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    <p><strong className="font-semibold">End Date:</strong> {new Date(verificationResult.data.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    <p><strong className="font-semibold">Issue Date:</strong> {new Date(verificationResult.data.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    <p><strong className="font-semibold">Status:</strong> {verificationResult.data.status}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-center">
                                <XCircle className="text-red-600 mb-3" size={48} />
                                <p className="text-2xl font-bold">Certificate Not Found or Invalid.</p>
                                <p className="text-lg mt-2">{verificationResult.message}</p>
                                <p className="text-sm text-gray-600 mt-4 flex items-center">
                                    <Info className="mr-1" size={16} />
                                    Please double-check the ID or contact support if you believe this is an error.
                                </p>
                            </div>
                        )}
                    </div>
                )}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/internships')}
                        className="text-blue-600 hover:underline text-sm"
                    >
                        Back to Internships
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CertificateVerification;
