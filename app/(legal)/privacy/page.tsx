import AcceptPolicySection from "@/components/common/AcceptPolicySection";


export default function PrivacyPolicyPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-red-600 mb-4">Politica de Confidențialitate</h1>
      <p className="mb-4">
        Red Fox - Școala de Șoferi respectă confidențialitatea datelor dumneavoastră. Iată cum protejăm datele personale:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Colectăm doar datele strict necesare pentru înscriere și contact.</li>
        <li>Nu partajăm datele dumneavoastră cu terți fără consimțământul explicit.</li>
        <li>Datele sunt stocate în condiții de securitate și protejate prin criptare.</li>
        <li>Aveți dreptul de a solicita oricând modificarea sau ștergerea datelor.</li>
      </ul>
      <AcceptPolicySection />
    </div>
  );
}
