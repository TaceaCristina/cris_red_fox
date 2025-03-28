import { Badge } from "../ui/badge";


export const manualTransmission = () => <Badge variant="outline">Manuală</Badge>;
export const automaticTransmission = () => <Badge variant="outline">automată</Badge>;
export const bothTransmissions = () => (
  <div>
    <Badge variant="outline">manuală</Badge>{" "}
    <Badge variant="outline">automată</Badge>{" "}
  </div>
);