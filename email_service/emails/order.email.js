const createOrderConfirmedMail = (to, name, id, total) => {
    const message = {
        to: to,
        from: "kalrakrishna26@gmail.com",
        subject: `Order Confirmation - #${id}`,
        html: `
      <p>Hi ${name},</p>
      <p>Thank you for your purchase! We’ve received your order and are currently processing it.</p>
      <p><strong>Order Id (Order #${id})</strong></p>
      <p>Total: <strong>$${total}</strong></p>
      <p align="center"><strong><a href="#">[ &nbsp;&nbsp;&nbsp;View Order Status&nbsp;&nbsp;&nbsp; ]</a></strong></p>
      <p>We will send you another email with tracking information as soon as your items ship.</p>
      <p>If you have any questions or need to make changes, please reply to this email.</p>
      <p>Best regards,<br>The Team</p>
    `,
    };
    return message;
};

const createOrderFailedMail = (to, name, id) => {
    const message = {
        to: to,
        from: "kalrakrishna26@gmail.com",
        subject: `Action Required: Issue with your order #${id}`,
        html: `
      <p>Hi ${name},</p>
      <p>We’re writing to let you know that we couldn't complete your recent order (#${id}).</p>
      <p>This usually happens due to a payment processing error or an issue verifying inventory for the items in your cart. Your payment method has not been charged.</p>
      <p>To complete your purchase, please update your payment details or try checking out again:</p>
      <p align="center"><strong><a href="#">[ &nbsp;&nbsp;&nbsp;Update Payment & Retry Order&nbsp;&nbsp;&nbsp; ]</a></strong></p>
      <p>If you continue to experience issues or believe this is an error, just reply to this email and we'll gladly look into it for you.</p>
      <p>Best regards,<br>The Team</p>
    `,
    };
    return message;
};

export{ createOrderConfirmedMail, createOrderFailedMail };