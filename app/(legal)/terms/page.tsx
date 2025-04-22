import AcceptPolicySection from "@/components/common/AcceptPolicySection";

export default function TermsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-red-600 mb-4">Termeni și Condiții</h1>
      <p className="mb-4">
        Bine ați venit la Red Fox - Școala de Șoferi. Prin utilizarea acestei aplicații,
        sunteți de acord cu următoarele condiții:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Trebuie să aveți minim 18 ani pentru a vă înscrie la cursuri.</li>
        <li>Toate informațiile furnizate trebuie să fie corecte și actuale.</li>
        <li>Este interzisă folosirea aplicației în scopuri ilegale sau abuzive.</li>
        <li>Respectarea programărilor și a instructorilor este obligatorie.</li>
      </ul>
      <AcceptPolicySection />
    </div>
  );
}