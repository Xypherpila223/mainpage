import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../thanksticket.css';


function ThanksTicket() {
    const [customerName, setCustomerName] = useState('');
    const [ticketNumber, setTicketNumber] = useState('');

    useEffect(() => {
        axios.get('https://pcg81mqc-3010.asse.devtunnels.ms/ticketinfo')
            .then(response => {
                setCustomerName(response.data.customerName);
                setTicketNumber(response.data.ticketNumber);
            })
            .catch(error => {
                console.error('Error fetching ticket information:', error);
            });
    }, []);

    return (
        <div className="thank-you-message">
            <h2>Thank You for Submitting a Support Ticket</h2>
            <p>Dear {customerName},</p>
            <p>Thank you for reaching out to us with your support ticket. We have received your request and will work diligently to address your concerns as quickly as possible.</p>
            <p>Your ticket number is: <strong className="ticket-number" style={{ color: 'blue', fontSize: '2rem' }} >#{ticketNumber}</strong></p>
            <p>Please keep this ticket number for your reference. If you have any further questions or need additional assistance, feel free to reply to this email or contact our support team at <a href="mailto:sccinventory@email.com">support@email.com</a> or <a href="tel:+20241305">+1 (234) 567-89</a>.</p>
            <p>We appreciate your patience and understanding.</p>
            <p>Best regards,<br />[SCCINVEOTORY]</p>
            <a href="/" className="btn">Go Back</a>
        </div>
    );
}

export default ThanksTicket;
