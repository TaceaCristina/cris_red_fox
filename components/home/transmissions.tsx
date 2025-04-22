import { Badge } from "../ui/badge";


export const manualTransmission = () => <Badge variant="outline">Manuală</Badge>;
export const automaticTransmission = () => <Badge variant="outline">Automată</Badge>;
export const bothTransmissions = () => (
  <div>
    <Badge variant="outline">Manuală</Badge>{" "}
    <Badge variant="outline">Automată</Badge>{" "}
  </div>
);