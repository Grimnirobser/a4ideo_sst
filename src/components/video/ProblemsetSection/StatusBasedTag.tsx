import { Button } from "@/components/ui/button"

interface StatusBasedTagProps {
    status: Boolean | undefined;
  }
   
export const StatusBasedTag:React.FC<StatusBasedTagProps> = ({
    status,
  }) => {

    return status ? (
        <Button variant="passed">PASSED</Button> 
    ):(
        <Button variant="destructive">UNPASSED</Button>
    )
  }

