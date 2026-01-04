// Reservation Button and Modal Component
import React, { useState } from 'react';
import { createReservation, formatTimeRemaining } from './api/reservations';
import { useAuth } from './contexts/AuthContext';

export const ReservationButton = ({ listing, onReservationCreated }) => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const { user } = useAuth();

    // Check if listing is already reserved
    const isReserved = listing.reserved_by && listing.reserved_until && new Date(listing.reserved_until) > new Date();
    const isOwnListing = user && listing.user_id === user.id;

    const handleReserve = async () => {
        if (!user) {
            alert('Bitte melden Sie sich an, um eine Reservierung vorzunehmen.');
            return;
        }

        if (!agreedToTerms) {
            alert('Bitte akzeptieren Sie die Bedingungen.');
            return;
        }

        setLoading(true);
        try {
            const reservation = await createReservation(listing.id, user.id, 24);
            alert('Reservierung erfolgreich! Der Artikel ist für 24 Stunden für Sie reserviert.');
            setShowModal(false);
            if (onReservationCreated) {
                onReservationCreated(reservation);
            }
            // Reload page to show updated status
            window.location.reload();
        } catch (error) {
            alert(error.message || 'Fehler beim Erstellen der Reservierung. Bitte versuchen Sie es erneut.');
        } finally {
            setLoading(false);
        }
    };

    // Don't show button if it's user's own listing
    if (isOwnListing) {
        return null;
    }

    // Show reserved badge if already reserved
    if (isReserved) {
        const timeRemaining = formatTimeRemaining(listing.reserved_until);
        return (
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 flex items-center gap-3">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                    <p className="font-semibold text-yellow-900">Reserviert</p>
                    <p className="text-sm text-yellow-700">Noch {timeRemaining} verfügbar</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Reservieren (24h)
            </button>

            {/* Reservation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto" onClick={() => setShowModal(false)}>
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />

                        {/* Modal panel */}
                        <div
                            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Artikel reservieren
                                        </h3>
                                        <div className="mt-4 space-y-4">
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-sm font-medium text-gray-900">{listing.title}</p>
                                                <p className="text-lg font-bold text-red-600 mt-1">{listing.price}₺</p>
                                            </div>

                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <div className="flex items-start gap-2">
                                                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <div className="text-sm text-blue-900">
                                                        <p className="font-semibold">Reservierungsdauer: 24 Stunden</p>
                                                        <p className="mt-1">Der Artikel wird für Sie reserviert und ist in dieser Zeit für andere Nutzer nicht verfügbar.</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="terms"
                                                    checked={agreedToTerms}
                                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                                    className="mt-1 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor="terms" className="text-sm text-gray-700">
                                                    Ich verpflichte mich, den Artikel innerhalb von 24 Stunden zu kaufen oder die Reservierung zu stornieren.
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                                <button
                                    type="button"
                                    disabled={loading || !agreedToTerms}
                                    onClick={handleReserve}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Wird reserviert...' : 'Jetzt reservieren'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                >
                                    Abbrechen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
