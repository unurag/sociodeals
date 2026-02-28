const Sales = require("../models/saleModel");
const Product = require("../models/productModel");

const Mailgun = require("mailgun.js");
const formData = require("form-data");

const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY, // put this in .env
});

// 🔹 ADD SALE
// const addSale = async (req, res) => {
//   try {
//     const { username, customerName, email, phone, price } = req.body;

//     if (!username || !customerName || !email || !phone || !price) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     await Sales.findOneAndUpdate(
//       { username },
//       {
//         $push: {
//           details: { customerName, email, phone, price }
//         }
//       },
//       { upsert: true, new: true }
//     );

//     res.status(200).json({ message: "Sale saved successfully" });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
const addSale = async (req, res) => {
  try {
    const { username, customerName, email, phone, price } = req.body;

    if (!username || !customerName || !email || !phone || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔹 Save Sale
    await Sales.findOneAndUpdate(
      { username },
      {
        $push: {
          details: { customerName, email, phone, price }
        }
      },
      { upsert: true, new: true }
    );

    // 🔹 Invoice HTML Template
const bannerUrl = "https://sociodeals.com/banner.png"; // 🔹 replace with your real banner URL

const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>
<body style="margin:0; padding:0; background-color:#f4f6f9; font-family:Arial, sans-serif;">
  
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9; padding:20px 0;">
    <tr>
      <td align="center">
        
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
          
          <!-- 🔹 Banner -->
          <tr>
            <td>
              <img src="${bannerUrl}" alt="Sociodeals Banner" width="100%" style="display:block;">
            </td>
          </tr>

          <!-- 🔹 Content -->
          <tr>
            <td style="padding:30px;">
              
              <h2 style="margin-top:0; color:#2563eb;">
                Invoice Confirmation
              </h2>

              <p style="color:#555; font-size:15px;">
                Hi <strong>${customerName}</strong>,
              </p>

              <p style="color:#555; font-size:15px;">
                Thank you for your purchase request. Below are your order details:
              </p>

              <!-- 🔹 Invoice Table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px; border-collapse:collapse;">
                
                <tr>
                  <td style="padding:12px; background:#f1f5f9; border:1px solid #e5e7eb;"><strong>Account</strong></td>
                  <td style="padding:12px; border:1px solid #e5e7eb;">${username}</td>
                </tr>

                <tr>
                  <td style="padding:12px; background:#f1f5f9; border:1px solid #e5e7eb;"><strong>Price</strong></td>
                  <td style="padding:12px; border:1px solid #e5e7eb; color:#16a34a; font-weight:bold;">₹${price}</td>
                </tr>

                <tr>
                  <td style="padding:12px; background:#f1f5f9; border:1px solid #e5e7eb;"><strong>Phone</strong></td>
                  <td style="padding:12px; border:1px solid #e5e7eb;">${phone}</td>
                </tr>

              </table>

              <p style="margin-top:25px; font-size:14px; color:#555;">
                Our team will contact you shortly to complete the transaction.
              </p>

              <p style="margin-top:30px; font-size:14px; color:#888;">
                — Team Sociodeals<br/>
                <a href="https://sociodeals.com" style="color:#2563eb; text-decoration:none;">
                  www.sociodeals.com
                </a>
              </p>

            </td>
          </tr>

          <!-- 🔹 Footer -->
          <tr>
            <td style="background:#f9fafb; text-align:center; padding:15px; font-size:12px; color:#9ca3af;">
              © ${new Date().getFullYear()} Sociodeals. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

    // 🔹 Send Email to Customer
    await mg.messages.create("mail.sociodeals.com", {
      from: "Sociodeals <no-reply@mail.sociodeals.com>",
      to: [email],
      subject: "Your Invoice – Sociodeals",
      html: invoiceHTML,
    });
    console.log('mail sent');

    // 🔹 Send Email to Admin
    await mg.messages.create("mail.sociodeals.com", {
      from: "Sociodeals <no-reply@mail.sociodeals.com>",
      to: ["singhanurag0108@gmail.com"],
      subject: "New Sale Notification",
      html: `
        <h3>New Sale Received</h3>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Account:</strong> ${username}</p>
        <p><strong>Price:</strong> ₹${price}</p>
      `,
    });

    res.status(200).json({ message: "Sale saved & emails sent successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 GET ALL SALES
const getSales = async (req, res) => {
  try {
    const sales = await Sales.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch sales" });
  }
};

// // 🔹 DELETE SALE
// const deleteSale = async (req, res) => {
//   try {
//     const sale = await Sales.findByIdAndDelete(req.params.id);

//     if (!sale) {
//       return res.status(404).json({ message: "Sale not found" });
//     }

//     res.json({ message: "Sale deleted successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Delete failed" });
//   }
// };
// 🔹 DELETE SALE + RELATED PRODUCT
const deleteSale = async (req, res) => {
  try {
    // First find sale
    const sale = await Sales.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    // 🔹 Delete related product using username
    await Product.findOneAndDelete({ username: sale.username });

    // 🔹 Delete sale
    await Sales.findByIdAndDelete(req.params.id);

    res.json({ message: "Sale and related product deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};

module.exports = { addSale, getSales, deleteSale };