"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AcceptPolicySection() {
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();

  const handleContinue = () => {
    if (agreed) {
      router.push("/login");
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="agree"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="w-4 h-4 border-muted bg-background text-primary rounded"
        />
        <label htmlFor="agree" className="text-sm">
          Sunt de acord cu politica de confidențialitate și termenii Red Fox
        </label>
      </div>
      <button
        onClick={handleContinue}
        disabled={!agreed}
        className={`mt-4 px-6 py-2 rounded text-white font-medium transition ${
          agreed ? "bg-red-600 hover:bg-red-700" : "bg-muted cursor-not-allowed"
        }`}
      >
        Continuă
      </button>
    </div>
  );
}
