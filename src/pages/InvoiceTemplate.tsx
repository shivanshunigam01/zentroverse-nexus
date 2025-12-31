import React, { forwardRef } from "react";
import type { Estimate } from "@/redux/api/estimationApi";
import "./invoice.css";
import logo from "../../public/logo.png"; 

interface Props {
  estimate: Estimate;
}

const InvoiceTemplate = forwardRef<HTMLDivElement, Props>(({ estimate }, ref) => {
  const calculateItemTotal = (item: any) => {
    const partTotal = item.qty * item.rate;
    const subtotal = partTotal + (item.labourCost || 0);
    const taxAmount = (subtotal * item.tax) / 100;
    return subtotal + taxAmount;
  };

  const subtotal = estimate.items.reduce(
    (sum, item) => {
      const partTotal = item.qty * item.rate;
      const labourCost = item.labourCost || 0;
      return sum + partTotal + labourCost;
    },
    0
  );
  
  const taxAmount = estimate.grandTotal - subtotal;
  const taxRate = subtotal > 0 ? ((taxAmount / subtotal) * 100).toFixed(2) : "0.00";

  return (
    <div ref={ref} className="invoice-root">
      {/* HEADER */}
      <div className="invoice-header">
        <img src={logo} alt="Zentroverse Logo" className="invoice-company-logo" />
        <div className="invoice-company">
          <h1 className="invoice-company-name">ZENTROVERSE GLOBAL PVT LTD</h1>
          <p className="invoice-company-subtitle">ERP System</p>
        </div>
        <h2 className="invoice-title">ESTIMATE</h2>
      </div>

      {/* META INFO */}
      <div className="invoice-meta">
        <div className="invoice-meta-left">
          <p className="invoice-meta-item">
            <span className="invoice-meta-label">Estimate ID:</span>
            <span className="invoice-meta-value">{estimate.estimateId}</span>
          </p>
          <p className="invoice-meta-item">
            <span className="invoice-meta-label">Job No:</span>
            <span className="invoice-meta-value">{estimate.jobNo}</span>
          </p>
        </div>
        <div className="invoice-meta-right">
          <p className="invoice-meta-item">
            <span className="invoice-meta-label">Date:</span>
            <span className="invoice-meta-value">{new Date(estimate.date).toLocaleDateString()}</span>
          </p>
          <p className="invoice-meta-item">
            <span className="invoice-meta-label">Terms:</span>
            <span className="invoice-meta-value">Due on Receipt</span>
          </p>
        </div>
      </div>

      {/* BILL TO */}
      <div className="invoice-bill-to">
        <h4 className="invoice-bill-to-title">Bill To:</h4>
        <p className="invoice-bill-to-name">{estimate.customerName}</p>
        <p className="invoice-bill-to-detail">Vehicle: {estimate.vehicleDetails}</p>
        {estimate.registrationNo && (
          <p className="invoice-bill-to-detail">Registration: {estimate.registrationNo}</p>
        )}
      </div>

      {/* TABLE */}
      <table className="invoice-table">
        <thead className="invoice-table-head">
          <tr>
            <th className="invoice-table-th">#</th>
            <th className="invoice-table-th invoice-table-th-desc">Item & Description</th>
            <th className="invoice-table-th invoice-table-th-number">Qty</th>
            <th className="invoice-table-th invoice-table-th-number">Rate</th>
            <th className="invoice-table-th invoice-table-th-number">Amount</th>
          </tr>
        </thead>
        <tbody className="invoice-table-body">
          {estimate.items.map((item, i) => (
            <tr key={i} className="invoice-table-row">
              <td className="invoice-table-td invoice-table-td-center">{i + 1}</td>
              <td className="invoice-table-td invoice-table-td-desc">
                {item.part}{item.labour ? `, ${item.labour}` : ""}
              </td>
              <td className="invoice-table-td invoice-table-td-number">
                {parseFloat(item.qty.toString()).toFixed(2)}
              </td>
              <td className="invoice-table-td invoice-table-td-number">
                ₹{parseFloat(item.rate.toString()).toFixed(2)}
              </td>
              <td className="invoice-table-td invoice-table-td-number invoice-table-td-bold">
                ₹{(item.lineTotal || calculateItemTotal(item)).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTALS */}
      <div className="invoice-totals">
        <div className="invoice-totals-row">
          <p className="invoice-totals-label">Sub Total:</p>
          <p className="invoice-totals-value">₹{subtotal.toFixed(2)}</p>
        </div>
        <div className="invoice-totals-row invoice-totals-row-highlight">
          <p className="invoice-totals-label">Tax Rate:</p>
          <p className="invoice-totals-value">{taxRate}%</p>
        </div>
        <div className="invoice-totals-row invoice-totals-row-highlight invoice-totals-row-grand">
          <p className="invoice-totals-label">Total:</p>
          <p className="invoice-totals-value invoice-totals-value-grand">
            ₹{estimate.grandTotal.toFixed(2)}
          </p>
        </div>
        <div className="invoice-totals-row invoice-totals-row-grand">
          <p className="invoice-totals-label invoice-totals-label-bold">Balance Due:</p>
          <p className="invoice-totals-value invoice-totals-value-bold">
            ₹{estimate.grandTotal.toFixed(2)}
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="invoice-footer">
        <p className="invoice-footer-thanks">Thanks for shopping with us.</p>
        <div className="invoice-footer-terms">
          <p className="invoice-footer-terms-title">Terms & Conditions</p>
          <p className="invoice-footer-terms-text">
            Full payment is due upon receipt of this estimate. Late payments may incur additional charges or interest as per the applicable laws.
          </p>
        </div>
      </div>
    </div>
  );
});

InvoiceTemplate.displayName = "InvoiceTemplate";

export default InvoiceTemplate;

