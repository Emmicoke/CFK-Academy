import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { supabase } from "./lib/supabaseClient";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Clean, minimal CSS
const cleanStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #ffffff;
  }

  .navbar {
    background-color: #ffffff !important;
    border-bottom: 1px solid #e9ecef;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .navbar-brand {
    color: #333 !important;
    font-weight: 600;
  }

  .nav-link {
    color: #666 !important;
    font-weight: 500;
  }

  .nav-link:hover {
    color: #333 !important;
  }

  .btn {
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .btn:hover {
    transform: translateY(-1px);
  }

  .card {
    border: 1px solid #e9ecef;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: all 0.2s ease;
  }

  .card:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  }

  .form-control, .form-select {
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 12px 16px;
  }

  .form-control:focus, .form-select:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
  }

  .alert {
    border-radius: 8px;
    border: none;
  }

  .table {
    border-radius: 8px;
    overflow: hidden;
  }

  .dropdown-menu {
    border: 1px solid #e9ecef;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  }

  .modal-content {
    border-radius: 12px;
    border: none;
  }

  .progress {
    border-radius: 8px;
  }

  .badge {
    border-radius: 6px;
  }

  .pagination .page-link {
    border-radius: 6px;
    margin: 0 2px;
  }

  .list-group-item {
    border-radius: 8px;
    margin-bottom: 4px;
  }

  .nav-tabs .nav-link {
    border-radius: 8px 8px 0 0;
  }

  .nav-pills .nav-link {
    border-radius: 8px;
  }

  .accordion-button {
    border-radius: 8px;
  }

  .carousel {
    border-radius: 12px;
    overflow: hidden;
  }

  .spinner-border {
    border-width: 0.2em;
  }

  .form-floating > .form-control,
  .form-floating > .form-select {
    border-radius: 8px;
  }

  .input-group-text {
    border-radius: 8px;
  }

  .btn-group .btn {
    border-radius: 8px;
  }

  footer {
    background-color: #f8f9fa;
    border-top: 1px solid #e9ecef;
    color: #666;
  }

  .hero-section {
    background-color: #f8f9fa;
  }

  .section {
    padding: 60px 0;
  }

  .section-light {
    background-color: #ffffff;
  }

  .section-gray {
    background-color: #f8f9fa;
  }

  .text-muted {
    color: #6c757d !important;
  }

  .text-primary {
    color: #007bff !important;
  }

  .text-success {
    color: #28a745 !important;
  }

  .text-warning {
    color: #ffc107 !important;
  }

  .text-info {
    color: #17a2b8 !important;
  }

  .text-danger {
    color: #dc3545 !important;
  }

  .bg-primary {
    background-color: #007bff !important;
  }

  .bg-success {
    background-color: #28a745 !important;
  }

  .bg-warning {
    background-color: #ffc107 !important;
  }

  .bg-info {
    background-color: #17a2b8 !important;
  }

  .bg-danger {
    background-color: #dc3545 !important;
  }

  .bg-light {
    background-color: #f8f9fa !important;
  }

  .border {
    border: 1px solid #e9ecef !important;
  }

  .shadow-sm {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
  }

  .shadow {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important;
  }

  .shadow-lg {
    box-shadow: 0 8px 16px rgba(0,0,0,0.1) !important;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .hero-section {
      padding: 40px 0;
    }
    
    .section {
      padding: 40px 0;
    }
  }
`;

// Inject clean styles
const styleSheet = document.createElement("style");
styleSheet.textContent = cleanStyles;
document.head.appendChild(styleSheet);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <App />
    </SessionContextProvider>
  </React.StrictMode>
);
