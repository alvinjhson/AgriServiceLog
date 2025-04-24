export type Tractor = {
    id: number;
    name: string;
    model: string;
    serialNumber: string;
    lastService: string;
    nextService: string;
    latestHours: number;
    serviceHistory: ServiceHistory[];
    userMachineId: string;
};
export type ServiceHistory = {
    date: string;
    hours: number;
    checklist: ChecklistItem[];
  };
  
  export type ChecklistItem = {
    label: string;
    checked: boolean;
    notes: string;
  };
  




