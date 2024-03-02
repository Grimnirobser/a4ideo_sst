import { Badge } from "@/components/ui/badge";
interface StatusBasedTagProps {
    status: Boolean | undefined;
  }
   
export const StatusBasedTag:React.FC<StatusBasedTagProps> = ({
    status,
  }) => {

    return status ? (
        <Badge variant="passed">PASSED</Badge> 
    ):(
        <Badge variant="destructive">UNPASSED</Badge>
    )
  }

