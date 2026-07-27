"use client";

import React from "react";
import PhoneInputWithCountry from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface PhoneInputProps {
  value?: string;
  onChange: (value?: string) => void;
  placeholder?: string;
}

export function PhoneInput({ value, onChange, placeholder = "+380 66 123 4567" }: PhoneInputProps) {
  return (
    <div className="phone-input-custom-wrapper">
      <PhoneInputWithCountry
        international
        defaultCountry="UA"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="flex items-center gap-2 bg-slate-950/40 border border-white/10 focus-within:border-teal-400/50 rounded-xl px-3.5 h-11 text-white text-sm"
      />
      <style jsx global>{`
        .phone-input-custom-wrapper .PhoneInputInput {
          background: transparent !important;
          border: none !important;
          outline: none !important;
          color: #ffffff !important;
          font-size: 0.875rem !important;
          width: 100% !important;
          box-shadow: none !important;
        }
        .phone-input-custom-wrapper .PhoneInputInput::placeholder {
          color: #64748b !important;
        }
        .phone-input-custom-wrapper .PhoneInputCountrySelect {
          background: #0f172a !important;
          color: #ffffff !important;
          border-radius: 0.5rem !important;
        }
        .phone-input-custom-wrapper .PhoneInputCountrySelectOption {
          background: #0f172a !important;
          color: #ffffff !important;
        }
        .phone-input-custom-wrapper .PhoneInputCountryIcon {
          border-radius: 4px;
          overflow: hidden;
          width: 22px;
          height: 15px;
          box-shadow: 0 0 4px rgba(0,0,0,0.3);
        }
        .phone-input-custom-wrapper .PhoneInputCountrySelectArrow {
          color: #94a3b8 !important;
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}
