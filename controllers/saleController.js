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
    const invoiceHTML = `
      <div style="font-family: Arial; padding: 30px;">
        <h2 style="color:#4f46e5;">Sociodeals Invoice</h2>
        <p>Hi ${customerName},</p>
        <p>Thank you for your purchase request.</p>

        <table style="width:100%; border-collapse: collapse; margin-top:20px;">
          <tr>
            <td style="padding:10px; border:1px solid #ddd;">Account</td>
            <td style="padding:10px; border:1px solid #ddd;">${username}</td>
          </tr>
          <tr>
            <td style="padding:10px; border:1px solid #ddd;">Price</td>
            <td style="padding:10px; border:1px solid #ddd;">₹${price}</td>
          </tr>
          <tr>
            <td style="padding:10px; border:1px solid #ddd;">Phone</td>
            <td style="padding:10px; border:1px solid #ddd;">${phone}</td>
          </tr>
        </table>

        <p style="margin-top:20px;">
          Our team will contact you shortly to complete the transaction.
        </p>

        <p>— Team Sociodeals</p>
      </div>
    `;

    // 🔹 Send Email to Customer
    await mg.messages.create("mail.sociodeals.com", {
      from: "Sociodeals <no-reply@mail.sociodeals.com>",
      to: [email],
      subject: "Your Invoice – Sociodeals",
      html: invoiceHTML,
    });

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