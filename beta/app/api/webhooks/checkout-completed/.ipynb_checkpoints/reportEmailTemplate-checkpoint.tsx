import React from 'react';

interface EmailTemplateProps {
  reportIds: string[];
  customerId: string | null;
}

const EmailTemplate: React.FC<EmailTemplateProps> = ({ reportIds, customerId }) => {
  const displayCustomerId = customerId ? `Customer ID: ${customerId}` : ''
  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6',
        color: '#333',
        margin: '0',
        padding: '0',
      }}
    >
      <table
        width="100%"
        cellSpacing="0"
        cellPadding="0"
        style={{
          backgroundColor: '#f9f9f9',
          padding: '20px',
        }}
      >
        <tr>
          <td style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px' }}>
            <h1
              style={{
                color: '#2b2b2b',
                fontSize: '24px',
                marginBottom: '20px',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              Thank You for Your Purchase! {displayCustomerId}
            </h1>
            <p
              style={{
                fontSize: '16px',
                color: '#555555',
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              Below are your unique report IDs:
            </p>
            <ul
              style={{
                paddingLeft: '20px',
                listStyleType: 'circle',
                fontSize: '16px',
                color: '#333',
                marginBottom: '20px',
              }}
            >
              {reportIds.map((id, index) => (
                <li key={index} style={{ marginBottom: '10px' }}>
                  Report ID: <strong>{id}</strong> -{' '}
                  <a
                    href={`${process.env.NEXTAUTH_URL}/redeem-a-report`}
                    style={{
                      color: '#4CAF50',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                    }}
                  >
                    Redeem Now
                  </a>
                </li>
              ))}
            </ul>
            <p
              style={{
                fontSize: '16px',
                color: '#555555',
                textAlign: 'center',
                marginBottom: '20px',
              }}
            >
              You can use these IDs to redeem your reports at any time. If you have any questions, feel free to reach out to us.
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '30px',
              }}
            >
              <a
                href={`mailto:${process.env.EMAIL_USER}?subject=Question about redeeming report&body=Hello, I have a question about redeeming my report.`}
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#4CAF50',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '5px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              >
                Contact Support
              </a>
            </div>

            <div
              style={{
                marginTop: '40px',
                textAlign: 'center',
                fontSize: '14px',
                color: '#777777',
              }}
            >
              <p>Best regards,</p>
              <p>
                The <strong>Landwise Analytica</strong> Team
              </p>
              <p>
                <small>
                  If you did not make this purchase, please ignore this email or contact support.
                </small>
              </p>
            </div>
          </td>
        </tr>
      </table>
    </div>
  );
};

export default EmailTemplate;
