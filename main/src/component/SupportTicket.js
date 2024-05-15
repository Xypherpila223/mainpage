import React, { useState, useEffect } from 'react';
import '../ticket.css';

function SupportTicket() {
    const [ticketNumber, setTicketNumber] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchTicketNumber = async () => {
            try {
                const response = await fetch('http://localhost:3010/getNextTicketNumber');
                if (!response.ok) {
                    throw new Error('Failed to fetch ticket number');
                }
                const data = await response.json();
                setTicketNumber(data.ticketNumber);
            } catch (error) {
                console.error('Error fetching ticket number:', error);
            }
        };

        fetchTicketNumber();

        const interval = setInterval(fetchTicketNumber, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!ticketNumber) {
            console.error('Ticket number not available. Please wait and try again.');
            return;
        }

        const formData = new FormData(e.target);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        formObject.ticketNumber = ticketNumber;

        try {
            const response = await fetch('http://localhost:3010/Ticketsubmit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formObject)
            });

            if (response.ok) {
                setSubmitted(true);
                window.alert('Form submitted successfully!');
                window.location.href = '/ThanksTicket';
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit form');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            if (!submitted) {
                window.alert('Failed to submit form. Please try again.');
            }
        }
    };

    return (
        <div className="ticket">
            <div className="ticket-header">
                <h2 className="ticket-title">Support Ticket</h2>
                {ticketNumber && <p><strong className="ticket-number" style={{ color: 'blue', fontSize: '2rem' }}>#{ticketNumber}</strong></p>}
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="firstname" className="label">First Name:</label>
                    <input type="text" id="firstname" name="firstname" className="input-field" required />
                </div>
                <div className="form-group">
                    <label htmlFor="surname" className="label">Surname:</label>
                    <input type="text" id="surname" name="surname" className="input-field" required />
                </div>
                <div className="form-group">
                    <label htmlFor="section" className="label">Section:</label>
                    <input type="text" id="section" name="section" className="input-field" required />
                </div>
                <div className="form-group">
                    <label htmlFor="course" className="label">Course:</label>
                    <input type="text" id="course" name="course" className="input-field" required />
                </div>
                <div className="form-group">
                    <label htmlFor="email" className="label">Email:</label>
                    <input type="email" id="email" name="email" className="input-field" required />
                </div>
                <div className="form-group">
                    <label htmlFor="number" className="label">Phone Number:</label>
                    <input type="tel" id="number" name="number" className="input-field" required />
                </div>
                <div className="form-group">
                    <label htmlFor="message" className="label">Message:</label>
                    <textarea id="message" name="message" className="input-field" rows="4" required></textarea>
                </div>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}

export default SupportTicket;
